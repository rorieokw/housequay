'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Review {
  id: string
  overall: number
  cleanliness: number | null
  accuracy: number | null
  communication: number | null
  location: number | null
  value: number | null
  content: string
  hostReply: string | null
  hostRepliedAt: string | null
  createdAt: string
  author: {
    id: string
    name: string
    image: string | null
  }
}

interface BookingDetail {
  id: string
  checkIn: string
  checkOut: string
  nights: number
  pricePerNight: number
  subtotal: number
  cleaningFee: number | null
  serviceFee: number
  total: number
  status: string
  paymentStatus: string
  boatName: string | null
  boatLength: number | null
  boatType: string | null
  specialRequests: string | null
  createdAt: string
  guest: {
    id: string
    name: string
    email: string
    image: string | null
    phone: string | null
  }
  listing: {
    id: string
    title: string
    city: string
    address: string
    instantBook: boolean
    host: {
      id: string
      name: string
      email: string
      image: string | null
      phone: string | null
    }
    images: Array<{ url: string }>
  }
  review: Review | null
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  CONFIRMED: 'bg-green-100 text-green-800 border-green-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200',
  COMPLETED: 'bg-blue-100 text-blue-800 border-blue-200',
  DECLINED: 'bg-gray-100 text-gray-800 border-gray-200',
}

const statusLabels: Record<string, string> = {
  PENDING: 'Pending Approval',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
  DECLINED: 'Declined',
}

const paymentStatusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
  COMPLETED: 'bg-green-100 text-green-800 border-green-200',
  FAILED: 'bg-red-100 text-red-800 border-red-200',
}

const paymentStatusLabels: Record<string, string> = {
  PENDING: 'Payment Pending',
  PROCESSING: 'Processing Payment',
  COMPLETED: 'Paid',
  FAILED: 'Payment Failed',
}

function BookingDetailContent({ id }: { id: string }) {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancellationReason, setCancellationReason] = useState('')

  // Review state
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewContent, setReviewContent] = useState('')
  const [hostReplyText, setHostReplyText] = useState('')
  const [replyLoading, setReplyLoading] = useState(false)

  const isSuccess = searchParams.get('success') === 'true'
  const paymentSuccess = searchParams.get('payment') === 'success'
  const paymentCancelled = searchParams.get('payment') === 'cancelled'

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push(`/login?callbackUrl=/bookings/${id}`)
    }
  }, [authStatus, router, id])

  useEffect(() => {
    if (session) {
      fetchBooking()
    }
  }, [session, id])

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${id}`)
      if (response.ok) {
        const data = await response.json()
        setBooking(data)
      } else if (response.status === 404) {
        router.push('/bookings')
      }
    } catch (error) {
      console.error('Failed to fetch booking:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: 'approve' | 'decline' | 'cancel') => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          cancellationReason: action === 'cancel' ? cancellationReason : undefined,
        }),
      })

      if (response.ok) {
        fetchBooking()
        setShowCancelModal(false)
        setCancellationReason('')
      }
    } catch (error) {
      console.error('Failed to update booking:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handlePayment = async () => {
    setPaymentLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id }),
      })

      const data = await response.json()

      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        console.error('Failed to create checkout session:', data.error)
      }
    } catch (error) {
      console.error('Failed to initiate payment:', error)
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!reviewContent.trim()) return

    setReviewLoading(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: id,
          overall: reviewRating,
          content: reviewContent,
        }),
      })

      if (response.ok) {
        fetchBooking() // Refresh to show the review
        setShowReviewForm(false)
        setReviewContent('')
        setReviewRating(5)
      }
    } catch (error) {
      console.error('Failed to submit review:', error)
    } finally {
      setReviewLoading(false)
    }
  }

  const handleHostReply = async () => {
    if (!hostReplyText.trim() || !booking?.review) return

    setReplyLoading(true)
    try {
      const response = await fetch(`/api/reviews/${booking.review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostReply: hostReplyText }),
      })

      if (response.ok) {
        fetchBooking() // Refresh to show the reply
        setHostReplyText('')
      }
    } catch (error) {
      console.error('Failed to submit reply:', error)
    } finally {
      setReplyLoading(false)
    }
  }

  if (authStatus === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    )
  }

  if (!session || !booking) {
    return null
  }

  const isHost = booking.listing.host.id === session.user?.id
  const isGuest = booking.guest.id === session.user?.id
  const canApproveDecline = isHost && booking.status === 'PENDING'
  const canCancel = (isHost || isGuest) && ['PENDING', 'CONFIRMED'].includes(booking.status)
  const canPay = isGuest && booking.status === 'CONFIRMED' && booking.paymentStatus !== 'COMPLETED'

  return (
    <div className="min-h-screen bg-[var(--muted)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Banner */}
        {isSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">
                {booking.listing.instantBook
                  ? 'Your reservation is confirmed!'
                  : 'Your booking request has been sent!'}
              </p>
              <p className="text-sm">
                {booking.listing.instantBook
                  ? 'The host has been notified of your upcoming stay.'
                  : 'The host will review your request and respond within 24 hours.'}
              </p>
            </div>
          </div>
        )}

        {/* Payment Success Banner */}
        {paymentSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">Payment successful!</p>
              <p className="text-sm">Your payment has been processed. You&apos;re all set for your stay.</p>
            </div>
          </div>
        )}

        {/* Payment Cancelled Banner */}
        {paymentCancelled && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4 mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-medium">Payment cancelled</p>
              <p className="text-sm">Your payment was not completed. You can try again when you&apos;re ready.</p>
            </div>
          </div>
        )}

        {/* Back Link */}
        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 text-[var(--foreground)]/60 hover:text-[var(--foreground)] mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to bookings
        </Link>

        <div className="bg-[var(--background)] rounded-xl overflow-hidden">
          {/* Header with Image */}
          <div className="relative h-48 md:h-64">
            {booking.listing.images[0] ? (
              <Image
                src={booking.listing.images[0].url}
                alt={booking.listing.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[var(--muted)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-2xl font-bold mb-1">{booking.listing.title}</h1>
              <p className="text-white/80">{booking.listing.city}</p>
            </div>
          </div>

          <div className="p-6">
            {/* Status Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${statusColors[booking.status]}`}>
                {booking.status === 'PENDING' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {booking.status === 'CONFIRMED' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="font-medium">{statusLabels[booking.status]}</span>
              </div>

              {/* Payment Status Badge */}
              {booking.status === 'CONFIRMED' && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${paymentStatusColors[booking.paymentStatus] || paymentStatusColors.PENDING}`}>
                  {booking.paymentStatus === 'COMPLETED' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  )}
                  <span className="font-medium">{paymentStatusLabels[booking.paymentStatus] || 'Payment Pending'}</span>
                </div>
              )}
            </div>

            {/* Trip Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h2 className="font-semibold text-lg">Trip details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60">Check-in</p>
                    <p className="font-medium">
                      {new Date(booking.checkIn).toLocaleDateString('en-AU', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground)]/60">Check-out</p>
                    <p className="font-medium">
                      {new Date(booking.checkOut).toLocaleDateString('en-AU', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[var(--foreground)]/60">Duration</p>
                  <p className="font-medium">{booking.nights} night{booking.nights > 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Boat Info */}
              {(booking.boatName || booking.boatType || booking.boatLength) && (
                <div className="space-y-4">
                  <h2 className="font-semibold text-lg">Boat information</h2>
                  {booking.boatName && (
                    <div>
                      <p className="text-sm text-[var(--foreground)]/60">Boat name</p>
                      <p className="font-medium">{booking.boatName}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {booking.boatType && (
                      <div>
                        <p className="text-sm text-[var(--foreground)]/60">Type</p>
                        <p className="font-medium capitalize">{booking.boatType}</p>
                      </div>
                    )}
                    {booking.boatLength && (
                      <div>
                        <p className="text-sm text-[var(--foreground)]/60">Length</p>
                        <p className="font-medium">{booking.boatLength} ft</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="mb-8">
                <h2 className="font-semibold text-lg mb-2">Special requests</h2>
                <p className="text-[var(--foreground)]/80 bg-[var(--muted)] rounded-lg p-4">
                  {booking.specialRequests}
                </p>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="border-t border-[var(--border)] pt-6 mb-8">
              <h2 className="font-semibold text-lg mb-4">Price breakdown</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>${booking.pricePerNight} x {booking.nights} nights</span>
                  <span>${booking.subtotal}</span>
                </div>
                {booking.cleaningFee && booking.cleaningFee > 0 && (
                  <div className="flex justify-between">
                    <span>Cleaning fee</span>
                    <span>${booking.cleaningFee}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>${booking.serviceFee}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-[var(--border)]">
                  <span>Total</span>
                  <span>${booking.total}</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="border-t border-[var(--border)] pt-6 mb-8">
              <h2 className="font-semibold text-lg mb-4">
                {isHost ? 'Guest information' : 'Host information'}
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[var(--primary)] flex items-center justify-center overflow-hidden">
                  {(isHost ? booking.guest.image : booking.listing.host.image) ? (
                    <Image
                      src={(isHost ? booking.guest.image : booking.listing.host.image)!}
                      alt={isHost ? booking.guest.name : booking.listing.host.name}
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-white text-xl font-medium">
                      {(isHost ? booking.guest.name : booking.listing.host.name)?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{isHost ? booking.guest.name : booking.listing.host.name}</p>
                  <p className="text-sm text-[var(--foreground)]/60">
                    {isHost ? booking.guest.email : booking.listing.host.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Review Section */}
            {booking.status === 'COMPLETED' && (
              <div className="border-t border-[var(--border)] pt-6 mb-8">
                <h2 className="font-semibold text-lg mb-4">Review</h2>

                {/* Existing Review */}
                {booking.review ? (
                  <div className="space-y-4">
                    <div className="bg-[var(--muted)] rounded-lg p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center overflow-hidden flex-shrink-0">
                          {booking.review.author.image ? (
                            <Image
                              src={booking.review.author.image}
                              alt={booking.review.author.name}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-white font-medium">
                              {booking.review.author.name?.[0]?.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{booking.review.author.name}</p>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-4 h-4 ${star <= booking.review!.overall ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-[var(--foreground)]/60">
                            {new Date(booking.review.createdAt).toLocaleDateString('en-AU', {
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <p className="text-[var(--foreground)]/80">{booking.review.content}</p>
                    </div>

                    {/* Host Reply */}
                    {booking.review.hostReply && (
                      <div className="ml-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <p className="text-sm font-medium text-[var(--primary)] mb-1">
                          Response from {booking.listing.host.name}
                        </p>
                        <p className="text-[var(--foreground)]/80">{booking.review.hostReply}</p>
                      </div>
                    )}

                    {/* Host Reply Form */}
                    {isHost && !booking.review.hostReply && (
                      <div className="ml-8">
                        <textarea
                          value={hostReplyText}
                          onChange={(e) => setHostReplyText(e.target.value)}
                          placeholder="Write a response to this review..."
                          rows={3}
                          className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                        />
                        <button
                          onClick={handleHostReply}
                          disabled={replyLoading || !hostReplyText.trim()}
                          className="mt-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          {replyLoading ? 'Sending...' : 'Send Response'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : isGuest ? (
                  /* Review Form for Guests */
                  showReviewForm ? (
                    <div className="space-y-4">
                      {/* Star Rating */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Your rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="focus:outline-none"
                            >
                              <svg
                                className={`w-8 h-8 ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Review Content */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Your review</label>
                        <textarea
                          value={reviewContent}
                          onChange={(e) => setReviewContent(e.target.value)}
                          placeholder="Share your experience with this jetty..."
                          rows={4}
                          className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleSubmitReview}
                          disabled={reviewLoading || !reviewContent.trim()}
                          className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          {reviewLoading ? 'Submitting...' : 'Submit Review'}
                        </button>
                        <button
                          onClick={() => setShowReviewForm(false)}
                          className="px-6 py-2 border border-[var(--border)] rounded-lg font-medium hover:bg-[var(--muted)] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Leave a Review
                    </button>
                  )
                ) : (
                  <p className="text-[var(--foreground)]/60">No review yet</p>
                )}
              </div>
            )}

            {/* Actions */}
            {(canApproveDecline || canCancel || canPay) && (
              <div className="border-t border-[var(--border)] pt-6">
                <div className="flex flex-wrap gap-3">
                  {/* Pay Now Button for Guests */}
                  {canPay && (
                    <button
                      onClick={handlePayment}
                      disabled={paymentLoading}
                      className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                    >
                      {paymentLoading ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          Pay Now - ${booking.total}
                        </>
                      )}
                    </button>
                  )}

                  {canApproveDecline && (
                    <>
                      <button
                        onClick={() => handleAction('approve')}
                        disabled={actionLoading}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        Approve Request
                      </button>
                      <button
                        onClick={() => handleAction('decline')}
                        disabled={actionLoading}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        Decline Request
                      </button>
                    </>
                  )}
                  {canCancel && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      disabled={actionLoading}
                      className="px-6 py-2 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[var(--background)] rounded-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-semibold mb-4">Cancel Booking</h2>
            <p className="text-[var(--foreground)]/60 mb-4">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Reason for cancellation (optional)</label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Let the other party know why you're cancelling..."
                rows={3}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg font-medium hover:bg-[var(--muted)] transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleAction('cancel')}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    }>
      <BookingDetailContent id={params.id} />
    </Suspense>
  )
}
