import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// PATCH /api/admin/listings/[id] - Update listing status (approve, reject, etc.)
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

    let updateData: Record<string, unknown> = {}

    switch (action) {
      case 'approve':
        updateData = { status: 'ACTIVE', isActive: true }
        break

      case 'reject':
        updateData = { status: 'REJECTED', isActive: false }
        // Optionally store rejection reason - would need to add field to schema
        break

      case 'pause':
        updateData = { status: 'PAUSED', isActive: false }
        break

      case 'activate':
        updateData = { status: 'ACTIVE', isActive: true }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        status: true,
        isActive: true,
      },
    })

    return NextResponse.json(updatedListing)
  } catch (error) {
    console.error('Error updating listing:', error)
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/listings/[id] - Delete listing
export async function DELETE(
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

    // Delete the listing
    await prisma.listing.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting listing:', error)
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    )
  }
}
