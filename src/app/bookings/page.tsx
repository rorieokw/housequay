'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Booking {
  id: string
  checkIn: string
  checkOut: string
  nights: number
  total: number
  status: string
  boatName: string | null
  createdAt: string
  listing: {
    id: string
    title: string
    city: string
    host?: {
      id: string
      name: string
      image: string | null
    }
    images: Array<{ url: string }>
  }
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  DECLINED: 'bg-gray-100 text-gray-800',
}

const statusLabels: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
  DECLINED: 'Declined',
}

export default function BookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/bookings')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchBookings()
    }
  }, [session])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings')
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const today = new Date()
  const upcomingBookings = bookings.filter(
    (b) => new Date(b.checkIn) >= today && ['PENDING', 'CONFIRMED'].includes(b.status)
  )
  const pastBookings = bookings.filter(
    (b) => new Date(b.checkOut) < today || ['CANCELLED', 'COMPLETED', 'DECLINED'].includes(b.status)
  )

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings

  return (
    <div className="min-h-screen bg-[var(--muted)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-[var(--border)]">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
                : 'text-[var(--foreground)]/60 hover:text-[var(--foreground)]'
            }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'past'
                ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
                : 'text-[var(--foreground)]/60 hover:text-[var(--foreground)]'
            }`}
          >
            Past ({pastBookings.length})
          </button>
        </div>

        {displayedBookings.length === 0 ? (
          <div className="bg-[var(--background)] rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-[var(--muted)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--foreground)]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">
              {activeTab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
            </h3>
            <p className="text-[var(--foreground)]/60 mb-6">
              {activeTab === 'upcoming'
                ? "When you book a jetty, it'll show up here."
                : "Your completed and cancelled bookings will appear here."}
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-medium hover:bg-[var(--primary-dark)] transition-colors"
            >
              Browse Jetties
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedBookings.map((booking) => (
              <Link
                key={booking.id}
                href={`/bookings/${booking.id}`}
                className="block bg-[var(--background)] rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-48 h-32 md:h-auto">
                    {booking.listing.images[0] ? (
                      <Image
                        src={booking.listing.images[0].url}
                        alt={booking.listing.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[var(--muted)] flex items-center justify-center">
                        <svg className="w-12 h-12 text-[var(--foreground)]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{booking.listing.title}</h3>
                        <p className="text-sm text-[var(--foreground)]/60">{booking.listing.city}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                        {statusLabels[booking.status]}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-[var(--foreground)]/60">Check-in</p>
                        <p className="font-medium">
                          {new Date(booking.checkIn).toLocaleDateString('en-AU', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--foreground)]/60">Check-out</p>
                        <p className="font-medium">
                          {new Date(booking.checkOut).toLocaleDateString('en-AU', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--foreground)]/60">Nights</p>
                        <p className="font-medium">{booking.nights}</p>
                      </div>
                      <div>
                        <p className="text-[var(--foreground)]/60">Total</p>
                        <p className="font-medium">${booking.total}</p>
                      </div>
                    </div>
                    {booking.boatName && (
                      <p className="text-sm text-[var(--foreground)]/60 mt-3">
                        Boat: {booking.boatName}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
