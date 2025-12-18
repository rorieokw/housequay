import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/analytics - Get host analytics
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to view analytics' },
        { status: 401 }
      )
    }

    // Get all listings for this host
    const listings = await prisma.listing.findMany({
      where: { hostId: session.user.id },
      select: { id: true, title: true, pricePerNight: true, status: true },
    })

    if (listings.length === 0) {
      return NextResponse.json({
        totalListings: 0,
        activeListings: 0,
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0,
        totalEarnings: 0,
        pendingEarnings: 0,
        averageRating: 0,
        totalReviews: 0,
        recentBookings: [],
        monthlyEarnings: [],
        listingPerformance: [],
      })
    }

    const listingIds = listings.map((l) => l.id)

    // Get all bookings for host's listings
    const bookings = await prisma.booking.findMany({
      where: { listingId: { in: listingIds } },
      include: {
        listing: {
          select: { id: true, title: true },
        },
        guest: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get all reviews for host's listings
    const reviews = await prisma.review.findMany({
      where: { listingId: { in: listingIds } },
      select: { overall: true },
    })

    // Calculate stats
    const totalBookings = bookings.length
    const pendingBookings = bookings.filter((b) => b.status === 'PENDING').length
    const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED').length
    const completedBookings = bookings.filter((b) => b.status === 'COMPLETED').length
    const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED').length

    // Calculate earnings (only from confirmed and completed bookings)
    const paidBookings = bookings.filter(
      (b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED'
    )
    const totalEarnings = paidBookings.reduce((sum, b) => sum + b.total, 0)

    // Pending earnings (confirmed but not completed)
    const pendingEarnings = bookings
      .filter((b) => b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + b.total, 0)

    // Average rating
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.overall, 0) / reviews.length
        : 0

    // Recent bookings (last 10)
    const recentBookings = bookings.slice(0, 10).map((b) => ({
      id: b.id,
      listingTitle: b.listing.title,
      guestName: b.guest.name,
      guestImage: b.guest.image,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      totalPrice: b.total,
      status: b.status,
      createdAt: b.createdAt,
    }))

    // Monthly earnings for the last 12 months
    const now = new Date()
    const monthlyEarnings = []
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

      const monthBookings = paidBookings.filter((b) => {
        const bookingDate = new Date(b.createdAt)
        return bookingDate >= monthStart && bookingDate <= monthEnd
      })

      const earnings = monthBookings.reduce((sum, b) => sum + b.total, 0)
      const count = monthBookings.length

      monthlyEarnings.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        year: monthStart.getFullYear(),
        earnings,
        bookings: count,
      })
    }

    // Listing performance
    const listingPerformance = await Promise.all(
      listings.map(async (listing) => {
        const listingBookings = bookings.filter((b) => b.listingId === listing.id)
        const listingReviews = await prisma.review.findMany({
          where: { listingId: listing.id },
          select: { overall: true },
        })

        const earnings = listingBookings
          .filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
          .reduce((sum, b) => sum + b.total, 0)

        const avgRating =
          listingReviews.length > 0
            ? listingReviews.reduce((sum, r) => sum + r.overall, 0) / listingReviews.length
            : 0

        return {
          id: listing.id,
          title: listing.title,
          status: listing.status,
          totalBookings: listingBookings.length,
          earnings,
          averageRating: avgRating,
          reviewCount: listingReviews.length,
        }
      })
    )

    return NextResponse.json({
      totalListings: listings.length,
      activeListings: listings.filter((l) => l.status === 'ACTIVE').length,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalEarnings,
      pendingEarnings,
      averageRating,
      totalReviews: reviews.length,
      recentBookings,
      monthlyEarnings,
      listingPerformance,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
