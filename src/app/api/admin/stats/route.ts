import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/admin/stats - Get admin dashboard stats
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    // Get counts
    const [
      totalUsers,
      totalHosts,
      suspendedUsers,
      totalListings,
      activeListings,
      pendingListings,
      totalBookings,
      pendingReports,
      totalRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isHost: true } }),
      prisma.user.count({ where: { isSuspended: true } }),
      prisma.listing.count(),
      prisma.listing.count({ where: { status: 'ACTIVE' } }),
      prisma.listing.count({ where: { status: 'PENDING_REVIEW' } }),
      prisma.booking.count(),
      prisma.report.count({ where: { status: 'PENDING' } }),
      prisma.booking.aggregate({
        where: {
          status: { in: ['CONFIRMED', 'COMPLETED'] },
        },
        _sum: { total: true },
      }),
    ])

    // Get recent activity
    const [recentUsers, recentBookings, recentReports] = await Promise.all([
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          isHost: true,
        },
      }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          total: true,
          createdAt: true,
          guest: {
            select: { name: true },
          },
          listing: {
            select: { title: true },
          },
        },
      }),
      prisma.report.findMany({
        where: { status: 'PENDING' },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          reason: true,
          createdAt: true,
          reporter: {
            select: { name: true },
          },
          listing: {
            select: { title: true },
          },
          reportedUser: {
            select: { name: true },
          },
        },
      }),
    ])

    // Calculate monthly stats
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [newUsersThisMonth, newBookingsThisMonth] = await Promise.all([
      prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.booking.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
    ])

    return NextResponse.json({
      counts: {
        totalUsers,
        totalHosts,
        suspendedUsers,
        totalListings,
        activeListings,
        pendingListings,
        totalBookings,
        pendingReports,
        totalRevenue: totalRevenue._sum.total || 0,
      },
      thisMonth: {
        newUsers: newUsersThisMonth,
        newBookings: newBookingsThisMonth,
      },
      recentActivity: {
        users: recentUsers,
        bookings: recentBookings,
        reports: recentReports,
      },
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    )
  }
}
