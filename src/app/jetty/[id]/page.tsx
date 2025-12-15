'use client';

import { useState } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getJettyById } from '@/data/jetties';

interface JettyPageProps {
  params: { id: string };
}

export default function JettyPage({ params }: JettyPageProps) {
  const { id } = params;
  const jetty = getJettyById(id);
  const [currentImage, setCurrentImage] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  if (!jetty) {
    notFound();
  }

  const nights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const subtotal = nights * jetty.pricePerNight;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + serviceFee;

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
              <span className="font-medium">{jetty.rating}</span>
              <span className="text-[var(--foreground)]/60">({jetty.reviewCount} reviews)</span>
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
            <div className="pb-8 border-b border-[var(--border)]">
              <h2 className="text-xl font-semibold mb-4">What this jetty offers</h2>
              <div className="grid grid-cols-2 gap-4">
                {jetty.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[var(--foreground)]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

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
                <div className="flex items-center gap-1 text-sm">
                  <svg className="w-4 h-4 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{jetty.rating}</span>
                </div>
              </div>

              <div className="border border-[var(--border)] rounded-lg overflow-hidden mb-4">
                <div className="grid grid-cols-2">
                  <div className="p-3 border-r border-b border-[var(--border)]">
                    <label className="block text-xs font-semibold mb-1">CHECK-IN</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-transparent text-sm focus:outline-none"
                    />
                  </div>
                  <div className="p-3 border-b border-[var(--border)]">
                    <label className="block text-xs font-semibold mb-1">CHECK-OUT</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn}
                      className="w-full bg-transparent text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  jetty.availability.instantBook
                    ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]'
                    : 'bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90'
                }`}
              >
                {jetty.availability.instantBook ? 'Reserve' : 'Request to Book'}
              </button>

              {!jetty.availability.instantBook && (
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
    </div>
  );
}
