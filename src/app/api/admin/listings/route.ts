import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/admin/listings - Get all listings (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { host: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (status !== 'all') {
      where.status = status
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        select: {
          id: true,
          title: true,
          city: true,
          state: true,
          pricePerNight: true,
          status: true,
          rating: true,
          reviewCount: true,
          createdAt: true,
          host: {
            select: {
              id: true,
              name: true,
              email: true,
              isSuspended: true,
            },
          },
          images: {
            take: 1,
            orderBy: { order: 'asc' },
            select: { url: true },
          },
          _count: {
            select: {
              bookings: true,
              reports: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ])

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}
