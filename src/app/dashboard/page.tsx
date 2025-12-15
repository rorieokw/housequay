'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface ListingImage {
  id: string
  url: string
  order: number
}

interface Listing {
  id: string
  title: string
  city: string
  pricePerNight: number
  status: string
  rating: number | null
  reviewCount: number
  images: ListingImage[]
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loadingListings, setLoadingListings] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.isHost) {
      fetchMyListings()
    }
  }, [session])

  const fetchMyListings = async () => {
    setLoadingListings(true)
    try {
      const response = await fetch('/api/listings/my')
      if (response.ok) {
        const data = await response.json()
        setListings(data)
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      setLoadingListings(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const quickLinks = [
    {
      title: 'Browse Jetties',
      description: 'Find the perfect spot for your boat',
      href: '/browse',
      icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
      color: 'bg-blue-500',
    },
    {
      title: 'My Bookings',
      description: 'View and manage your reservations',
      href: '/bookings',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      color: 'bg-green-500',
    },
    {
      title: 'Messages',
      description: 'Chat with hosts and guests',
      href: '/messages',
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      color: 'bg-purple-500',
    },
    {
      title: 'Favorites',
      description: 'Jetties you\'ve saved',
      href: '/favorites',
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      color: 'bg-red-500',
    },
  ]

  return (
    <div className="min-h-screen bg-[var(--muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {session.user?.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-white/80">
            Ready to find your next perfect mooring spot?
          </p>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-[var(--background)] rounded-xl p-6 hover:shadow-lg transition-shadow group"
            >
              <div className={`w-12 h-12 ${link.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">{link.title}</h3>
              <p className="text-sm text-gray-500">{link.description}</p>
            </Link>
          ))}
        </div>

        {/* My Listings (for hosts) */}
        {session.user?.isHost && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My Listings</h2>
              <Link
                href="/host"
                className="text-[var(--primary)] hover:underline text-sm font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Listing
              </Link>
            </div>

            {loadingListings ? (
              <div className="bg-[var(--background)] rounded-xl p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-[var(--background)] rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-[var(--muted)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[var(--foreground)]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">No listings yet</h3>
                <p className="text-[var(--foreground)]/60 mb-4">
                  Create your first listing and start earning.
                </p>
                <Link
                  href="/host"
                  className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-medium hover:bg-[var(--primary-dark)] transition-colors"
                >
                  Create Listing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map((listing) => (
                  <div key={listing.id} className="bg-[var(--background)] rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-video bg-[var(--muted)]">
                      {listing.images[0] ? (
                        <Image
                          src={listing.images[0].url}
                          alt={listing.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-12 h-12 text-[var(--foreground)]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                        listing.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : listing.status === 'PAUSED'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {listing.status.charAt(0) + listing.status.slice(1).toLowerCase()}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold truncate">{listing.title}</h3>
                      <p className="text-sm text-[var(--foreground)]/60">{listing.city}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-medium">${listing.pricePerNight}<span className="text-sm font-normal text-[var(--foreground)]/60">/night</span></p>
                        {listing.rating && (
                          <div className="flex items-center gap-1 text-sm">
                            <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{listing.rating.toFixed(1)}</span>
                            <span className="text-[var(--foreground)]/40">({listing.reviewCount})</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Link
                          href={`/jetty/${listing.id}`}
                          className="flex-1 text-center px-3 py-2 border border-[var(--border)] rounded-lg text-sm font-medium hover:bg-[var(--muted)] transition-colors"
                        >
                          View
                        </Link>
                        <Link
                          href={`/host/edit/${listing.id}`}
                          className="flex-1 text-center px-3 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary-dark)] transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Become a Host CTA */}
        {!session.user?.isHost && (
          <div className="bg-[var(--background)] rounded-2xl p-8 border-2 border-dashed border-[var(--border)]">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold mb-2">Have a jetty to share?</h3>
                <p className="text-gray-500 mb-4">
                  List your jetty on HouseQuay and start earning money from boat owners looking for a safe spot to dock.
                </p>
                <Link
                  href="/host"
                  className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
                >
                  Become a Host
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Account Info */}
        <div className="mt-8 bg-[var(--background)] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{session.user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Type</p>
              <p className="font-medium">{session.user?.isHost ? 'Host' : 'Boater'}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <Link
              href="/settings"
              className="text-[var(--primary)] hover:underline text-sm font-medium"
            >
              Edit profile settings →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
