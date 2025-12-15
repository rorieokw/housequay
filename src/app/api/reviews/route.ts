import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/reviews - Get reviews (filter by listingId or userId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('listingId')
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: Record<string, unknown> = {
      isPublic: true,
    }

    if (listingId) {
      where.listingId = listingId
    }

    if (userId) {
      where.subjectId = userId // Reviews about this user (host)
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          listing: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.review.count({ where }),
    ])

    return NextResponse.json({
      reviews,
      total,
      hasMore: offset + reviews.length < total,
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to leave a review' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      bookingId,
      overall,
      cleanliness,
      accuracy,
      communication,
      location,
      value,
      content,
    } = body

    // Validate required fields
    if (!bookingId || !overall || !content) {
      return NextResponse.json(
        { error: 'Booking ID, overall rating, and review content are required' },
        { status: 400 }
      )
    }

    // Validate rating range
    if (overall < 1 || overall > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: {
          include: { host: true },
        },
        review: true,
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
        { error: 'You can only review your own bookings' },
        { status: 403 }
      )
    }

    // Check if booking is completed
    if (booking.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'You can only review completed bookings' },
        { status: 400 }
      )
    }

    // Check if review already exists
    if (booking.review) {
      return NextResponse.json(
        { error: 'You have already reviewed this booking' },
        { status: 400 }
      )
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        overall,
        cleanliness: cleanliness || null,
        accuracy: accuracy || null,
        communication: communication || null,
        location: location || null,
        value: value || null,
        content,
        authorId: session.user.id,
        subjectId: booking.listing.hostId,
        listingId: booking.listingId,
        bookingId: booking.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Update listing rating
    const listingReviews = await prisma.review.findMany({
      where: { listingId: booking.listingId },
      select: { overall: true },
    })

    const avgRating =
      listingReviews.reduce((sum, r) => sum + r.overall, 0) / listingReviews.length

    await prisma.listing.update({
      where: { id: booking.listingId },
      data: {
        rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
        reviewCount: listingReviews.length,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
