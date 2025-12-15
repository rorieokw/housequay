'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Jetty } from '@/data/jetties';

interface JettyCardProps {
  jetty: Jetty;
}

export default function JettyCard({ jetty }: JettyCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [imageError, setImageError] = useState(false);

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

  return (
    <Link href={`/jetty/${jetty.id}`} className="group block">
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--muted)]">
        {!imageError ? (
          <Image
            src={jetty.images[currentImage]}
            alt={jetty.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--muted)]">
            <svg className="w-12 h-12 text-[var(--foreground)]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Image Navigation */}
        {jetty.images.length > 1 && !imageError && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {jetty.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === currentImage ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Superhost Badge */}
        {jetty.host.superhost && (
          <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-md text-xs font-medium">
            Superhost
          </div>
        )}

        {/* Instant Book Badge */}
        {jetty.availability.instantBook && (
          <div className="absolute top-2 right-2 bg-[var(--primary)] text-white px-2 py-1 rounded-md text-xs font-medium">
            Instant Book
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors line-clamp-1">
            {jetty.title}
          </h3>
          <div className="flex items-center gap-1 text-sm shrink-0 ml-2">
            <svg className="w-4 h-4 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium">{jetty.rating}</span>
            <span className="text-[var(--foreground)]/50">({jetty.reviewCount})</span>
          </div>
        </div>

        <p className="text-sm text-[var(--foreground)]/60 mt-1">{jetty.location}</p>

        <div className="flex items-center gap-2 mt-1 text-sm text-[var(--foreground)]/60">
          <span>Up to {jetty.maxBoatLength}ft</span>
          <span>&middot;</span>
          <span>{jetty.features.depth}m depth</span>
        </div>

        <div className="mt-2">
          <span className="font-semibold">${jetty.pricePerNight}</span>
          <span className="text-[var(--foreground)]/60"> / night</span>
        </div>
      </div>
    </Link>
  );
}
