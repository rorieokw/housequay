import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/admin/users/[id] - Get user details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        bio: true,
        role: true,
        isHost: true,
        isSuperhost: true,
        isVerified: true,
        idVerified: true,
        isSuspended: true,
        suspendedAt: true,
        suspendedReason: true,
        createdAt: true,
        updatedAt: true,
        listings: {
          select: {
            id: true,
            title: true,
            city: true,
            status: true,
            rating: true,
            reviewCount: true,
          },
        },
        bookings: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            status: true,
            total: true,
            checkIn: true,
            checkOut: true,
            listing: {
              select: { title: true },
            },
          },
        },
        _count: {
          select: {
            listings: true,
            bookings: true,
            reviewsGiven: true,
            reportsReceived: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/users/[id] - Update user (suspend, change role, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, reason } = body

    // Prevent admin from modifying themselves
    if (id === session.user.id && (action === 'suspend' || action === 'demote')) {
      return NextResponse.json(
        { error: 'Cannot suspend or demote yourself' },
        { status: 400 }
      )
    }

    let updateData: Record<string, unknown> = {}

    switch (action) {
      case 'suspend':
        updateData = {
          isSuspended: true,
          suspendedAt: new Date(),
          suspendedReason: reason || 'Suspended by admin',
        }
        break

      case 'unsuspend':
        updateData = {
          isSuspended: false,
          suspendedAt: null,
          suspendedReason: null,
        }
        break

      case 'makeAdmin':
        updateData = { role: 'ADMIN' }
        break

      case 'demote':
        updateData = { role: 'BOATER' }
        break

      case 'verify':
        updateData = { isVerified: true }
        break

      case 'unverify':
        updateData = { isVerified: false }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isSuspended: true,
        isVerified: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
