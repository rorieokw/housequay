import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/listings/my - Fetch current user's listings
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to view your listings' },
        { status: 401 }
      )
    }

    const listings = await prisma.listing.findMany({
      where: {
        hostId: session.user.id,
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1, // Only need the first image for preview
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(listings)
  } catch (error) {
    console.error('Error fetching user listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}
