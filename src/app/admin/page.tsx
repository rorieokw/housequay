'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface AdminStats {
  counts: {
    totalUsers: number
    totalHosts: number
    suspendedUsers: number
    totalListings: number
    activeListings: number
    pendingListings: number
    totalBookings: number
    pendingReports: number
    totalRevenue: number
  }
  thisMonth: {
    newUsers: number
    newBookings: number
  }
  recentActivity: {
    users: Array<{
      id: string
      name: string | null
      email: string
      createdAt: string
      isHost: boolean
    }>
    bookings: Array<{
      id: string
      status: string
      total: number
      createdAt: string
      guest: { name: string | null }
      listing: { title: string }
    }>
    reports: Array<{
      id: string
      reason: string
      createdAt: string
      reporter: { name: string | null }
      listing: { title: string } | null
      reportedUser: { name: string | null } | null
    }>
  }
}

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  role: string
  isHost: boolean
  isSuperhost: boolean
  isVerified: boolean
  isSuspended: boolean
  suspendedAt: string | null
  suspendedReason: string | null
  createdAt: string
  _count: {
    listings: number
    bookings: number
    reviewsGiven: number
  }
}

interface Listing {
  id: string
  title: string
  city: string
  state: string | null
  pricePerNight: number
  status: string
  rating: number | null
  reviewCount: number
  createdAt: string
  host: {
    id: string
    name: string | null
    email: string
    isSuspended: boolean
  }
  images: Array<{ url: string }>
  _count: {
    bookings: number
    reports: number
  }
}

interface Report {
  id: string
  reason: string
  description: string
  status: string
  createdAt: string
  resolvedAt: string | null
  adminNotes: string | null
  reporter: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  listing: {
    id: string
    title: string
    city: string
  } | null
  reportedUser: {
    id: string
    name: string | null
    email: string
  } | null
  booking: {
    id: string
    status: string
    checkIn: string
    checkOut: string
  } | null
  admin: {
    id: string
    name: string | null
  } | null
}

type Tab = 'overview' | 'users' | 'listings' | 'reports'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Filters
  const [userFilter, setUserFilter] = useState('all')
  const [listingStatus, setListingStatus] = useState('all')
  const [reportStatus, setReportStatus] = useState('PENDING')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchStats()
    }
  }, [session])

  useEffect(() => {
    if (activeTab === 'users' && session?.user?.role === 'ADMIN') {
      fetchUsers()
    } else if (activeTab === 'listings' && session?.user?.role === 'ADMIN') {
      fetchListings()
    } else if (activeTab === 'reports' && session?.user?.role === 'ADMIN') {
      fetchReports()
    }
  }, [activeTab, userFilter, listingStatus, reportStatus, session])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({ filter: userFilter })
      if (searchQuery) params.set('search', searchQuery)
      const response = await fetch(`/api/admin/users?${params}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchListings = async () => {
    try {
      const params = new URLSearchParams({ status: listingStatus })
      if (searchQuery) params.set('search', searchQuery)
      const response = await fetch(`/api/admin/listings?${params}`)
      if (response.ok) {
        const data = await response.json()
        setListings(data.listings)
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
    }
  }

  const fetchReports = async () => {
    try {
      const response = await fetch(`/api/admin/reports?status=${reportStatus}`)
      if (response.ok) {
        const data = await response.json()
        setReports(data.reports)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    }
  }

  const handleUserAction = async (userId: string, action: string, reason?: string) => {
    setActionLoading(userId)
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason }),
      })
      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Error updating user:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleListingAction = async (listingId: string, action: string) => {
    setActionLoading(listingId)
    try {
      const response = await fetch(`/api/admin/listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (response.ok) {
        fetchListings()
      }
    } catch (error) {
      console.error('Error updating listing:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReportAction = async (reportId: string, status: string, adminNotes?: string) => {
    setActionLoading(reportId)
    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes }),
      })
      if (response.ok) {
        fetchReports()
      }
    } catch (error) {
      console.error('Error updating report:', error)
    } finally {
      setActionLoading(null)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { id: 'listings', label: 'Listings', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'reports', label: 'Reports', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  ]

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">
            Admin Dashboard
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Manage users, listings, and reports
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-[var(--border)] overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
              {tab.id === 'reports' && stats?.counts.pendingReports ? (
                <span className="ml-1 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {stats.counts.pendingReports}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-premium p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground-muted)]">Total Users</p>
                    <p className="text-2xl font-bold">{stats.counts.totalUsers}</p>
                    <p className="text-xs text-green-600">+{stats.thisMonth.newUsers} this month</p>
                  </div>
                </div>
              </div>

              <div className="card-premium p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground-muted)]">Active Listings</p>
                    <p className="text-2xl font-bold">{stats.counts.activeListings}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{stats.counts.pendingListings} pending review</p>
                  </div>
                </div>
              </div>

              <div className="card-premium p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground-muted)]">Total Revenue</p>
                    <p className="text-2xl font-bold">${stats.counts.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{stats.counts.totalBookings} bookings</p>
                  </div>
                </div>
              </div>

              <div className="card-premium p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground-muted)]">Pending Reports</p>
                    <p className="text-2xl font-bold">{stats.counts.pendingReports}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{stats.counts.suspendedUsers} suspended users</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <div className="card-premium p-6">
                <h3 className="font-bold text-lg mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {stats.recentActivity.users.map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--muted)]">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">
                          {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.name || 'No name'}</p>
                        <p className="text-xs text-[var(--foreground-muted)] truncate">{user.email}</p>
                      </div>
                      {user.isHost && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Host</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="card-premium p-6">
                <h3 className="font-bold text-lg mb-4">Recent Bookings</h3>
                <div className="space-y-3">
                  {stats.recentActivity.bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--muted)]">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{booking.listing.title}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">
                          by {booking.guest.name || 'Guest'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${booking.total}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                          booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
              >
                <option value="all">All Users</option>
                <option value="hosts">Hosts Only</option>
                <option value="suspended">Suspended</option>
                <option value="admin">Admins</option>
              </select>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] flex-1 max-w-xs"
              />
            </div>

            {/* Users Table */}
            <div className="card-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--muted)]">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium">User</th>
                      <th className="text-left py-3 px-4 font-medium">Role</th>
                      <th className="text-center py-3 px-4 font-medium">Listings</th>
                      <th className="text-center py-3 px-4 font-medium">Bookings</th>
                      <th className="text-center py-3 px-4 font-medium">Status</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-t border-[var(--border)] hover:bg-[var(--muted)]">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                              {user.image ? (
                                <Image src={user.image} alt="" width={40} height={40} className="object-cover" />
                              ) : (
                                <span className="text-primary-600 font-medium">
                                  {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{user.name || 'No name'}</p>
                              <p className="text-xs text-[var(--foreground-muted)]">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                            user.isHost ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {user.role === 'ADMIN' ? 'Admin' : user.isHost ? 'Host' : 'Boater'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">{user._count.listings}</td>
                        <td className="py-3 px-4 text-center">{user._count.bookings}</td>
                        <td className="py-3 px-4 text-center">
                          {user.isSuspended ? (
                            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">Suspended</span>
                          ) : user.isVerified ? (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Verified</span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">Active</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {user.isSuspended ? (
                              <button
                                onClick={() => handleUserAction(user.id, 'unsuspend')}
                                disabled={actionLoading === user.id}
                                className="text-xs px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                              >
                                Unsuspend
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUserAction(user.id, 'suspend', 'Suspended by admin')}
                                disabled={actionLoading === user.id}
                                className="text-xs px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                              >
                                Suspend
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <select
                value={listingStatus}
                onChange={(e) => setListingStatus(e.target.value)}
                className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
              >
                <option value="all">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="PAUSED">Paused</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <input
                type="text"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchListings()}
                className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] flex-1 max-w-xs"
              />
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <div key={listing.id} className="card-premium overflow-hidden">
                  <div className="aspect-video bg-[var(--muted)] relative">
                    {listing.images[0] ? (
                      <Image
                        src={listing.images[0].url}
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-12 h-12 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        listing.status === 'ACTIVE' ? 'bg-green-500 text-white' :
                        listing.status === 'PENDING_REVIEW' ? 'bg-yellow-500 text-white' :
                        listing.status === 'REJECTED' ? 'bg-red-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {listing.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold truncate">{listing.title}</h3>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      {listing.city}, {listing.state}
                    </p>
                    <p className="text-sm text-[var(--foreground-muted)] mt-1">
                      Host: {listing.host.name || listing.host.email}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
                      <span className="font-bold">${listing.pricePerNight}/night</span>
                      <div className="flex gap-2">
                        {listing.status === 'PENDING_REVIEW' && (
                          <>
                            <button
                              onClick={() => handleListingAction(listing.id, 'approve')}
                              disabled={actionLoading === listing.id}
                              className="text-xs px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleListingAction(listing.id, 'reject')}
                              disabled={actionLoading === listing.id}
                              className="text-xs px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {listing.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleListingAction(listing.id, 'pause')}
                            disabled={actionLoading === listing.id}
                            className="text-xs px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                          >
                            Pause
                          </button>
                        )}
                        {listing.status === 'PAUSED' && (
                          <button
                            onClick={() => handleListingAction(listing.id, 'activate')}
                            disabled={actionLoading === listing.id}
                            className="text-xs px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                          >
                            Activate
                          </button>
                        )}
                        <Link
                          href={`/jetty/${listing.id}`}
                          className="text-xs px-3 py-1 bg-[var(--muted)] rounded-lg hover:bg-[var(--border)]"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <select
                value={reportStatus}
                onChange={(e) => setReportStatus(e.target.value)}
                className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
              >
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="RESOLVED">Resolved</option>
                <option value="DISMISSED">Dismissed</option>
                <option value="all">All</option>
              </select>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {reports.length === 0 ? (
                <div className="card-premium p-8 text-center">
                  <p className="text-[var(--foreground-muted)]">No reports found</p>
                </div>
              ) : (
                reports.map((report) => (
                  <div key={report.id} className="card-premium p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                            report.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-700' :
                            report.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {report.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                            {report.reason.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{report.description}</p>
                        <div className="text-xs text-[var(--foreground-muted)]">
                          <p>Reported by: {report.reporter.name || report.reporter.email}</p>
                          {report.listing && <p>Listing: {report.listing.title}</p>}
                          {report.reportedUser && <p>User: {report.reportedUser.name || report.reportedUser.email}</p>}
                          <p>Date: {new Date(report.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {report.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleReportAction(report.id, 'UNDER_REVIEW')}
                              disabled={actionLoading === report.id}
                              className="text-xs px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => handleReportAction(report.id, 'DISMISSED')}
                              disabled={actionLoading === report.id}
                              className="text-xs px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                            >
                              Dismiss
                            </button>
                          </>
                        )}
                        {report.status === 'UNDER_REVIEW' && (
                          <button
                            onClick={() => handleReportAction(report.id, 'RESOLVED', 'Issue addressed')}
                            disabled={actionLoading === report.id}
                            className="text-xs px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
