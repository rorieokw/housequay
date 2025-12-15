import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import Stripe from 'stripe'

// Disable body parsing for webhook
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const bookingId = session.metadata?.bookingId

        if (bookingId) {
          // Update booking as paid
          await prisma.booking.update({
            where: { id: bookingId },
            data: {
              paymentStatus: 'COMPLETED',
              paidAt: new Date(),
              status: 'CONFIRMED', // Confirm booking after payment
            },
          })

          console.log(`Payment completed for booking: ${bookingId}`)
        }
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const bookingId = session.metadata?.bookingId

        if (bookingId) {
          // Reset payment status if checkout expired
          await prisma.booking.update({
            where: { id: bookingId },
            data: {
              paymentStatus: 'PENDING',
            },
          })

          console.log(`Checkout expired for booking: ${bookingId}`)
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Find booking by payment intent
        const booking = await prisma.booking.findFirst({
          where: { paymentIntentId: paymentIntent.id },
        })

        if (booking) {
          await prisma.booking.update({
            where: { id: booking.id },
            data: {
              paymentStatus: 'FAILED',
            },
          })

          console.log(`Payment failed for booking: ${booking.id}`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
