'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getJettyById, Jetty } from '@/data/jetties';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';

interface JettyPageProps {
  params: { id: string };
}

// Map database boat size category to Jetty format
const boatSizeCategoryMap: Record<string, 'small' | 'medium' | 'large' | 'xlarge' | 'yacht'> = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  XLARGE: 'xlarge',
  SUPERYACHT: 'yacht',
};

// Convert database listing to Jetty format
function dbListingToJetty(listing: Record<string, unknown>): Jetty {
  const host = listing.host as Record<string, unknown> || {};
  const images = (listing.images as Array<{ url: string }>) || [];
  const dbCategory = listing.maxBoatLengthCategory as string;

  return {
    id: listing.id as string,
    title: listing.title as string,
    description: listing.description as string,
    location: listing.address as string,
    city: listing.city as string,
    coordinates: {
      lat: listing.latitude as number,
      lng: listing.longitude as number,
    },
    pricePerNight: listing.pricePerNight as number,
    maxBoatLength: listing.maxBoatLength as number,
    maxBoatLengthCategory: boatSizeCategoryMap[dbCategory] || 'medium',
    images: images.length > 0
      ? images.map(img => img.url)
      : ['https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=800'],
    amenities: (listing.amenities as string[]) || [],
    rating: (listing.rating as number) || 0,
    reviewCount: (listing.reviewCount as number) || 0,
    host: {
      id: host.id as string || '',
      name: host.name as string || 'Host',
      avatar: host.image as string || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      superhost: host.isSuperhost as boolean || false,
      responseRate: host.responseRate as number || 100,
      responseTime: host.responseTime as string || 'within a day',
    },
    availability: {
      instantBook: listing.instantBook as boolean || false,
      minimumStay: listing.minimumStay as number || 1,
    },
    features: {
      depth: listing.depth as number || 0,
      width: listing.width as number || 0,
      power: listing.hasPower as boolean || false,
      water: listing.hasWater as boolean || false,
      wifi: listing.hasWifi as boolean || false,
      security: listing.hasSecurity as boolean || false,
      lighting: listing.hasLighting as boolean || false,
      fuel: listing.hasFuel as boolean || false,
    },
  };
}

export default function JettyPage({ params }: JettyPageProps) {
  const { id } = params;
  const { data: session } = useSession();
  const router = useRouter();
  const [jetty, setJetty] = useState<Jetty | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  // Booking state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [boatName, setBoatName] = useState('');
  const [boatLength, setBoatLength] = useState('');
  const [boatType, setBoatType] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    async function loadJetty() {
      // First try to get from database
      try {
        const response = await fetch(`/api/listings/${id}`);
        if (response.ok) {
          const data = await response.json();
          setJetty(dbListingToJetty(data));
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log('Database fetch failed, trying static data');
      }

      // Fall back to static data
      const staticJetty = getJettyById(id);
      if (staticJetty) {
        setJetty(staticJetty);
      }
      setLoading(false);
    }

    loadJetty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (!jetty) {
    notFound();
  }

  const nights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const subtotal = nights * jetty.pricePerNight;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + serviceFee;

  // Get today's date for min date attribute
  const today = new Date().toISOString().split('T')[0];

  const handleBookingClick = () => {
    if (!session) {
      router.push(`/login?callbackUrl=/jetty/${id}`);
      return;
    }

    if (!checkIn || !checkOut) {
      setBookingError('Please select check-in and check-out dates');
      return;
    }

    if (nights < jetty.availability.minimumStay) {
      setBookingError(`Minimum stay is ${jetty.availability.minimumStay} nights`);
      return;
    }

    setBookingError('');
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async () => {
    setBookingLoading(true);
    setBookingError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: id,
          checkIn,
          checkOut,
          boatName,
          boatLength,
          boatType,
          specialRequests,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setBookingError(data.error || 'Failed to create booking');
        return;
      }

      // Success - redirect to bookings page
      router.push(`/bookings/${data.id}?success=true`);
    } catch (error) {
      setBookingError('Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{jetty.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">{jetty.rating || 'New'}</span>
              {jetty.reviewCount > 0 && (
                <span className="text-[var(--foreground)]/60">({jetty.reviewCount} reviews)</span>
              )}
            </div>
            {jetty.host.superhost && (
              <span className="px-2 py-1 bg-[var(--muted)] rounded-full text-xs font-medium">
                Superhost
              </span>
            )}
            <span className="text-[var(--foreground)]/60">{jetty.location}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="relative mb-8">
          {showAllPhotos ? (
            <div className="fixed inset-0 z-50 bg-black overflow-y-auto">
              <div className="sticky top-0 z-10 bg-black/90 p-4">
                <button
                  onClick={() => setShowAllPhotos(false)}
                  className="text-white flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Close
                </button>
              </div>
              <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
                {jetty.images.map((image, index) => (
                  <div key={index} className="relative aspect-video">
                    <Image
                      src={image}
                      alt={`${jetty.title} - Photo ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 rounded-xl overflow-hidden h-[300px] md:h-[400px]">
              <div className="md:col-span-2 md:row-span-2 relative">
                <Image
                  src={jetty.images[0]}
                  alt={jetty.title}
                  fill
                  className="object-cover"
                />
              </div>
              {jetty.images.slice(1, 5).map((image, index) => (
                <div key={index} className="relative hidden md:block">
                  <Image
                    src={image}
                    alt={`${jetty.title} - Photo ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              <button
                onClick={() => setShowAllPhotos(true)}
                className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Show all photos
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Info */}
            <div className="flex justify-between items-start pb-8 border-b border-[var(--border)]">
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  Hosted by {jetty.host.name}
                </h2>
                <p className="text-[var(--foreground)]/60">
                  Max {jetty.maxBoatLength}ft boat &middot; {jetty.features.depth}m depth &middot; {jetty.features.width}m width
                </p>
              </div>
              <div className="relative w-14 h-14 rounded-full overflow-hidden">
                <Image
                  src={jetty.host.avatar}
                  alt={jetty.host.name}
                  fill
                  className="object-cover"
                />
                {jetty.host.superhost && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--primary)] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="pb-8 border-b border-[var(--border)]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {jetty.features.power && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--muted)] rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-sm">Shore Power</span>
                  </div>
                )}
                {jetty.features.water && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--muted)] rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <span className="text-sm">Fresh Water</span>
                  </div>
                )}
                {jetty.features.wifi && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--muted)] rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                    </div>
                    <span className="text-sm">WiFi</span>
                  </div>
                )}
                {jetty.features.security && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--muted)] rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-sm">24/7 Security</span>
                  </div>
                )}
                {jetty.features.fuel && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--muted)] rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                    </div>
                    <span className="text-sm">Fuel Station</span>
                  </div>
                )}
                {jetty.features.lighting && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--muted)] rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <span className="text-sm">Lighting</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="pb-8 border-b border-[var(--border)]">
              <h2 className="text-xl font-semibold mb-4">About this jetty</h2>
              <p className="text-[var(--foreground)]/80 leading-relaxed">
                {jetty.description}
              </p>
            </div>

            {/* Amenities */}
            {jetty.amenities.length > 0 && (
              <div className="pb-8 border-b border-[var(--border)]">
                <h2 className="text-xl font-semibold mb-4">What this jetty offers</h2>
                <div className="grid grid-cols-2 gap-4">
                  {jetty.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-[var(--foreground)]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="capitalize">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-[var(--foreground)]/60">Max Boat Length</p>
                  <p className="font-semibold">{jetty.maxBoatLength} ft</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--foreground)]/60">Water Depth</p>
                  <p className="font-semibold">{jetty.features.depth} m</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--foreground)]/60">Berth Width</p>
                  <p className="font-semibold">{jetty.features.width} m</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--foreground)]/60">Minimum Stay</p>
                  <p className="font-semibold">{jetty.availability.minimumStay} night{jetty.availability.minimumStay > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--foreground)]/60">Response Rate</p>
                  <p className="font-semibold">{jetty.host.responseRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--foreground)]/60">Response Time</p>
                  <p className="font-semibold capitalize">{jetty.host.responseTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-[var(--muted)] border border-[var(--border)] rounded-xl p-6 shadow-lg">
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <span className="text-2xl font-bold">${jetty.pricePerNight}</span>
                  <span className="text-[var(--foreground)]/60"> / night</span>
                </div>
                {jetty.rating > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <svg className="w-4 h-4 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{jetty.rating}</span>
                  </div>
                )}
              </div>

              <div className="border border-[var(--border)] rounded-lg overflow-hidden mb-4">
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full"
                >
                  <div className="grid grid-cols-2">
                    <div className="p-3 border-r border-b border-[var(--border)] text-left">
                      <label className="block text-xs font-semibold mb-1">CHECK-IN</label>
                      <p className={`text-sm ${checkIn ? '' : 'text-[var(--foreground)]/40'}`}>
                        {checkIn ? new Date(checkIn).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' }) : 'Add date'}
                      </p>
                    </div>
                    <div className="p-3 border-b border-[var(--border)] text-left">
                      <label className="block text-xs font-semibold mb-1">CHECK-OUT</label>
                      <p className={`text-sm ${checkOut ? '' : 'text-[var(--foreground)]/40'}`}>
                        {checkOut ? new Date(checkOut).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' }) : 'Add date'}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Calendar dropdown */}
                {showCalendar && (
                  <div className="border-t border-[var(--border)]">
                    <AvailabilityCalendar
                      listingId={id}
                      checkIn={checkIn}
                      checkOut={checkOut}
                      onCheckInChange={(date) => {
                        setCheckIn(date);
                        setBookingError('');
                      }}
                      onCheckOutChange={(date) => {
                        setCheckOut(date);
                        setBookingError('');
                        if (date) setShowCalendar(false);
                      }}
                      minimumStay={jetty.availability.minimumStay}
                    />
                  </div>
                )}
              </div>

              {bookingError && (
                <p className="text-red-500 text-sm mb-3">{bookingError}</p>
              )}

              <button
                onClick={handleBookingClick}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  jetty.availability.instantBook
                    ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]'
                    : 'bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90'
                }`}
              >
                {!session ? 'Sign in to Book' : jetty.availability.instantBook ? 'Reserve' : 'Request to Book'}
              </button>

              {!jetty.availability.instantBook && session && (
                <p className="text-center text-sm text-[var(--foreground)]/60 mt-2">
                  You won&apos;t be charged yet
                </p>
              )}

              {nights > 0 && (
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="underline">${jetty.pricePerNight} x {nights} nights</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="underline">Service fee</span>
                    <span>${serviceFee}</span>
                  </div>
                  <hr className="border-[var(--border)]" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[var(--background)] rounded-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[var(--border)]">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {jetty.availability.instantBook ? 'Confirm Reservation' : 'Request to Book'}
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Trip Summary */}
              <div className="bg-[var(--muted)] rounded-lg p-4">
                <h3 className="font-medium mb-3">Your trip</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[var(--foreground)]/60">Check-in</p>
                    <p className="font-medium">{new Date(checkIn).toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-[var(--foreground)]/60">Check-out</p>
                    <p className="font-medium">{new Date(checkOut).toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              {/* Boat Details */}
              <div>
                <h3 className="font-medium mb-3">Boat details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Boat name</label>
                    <input
                      type="text"
                      value={boatName}
                      onChange={(e) => setBoatName(e.target.value)}
                      placeholder="e.g., Sea Breeze"
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Boat length (ft)</label>
                      <input
                        type="number"
                        value={boatLength}
                        onChange={(e) => setBoatLength(e.target.value)}
                        placeholder="e.g., 32"
                        max={jetty.maxBoatLength}
                        className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Boat type</label>
                      <select
                        value={boatType}
                        onChange={(e) => setBoatType(e.target.value)}
                        className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      >
                        <option value="">Select type</option>
                        <option value="sailboat">Sailboat</option>
                        <option value="motorboat">Motorboat</option>
                        <option value="yacht">Yacht</option>
                        <option value="fishing">Fishing boat</option>
                        <option value="pontoon">Pontoon</option>
                        <option value="jetski">Jet ski</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium mb-1">Special requests (optional)</label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any special requirements or questions for the host?"
                  rows={3}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                />
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-[var(--border)] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>${jetty.pricePerNight} x {nights} nights</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service fee</span>
                  <span>${serviceFee}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-[var(--border)]">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>

              {bookingError && (
                <p className="text-red-500 text-sm">{bookingError}</p>
              )}
            </div>

            <div className="p-6 border-t border-[var(--border)]">
              <button
                onClick={handleBookingSubmit}
                disabled={bookingLoading}
                className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                  jetty.availability.instantBook
                    ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]'
                    : 'bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90'
                } disabled:opacity-50`}
              >
                {bookingLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : jetty.availability.instantBook ? (
                  'Confirm and Pay'
                ) : (
                  'Send Request'
                )}
              </button>
              {!jetty.availability.instantBook && (
                <p className="text-center text-xs text-[var(--foreground)]/60 mt-2">
                  The host will review your request and respond within 24 hours.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
