import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/listings/[id]/availability - Get booked dates for a listing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get all active bookings for this listing
    const bookings = await prisma.booking.findMany({
      where: {
        listingId: id,
        status: { in: ['PENDING', 'CONFIRMED'] },
        checkOut: { gte: new Date() }, // Only future bookings
      },
      select: {
        checkIn: true,
        checkOut: true,
        status: true,
      },
      orderBy: { checkIn: 'asc' },
    })

    // Get any blocked dates set by the host
    const blockedDates = await prisma.availability.findMany({
      where: {
        listingId: id,
        isBlocked: true,
        date: { gte: new Date() },
      },
      select: {
        date: true,
      },
    })

    return NextResponse.json({
      bookings: bookings.map((b) => ({
        checkIn: b.checkIn.toISOString().split('T')[0],
        checkOut: b.checkOut.toISOString().split('T')[0],
        status: b.status,
      })),
      blockedDates: blockedDates.map((d) => d.date.toISOString().split('T')[0]),
    })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}
