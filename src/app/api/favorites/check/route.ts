import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/favorites/check?listingIds=id1,id2,id3 - Check if listings are favorited
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      // Return empty object if not logged in (favorites will show as not favorited)
      return NextResponse.json({})
    }

    const { searchParams } = new URL(request.url)
    const listingIds = searchParams.get('listingIds')?.split(',').filter(Boolean) || []

    if (listingIds.length === 0) {
      return NextResponse.json({})
    }

    // Get all favorites for these listings
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
        listingId: { in: listingIds },
      },
      select: {
        listingId: true,
      },
    })

    // Create a map of listingId -> isFavorited
    const favoriteMap: Record<string, boolean> = {}
    favorites.forEach((fav) => {
      favoriteMap[fav.listingId] = true
    })

    return NextResponse.json(favoriteMap)
  } catch (error) {
    console.error('Error checking favorites:', error)
    return NextResponse.json(
      { error: 'Failed to check favorites' },
      { status: 500 }
    )
  }
}
