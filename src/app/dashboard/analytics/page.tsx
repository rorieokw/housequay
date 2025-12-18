'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface RecentBooking {
  id: string
  listingTitle: string
  guestName: string | null
  guestImage: string | null
  checkIn: string
  checkOut: string
  totalPrice: number
  status: string
  createdAt: string
}

interface MonthlyEarning {
  month: string
  year: number
  earnings: number
  bookings: number
}

interface ListingPerformance {
  id: string
  title: string
  status: string
  totalBookings: number
  earnings: number
  averageRating: number
  reviewCount: number
}

interface Analytics {
  totalListings: number
  activeListings: number
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  completedBookings: number
  cancelledBookings: number
  totalEarnings: number
  pendingEarnings: number
  averageRating: number
  totalReviews: number
  recentBookings: RecentBooking[]
  monthlyEarnings: MonthlyEarning[]
  listingPerformance: ListingPerformance[]
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/analytics')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchAnalytics()
    }
  }, [session])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-[var(--muted)] rounded-lg w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-[var(--muted)] rounded-xl" />
              ))}
            </div>
            <div className="h-64 bg-[var(--muted)] rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Find max earnings for chart scaling
  const maxEarnings = analytics
    ? Math.max(...analytics.monthlyEarnings.map((m) => m.earnings), 1)
    : 1

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/dashboard"
                className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
                Analytics Dashboard
              </h1>
            </div>
            <p className="text-[var(--foreground-muted)]">
              Track your hosting performance and earnings
            </p>
          </div>
        </div>

        {!analytics || analytics.totalListings === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-bold mb-2 text-[var(--foreground)]">
              No listings yet
            </h2>
            <p className="text-[var(--foreground-muted)] mb-6 max-w-sm mx-auto">
              Create your first listing to start tracking your performance and earnings.
            </p>
            <Link href="/host" className="btn-primary">
              Create Listing
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Total Earnings */}
              <div className="card-premium p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                    Lifetime
                  </span>
                </div>
                <p className="text-sm text-[var(--foreground-muted)] mb-1">Total Earnings</p>
                <p className="font-display text-2xl font-bold text-[var(--foreground)]">
                  ${analytics.totalEarnings.toLocaleString()}
                </p>
                {analytics.pendingEarnings > 0 && (
                  <p className="text-xs text-[var(--foreground-muted)] mt-1">
                    ${analytics.pendingEarnings.toLocaleString()} pending
                  </p>
                )}
              </div>

              {/* Total Bookings */}
              <div className="card-premium p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  {analytics.pendingBookings > 0 && (
                    <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-full">
                      {analytics.pendingBookings} pending
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--foreground-muted)] mb-1">Total Bookings</p>
                <p className="font-display text-2xl font-bold text-[var(--foreground)]">
                  {analytics.totalBookings}
                </p>
                <p className="text-xs text-[var(--foreground-muted)] mt-1">
                  {analytics.completedBookings} completed
                </p>
              </div>

              {/* Average Rating */}
              <div className="card-premium p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-[var(--foreground-muted)] mb-1">Average Rating</p>
                <p className="font-display text-2xl font-bold text-[var(--foreground)]">
                  {analytics.averageRating > 0 ? analytics.averageRating.toFixed(1) : '-'}
                </p>
                <p className="text-xs text-[var(--foreground-muted)] mt-1">
                  {analytics.totalReviews} reviews
                </p>
              </div>

              {/* Active Listings */}
              <div className="card-premium p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-[var(--foreground-muted)] mb-1">Active Listings</p>
                <p className="font-display text-2xl font-bold text-[var(--foreground)]">
                  {analytics.activeListings}
                </p>
                <p className="text-xs text-[var(--foreground-muted)] mt-1">
                  of {analytics.totalListings} total
                </p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Monthly Earnings Chart */}
              <div className="lg:col-span-2 card-premium p-6">
                <h3 className="font-display font-bold text-lg mb-6">Monthly Earnings</h3>
                <div className="flex items-end gap-2 h-48">
                  {analytics.monthlyEarnings.map((month, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex flex-col items-center">
                        {month.earnings > 0 && (
                          <span className="text-xs text-[var(--foreground-muted)] mb-1">
                            ${month.earnings}
                          </span>
                        )}
                        <div
                          className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-md transition-all duration-300 hover:from-primary-600 hover:to-primary-500"
                          style={{
                            height: `${Math.max((month.earnings / maxEarnings) * 150, month.earnings > 0 ? 8 : 2)}px`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-[var(--foreground-muted)]">
                        {month.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Status Breakdown */}
              <div className="card-premium p-6">
                <h3 className="font-display font-bold text-lg mb-6">Booking Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-sm">Completed</span>
                    </div>
                    <span className="font-medium">{analytics.completedBookings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-sm">Confirmed</span>
                    </div>
                    <span className="font-medium">{analytics.confirmedBookings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="text-sm">Pending</span>
                    </div>
                    <span className="font-medium">{analytics.pendingBookings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-sm">Cancelled</span>
                    </div>
                    <span className="font-medium">{analytics.cancelledBookings}</span>
                  </div>
                </div>

                {/* Visual bar */}
                {analytics.totalBookings > 0 && (
                  <div className="mt-6">
                    <div className="h-4 rounded-full overflow-hidden flex bg-[var(--muted)]">
                      <div
                        className="bg-green-500 transition-all"
                        style={{
                          width: `${(analytics.completedBookings / analytics.totalBookings) * 100}%`,
                        }}
                      />
                      <div
                        className="bg-blue-500 transition-all"
                        style={{
                          width: `${(analytics.confirmedBookings / analytics.totalBookings) * 100}%`,
                        }}
                      />
                      <div
                        className="bg-yellow-500 transition-all"
                        style={{
                          width: `${(analytics.pendingBookings / analytics.totalBookings) * 100}%`,
                        }}
                      />
                      <div
                        className="bg-red-500 transition-all"
                        style={{
                          width: `${(analytics.cancelledBookings / analytics.totalBookings) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Listing Performance */}
            <div className="card-premium p-6 mb-8">
              <h3 className="font-display font-bold text-lg mb-6">Listing Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="text-left py-3 px-4 font-medium text-[var(--foreground-muted)]">Listing</th>
                      <th className="text-center py-3 px-4 font-medium text-[var(--foreground-muted)]">Status</th>
                      <th className="text-center py-3 px-4 font-medium text-[var(--foreground-muted)]">Bookings</th>
                      <th className="text-center py-3 px-4 font-medium text-[var(--foreground-muted)]">Rating</th>
                      <th className="text-right py-3 px-4 font-medium text-[var(--foreground-muted)]">Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.listingPerformance.map((listing) => (
                      <tr key={listing.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)] transition-colors">
                        <td className="py-4 px-4">
                          <Link href={`/jetty/${listing.id}`} className="font-medium hover:text-primary-600 transition-colors">
                            {listing.title}
                          </Link>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            listing.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            listing.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {listing.status.charAt(0) + listing.status.slice(1).toLowerCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">{listing.totalBookings}</td>
                        <td className="py-4 px-4 text-center">
                          {listing.averageRating > 0 ? (
                            <div className="flex items-center justify-center gap-1">
                              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span>{listing.averageRating.toFixed(1)}</span>
                              <span className="text-[var(--foreground-muted)]">({listing.reviewCount})</span>
                            </div>
                          ) : (
                            <span className="text-[var(--foreground-muted)]">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right font-medium">
                          ${listing.earnings.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="card-premium p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-lg">Recent Bookings</h3>
                <Link href="/bookings" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View all
                </Link>
              </div>

              {analytics.recentBookings.length === 0 ? (
                <p className="text-[var(--foreground-muted)] text-center py-8">
                  No bookings yet
                </p>
              ) : (
                <div className="space-y-4">
                  {analytics.recentBookings.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/bookings/${booking.id}`}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-[var(--muted)] transition-colors"
                    >
                      <div className="w-10 h-10 bg-[var(--muted)] rounded-full flex items-center justify-center overflow-hidden">
                        {booking.guestImage ? (
                          <Image
                            src={booking.guestImage}
                            alt={booking.guestName || 'Guest'}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <svg className="w-5 h-5 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{booking.listingTitle}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          {booking.guestName || 'Guest'} • {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${booking.totalPrice}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
