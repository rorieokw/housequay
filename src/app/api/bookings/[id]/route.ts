import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/bookings/[id] - Get a single booking
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to view this booking' },
        { status: 401 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phone: true,
          },
        },
        listing: {
          include: {
            host: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                phone: true,
              },
            },
            images: {
              orderBy: { order: 'asc' },
              take: 3,
            },
          },
        },
        review: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Only allow guest or host to view the booking
    const isGuest = booking.guestId === session.user.id
    const isHost = booking.listing.host.id === session.user.id

    if (!isGuest && !isHost) {
      return NextResponse.json(
        { error: 'You do not have permission to view this booking' },
        { status: 403 }
      )
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

// PATCH /api/bookings/[id] - Update booking status (approve/decline/cancel)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to update this booking' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, cancellationReason } = body

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        listing: {
          select: {
            hostId: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    const isGuest = booking.guestId === session.user.id
    const isHost = booking.listing.hostId === session.user.id

    // Handle different actions
    switch (action) {
      case 'approve':
        // Only host can approve pending bookings
        if (!isHost) {
          return NextResponse.json(
            { error: 'Only the host can approve bookings' },
            { status: 403 }
          )
        }
        if (booking.status !== 'PENDING') {
          return NextResponse.json(
            { error: 'Only pending bookings can be approved' },
            { status: 400 }
          )
        }
        await prisma.booking.update({
          where: { id: params.id },
          data: { status: 'CONFIRMED' },
        })
        break

      case 'decline':
        // Only host can decline pending bookings
        if (!isHost) {
          return NextResponse.json(
            { error: 'Only the host can decline bookings' },
            { status: 403 }
          )
        }
        if (booking.status !== 'PENDING') {
          return NextResponse.json(
            { error: 'Only pending bookings can be declined' },
            { status: 400 }
          )
        }
        await prisma.booking.update({
          where: { id: params.id },
          data: { status: 'DECLINED' },
        })
        break

      case 'cancel':
        // Both guest and host can cancel
        if (!isGuest && !isHost) {
          return NextResponse.json(
            { error: 'You do not have permission to cancel this booking' },
            { status: 403 }
          )
        }
        if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
          return NextResponse.json(
            { error: 'This booking cannot be cancelled' },
            { status: 400 }
          )
        }
        await prisma.booking.update({
          where: { id: params.id },
          data: {
            status: 'CANCELLED',
            cancelledAt: new Date(),
            cancelledBy: session.user.id,
            cancellationReason,
          },
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    // Fetch updated booking
    const updatedBooking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
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

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}
