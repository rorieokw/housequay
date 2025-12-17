'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FavoriteItem {
  id: string;
  listingId: string;
  createdAt: string;
  listing: {
    id: string;
    title: string;
    city: string;
    state: string;
    pricePerNight: number;
    maxBoatLength: number;
    waterDepth: number;
    rating: number;
    reviewCount: number;
    instantBook: boolean;
    images: Array<{ id: string; url: string }>;
    host: {
      id: string;
      name: string;
      image: string | null;
    };
  };
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchFavorites();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (listingId: string) => {
    setRemoving(listingId);
    try {
      const response = await fetch(`/api/favorites?listingId=${listingId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setFavorites((prev) => prev.filter((f) => f.listingId !== listingId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      setRemoving(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-[var(--muted)] rounded-lg w-48 mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card-premium overflow-hidden">
                  <div className="aspect-[4/3] bg-[var(--muted)]" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-[var(--muted)] rounded w-3/4" />
                    <div className="h-4 bg-[var(--muted)] rounded w-1/2" />
                    <div className="h-6 bg-[var(--muted)] rounded w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold mb-3">Save Your Favorites</h1>
          <p className="text-[var(--foreground-muted)] mb-6">
            Sign in to save jetties you love and access them anytime.
          </p>
          <Link href="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">
            Saved Jetties
          </h1>
          <p className="text-[var(--foreground-muted)] mt-2">
            {favorites.length} {favorites.length === 1 ? 'jetty' : 'jetties'} saved
          </p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((fav, index) => (
              <div
                key={fav.id}
                className="card-premium overflow-hidden group animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image */}
                <Link href={`/jetty/${fav.listing.id}`} className="block relative aspect-[4/3] overflow-hidden bg-[var(--muted)]">
                  {fav.listing.images[0] ? (
                    <Image
                      src={fav.listing.images[0].url}
                      alt={fav.listing.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50">
                      <svg className="w-12 h-12 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    {fav.listing.instantBook && (
                      <div className="flex items-center gap-1.5 bg-gradient-premium text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-md">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Instant
                      </div>
                    )}

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFavorite(fav.listingId);
                      }}
                      disabled={removing === fav.listingId}
                      className="w-9 h-9 rounded-full bg-white text-red-500 flex items-center justify-center shadow-sm hover:scale-110 transition-transform disabled:opacity-50"
                    >
                      {removing === fav.listingId ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </Link>

                {/* Content */}
                <Link href={`/jetty/${fav.listing.id}`} className="block p-4">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-[var(--foreground)] group-hover:text-primary-600 transition-colors line-clamp-1">
                        {fav.listing.title}
                      </h3>
                      <p className="text-sm text-[var(--foreground-muted)] flex items-center gap-1">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{fav.listing.city}, {fav.listing.state}</span>
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-lg shrink-0">
                      <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-bold text-sm text-[var(--foreground)]">{fav.listing.rating}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex items-center gap-3 text-sm text-[var(--foreground-muted)] mb-3">
                    <span>Up to {fav.listing.maxBoatLength}ft</span>
                    <span className="w-1 h-1 bg-[var(--border)] rounded-full" />
                    <span>{fav.listing.waterDepth}m depth</span>
                  </div>

                  {/* Price */}
                  <div className="pt-3 border-t border-[var(--border)]">
                    <span className="font-display text-xl font-bold text-[var(--foreground)]">
                      ${fav.listing.pricePerNight}
                    </span>
                    <span className="text-[var(--foreground-muted)] text-sm"> / night</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-bold mb-2 text-[var(--foreground)]">No saved jetties yet</h2>
            <p className="text-[var(--foreground-muted)] mb-6 max-w-sm mx-auto">
              Start exploring and save jetties you love by clicking the heart icon.
            </p>
            <Link href="/browse" className="btn-primary">
              Browse Jetties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
