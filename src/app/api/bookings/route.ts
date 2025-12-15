import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/bookings - Fetch user's bookings (as guest or host)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to view bookings' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role') || 'guest' // 'guest' or 'host'

    let bookings

    if (role === 'host') {
      // Get bookings for listings owned by this user
      bookings = await prisma.booking.findMany({
        where: {
          listing: {
            hostId: session.user.id,
          },
        },
        include: {
          guest: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          listing: {
            select: {
              id: true,
              title: true,
              city: true,
              images: {
                take: 1,
                orderBy: { order: 'asc' },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    } else {
      // Get bookings made by this user as guest
      bookings = await prisma.booking.findMany({
        where: {
          guestId: session.user.id,
        },
        include: {
          listing: {
            include: {
              host: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              images: {
                take: 1,
                orderBy: { order: 'asc' },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    }

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to make a booking' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      listingId,
      checkIn,
      checkOut,
      boatName,
      boatLength,
      boatType,
      specialRequests,
    } = body

    // Validation
    if (!listingId || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'Listing ID, check-in, and check-out dates are required' },
        { status: 400 }
      )
    }

    // Get the listing
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        host: true,
      },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Check if listing is active
    if (listing.status !== 'ACTIVE' || !listing.isActive) {
      return NextResponse.json(
        { error: 'This listing is not available for booking' },
        { status: 400 }
      )
    }

    // Prevent booking own listing
    if (listing.hostId === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot book your own listing' },
        { status: 400 }
      )
    }

    // Calculate nights and pricing
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (nights < 1) {
      return NextResponse.json(
        { error: 'Check-out must be after check-in' },
        { status: 400 }
      )
    }

    if (nights < listing.minimumStay) {
      return NextResponse.json(
        { error: `Minimum stay is ${listing.minimumStay} nights` },
        { status: 400 }
      )
    }

    // Check for overlapping bookings
    const existingBooking = await prisma.booking.findFirst({
      where: {
        listingId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            AND: [
              { checkIn: { lte: checkInDate } },
              { checkOut: { gt: checkInDate } },
            ],
          },
          {
            AND: [
              { checkIn: { lt: checkOutDate } },
              { checkOut: { gte: checkOutDate } },
            ],
          },
          {
            AND: [
              { checkIn: { gte: checkInDate } },
              { checkOut: { lte: checkOutDate } },
            ],
          },
        ],
      },
    })

    if (existingBooking) {
      return NextResponse.json(
        { error: 'These dates are not available' },
        { status: 400 }
      )
    }

    // Calculate pricing
    const subtotal = nights * listing.pricePerNight
    const cleaningFee = listing.cleaningFee || 0
    const serviceFee = Math.round(subtotal * listing.serviceFee)
    const total = subtotal + cleaningFee + serviceFee

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights,
        pricePerNight: listing.pricePerNight,
        subtotal,
        cleaningFee,
        serviceFee,
        total,
        boatName,
        boatLength: boatLength ? parseFloat(boatLength) : null,
        boatType,
        specialRequests,
        status: listing.instantBook ? 'CONFIRMED' : 'PENDING',
        guestId: session.user.id,
        listingId,
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            city: true,
            instantBook: true,
            host: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
