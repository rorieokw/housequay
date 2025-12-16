import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/reviews/[id] - Get a single review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        subject: {
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
            city: true,
            images: { take: 1 },
          },
        },
        booking: {
          select: {
            checkIn: true,
            checkOut: true,
            nights: true,
          },
        },
      },
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error fetching review:', error)
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    )
  }
}

// PATCH /api/reviews/[id] - Host reply to review
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { hostReply } = body

    if (!hostReply || !hostReply.trim()) {
      return NextResponse.json(
        { error: 'Reply content is required' },
        { status: 400 }
      )
    }

    // Get the review
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        listing: true,
      },
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Verify the user is the host of the listing
    if (review.listing.hostId !== session.user.id) {
      return NextResponse.json(
        { error: 'Only the host can reply to reviews' },
        { status: 403 }
      )
    }

    // Update with host reply
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        hostReply: hostReply.trim(),
        hostRepliedAt: new Date(),
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

    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    )
  }
}
