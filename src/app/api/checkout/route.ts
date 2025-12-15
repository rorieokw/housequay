import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getStripe, formatAmountForStripe } from '@/lib/stripe'

// POST /api/checkout - Create a Stripe checkout session
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to checkout' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { bookingId } = body

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: {
          include: {
            host: true,
            images: { take: 1, orderBy: { order: 'asc' } },
          },
        },
        guest: true,
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Verify the user is the guest
    if (booking.guestId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only pay for your own bookings' },
        { status: 403 }
      )
    }

    // Check booking status
    if (booking.paymentStatus === 'COMPLETED') {
      return NextResponse.json(
        { error: 'This booking has already been paid' },
        { status: 400 }
      )
    }

    if (booking.status === 'CANCELLED' || booking.status === 'DECLINED') {
      return NextResponse.json(
        { error: 'This booking cannot be paid for' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: booking.guest.email,
      client_reference_id: booking.id,
      metadata: {
        bookingId: booking.id,
        listingId: booking.listingId,
        guestId: booking.guestId,
        hostId: booking.listing.hostId,
      },
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: booking.listing.title,
              description: `${booking.nights} night${booking.nights > 1 ? 's' : ''} at ${booking.listing.city}`,
              images: booking.listing.images[0]
                ? [booking.listing.images[0].url]
                : undefined,
            },
            unit_amount: formatAmountForStripe(booking.subtotal),
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: 'Service Fee',
              description: 'HouseQuay service fee',
            },
            unit_amount: formatAmountForStripe(booking.serviceFee),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/bookings/${booking.id}?payment=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/bookings/${booking.id}?payment=cancelled`,
    })

    // Update booking with payment intent
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentIntentId: checkoutSession.payment_intent as string,
        paymentStatus: 'PROCESSING',
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
