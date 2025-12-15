'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
}

const boatSizes = [
  { value: '', label: 'Any size' },
  { value: 'small', label: 'Small (up to 20ft)' },
  { value: 'medium', label: 'Medium (20-35ft)' },
  { value: 'large', label: 'Large (35-50ft)' },
  { value: 'xlarge', label: 'Extra Large (50-75ft)' },
  { value: 'yacht', label: 'Yacht (75ft+)' },
];

export default function SearchBar({ variant = 'hero' }: SearchBarProps) {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [boatSize, setBoatSize] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (boatSize) params.set('boatSize', boatSize);
    router.push(`/browse?${params.toString()}`);
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSearch} className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 min-w-[150px] px-4 py-2 border border-[var(--border)] rounded-lg bg-white dark:bg-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="px-4 py-2 border border-[var(--border)] rounded-lg bg-white dark:bg-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        <select
          value={boatSize}
          onChange={(e) => setBoatSize(e.target.value)}
          className="px-4 py-2 border border-[var(--border)] rounded-lg bg-white dark:bg-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          {boatSizes.map((size) => (
            <option key={size.value} value={size.value}>{size.label}</option>
          ))}
        </select>
        <button
          type="submit"
          className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
        >
          Search
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-[var(--muted)] rounded-2xl shadow-xl border border-[var(--border)] p-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {/* Location */}
          <div className="relative">
            <label className="absolute top-2 left-4 text-xs font-semibold text-[var(--foreground)]/60">
              Location
            </label>
            <input
              type="text"
              placeholder="Where are you mooring?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pt-7 pb-3 px-4 rounded-xl bg-transparent focus:bg-[var(--muted)] dark:focus:bg-[var(--background)] focus:outline-none transition-colors"
            />
          </div>

          {/* Check In */}
          <div className="relative">
            <label className="absolute top-2 left-4 text-xs font-semibold text-[var(--foreground)]/60">
              Check In
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full pt-7 pb-3 px-4 rounded-xl bg-transparent focus:bg-[var(--muted)] dark:focus:bg-[var(--background)] focus:outline-none transition-colors"
            />
          </div>

          {/* Check Out */}
          <div className="relative">
            <label className="absolute top-2 left-4 text-xs font-semibold text-[var(--foreground)]/60">
              Check Out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full pt-7 pb-3 px-4 rounded-xl bg-transparent focus:bg-[var(--muted)] dark:focus:bg-[var(--background)] focus:outline-none transition-colors"
            />
          </div>

          {/* Boat Size */}
          <div className="relative flex items-center gap-2">
            <div className="flex-1">
              <label className="absolute top-2 left-4 text-xs font-semibold text-[var(--foreground)]/60">
                Boat Size
              </label>
              <select
                value={boatSize}
                onChange={(e) => setBoatSize(e.target.value)}
                className="w-full pt-7 pb-3 px-4 rounded-xl bg-transparent focus:bg-[var(--muted)] dark:focus:bg-[var(--background)] focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                {boatSizes.map((size) => (
                  <option key={size.value} value={size.value}>{size.label}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-[var(--primary)] text-white p-4 rounded-xl hover:bg-[var(--primary-dark)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
