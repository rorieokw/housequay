'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { Jetty } from '@/data/jetties';

interface JettyCardProps {
  jetty: Jetty;
  featured?: boolean;
  initialFavorited?: boolean;
  onFavoriteChange?: (jettyId: string, isFavorited: boolean) => void;
}

export default function JettyCard({ jetty, featured = false, initialFavorited = false, onFavoriteChange }: JettyCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % jetty.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + jetty.images.length) % jetty.images.length);
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Redirect to login if not authenticated
    if (!session) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/favorites?listingId=${jetty.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setIsFavorited(false);
          onFavoriteChange?.(jetty.id, false);
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listingId: jetty.id }),
        });
        if (response.ok) {
          setIsFavorited(true);
          onFavoriteChange?.(jetty.id, true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link
      href={`/jetty/${jetty.id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`card-premium overflow-hidden ${featured ? 'md:flex' : ''}`}>
        {/* Image Container */}
        <div className={`relative ${featured ? 'md:w-2/5' : ''} aspect-[4/3] overflow-hidden bg-[var(--muted)]`}>
          {!imageError ? (
            <Image
              src={jetty.images[currentImage]}
              alt={jetty.title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50">
              <svg className="w-16 h-16 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Image Navigation */}
          {jetty.images.length > 1 && !imageError && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/95 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 shadow-lg backdrop-blur-sm"
                aria-label="Previous image"
              >
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/95 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 shadow-lg backdrop-blur-sm"
                aria-label="Next image"
              >
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Image Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {jetty.images.slice(0, 5).map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImage(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentImage
                        ? 'bg-white w-4'
                        : 'bg-white/60 hover:bg-white/80'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
                {jetty.images.length > 5 && (
                  <span className="text-white/80 text-xs ml-1">+{jetty.images.length - 5}</span>
                )}
              </div>
            </>
          )}

          {/* Top Badges Row */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <div className="flex gap-2">
              {/* Superhost Badge */}
              {jetty.host.superhost && (
                <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
                  <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-gray-800">Superhost</span>
                </div>
              )}

              {/* Instant Book Badge */}
              {jetty.availability.instantBook && (
                <div className="flex items-center gap-1.5 bg-gradient-premium text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-md">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Instant</span>
                </div>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={toggleFavorite}
              disabled={isLoading}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                isFavorited
                  ? 'bg-white text-red-500'
                  : 'bg-black/20 backdrop-blur-sm text-white hover:bg-white hover:text-gray-800'
              } shadow-sm disabled:opacity-70`}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-5 h-5"
                  fill={isFavorited ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`p-4 ${featured ? 'md:flex-1 md:p-6' : ''}`}>
          {/* Header Row */}
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-[var(--foreground)] group-hover:text-primary-600 transition-colors line-clamp-1 text-lg">
                {jetty.title}
              </h3>
              <p className="text-sm text-[var(--foreground-muted)] mt-0.5 flex items-center gap-1">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{jetty.city}</span>
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 bg-primary-50 dark:bg-primary-900/20 px-2.5 py-1.5 rounded-lg shrink-0">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold text-sm text-[var(--foreground)]">{jetty.rating}</span>
              <span className="text-xs text-[var(--foreground-muted)]">({jetty.reviewCount})</span>
            </div>
          </div>

          {/* Features Row */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-sm text-[var(--foreground-muted)]">
              <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>Up to <strong>{jetty.maxBoatLength}ft</strong></span>
            </div>
            <div className="w-1 h-1 bg-[var(--border)] rounded-full" />
            <div className="flex items-center gap-1.5 text-sm text-[var(--foreground-muted)]">
              <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span><strong>{jetty.features.depth}m</strong> depth</span>
            </div>
            {jetty.features.width && (
              <>
                <div className="w-1 h-1 bg-[var(--border)] rounded-full" />
                <div className="flex items-center gap-1.5 text-sm text-[var(--foreground-muted)]">
                  <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span><strong>{jetty.features.width}m</strong> wide</span>
                </div>
              </>
            )}
          </div>

          {/* Amenities Preview */}
          {jetty.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {jetty.amenities.slice(0, 4).map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-[var(--muted)] text-xs text-[var(--foreground-muted)]"
                >
                  {amenity}
                </span>
              ))}
              {jetty.amenities.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-[var(--muted)] text-xs text-[var(--foreground-muted)]">
                  +{jetty.amenities.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Price Row */}
          <div className="flex items-end justify-between mt-4 pt-4 border-t border-[var(--border)]">
            <div>
              <span className="font-display text-2xl font-bold text-[var(--foreground)]">
                ${jetty.pricePerNight}
              </span>
              <span className="text-[var(--foreground-muted)] text-sm"> / night</span>
            </div>

            {/* Quick View Button (appears on hover) */}
            <div
              className={`transition-all duration-200 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:text-primary-700">
                View Details
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
