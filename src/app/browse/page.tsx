'use client';

import { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import JettyCard from '@/components/JettyCard';
import { jetties as demoJetties, filterJetties, Jetty } from '@/data/jetties';

const JettyMap = lazy(() => import('@/components/JettyMap'));

// Convert database listing to Jetty format
interface DbListing {
  id: string;
  title: string;
  description: string;
  city: string;
  state: string;
  address: string;
  lat: number;
  lng: number;
  pricePerNight: number;
  cleaningFee: number | null;
  maxBoatLength: number;
  waterDepth: number;
  berthWidth: number;
  amenities: string[];
  instantBook: boolean;
  rating: number;
  reviewCount: number;
  images: Array<{ url: string }>;
  host: {
    id: string;
    name: string;
    image: string | null;
  };
}

function getBoatLengthCategory(length: number): 'small' | 'medium' | 'large' | 'xlarge' | 'yacht' {
  if (length <= 20) return 'small';
  if (length <= 35) return 'medium';
  if (length <= 50) return 'large';
  if (length <= 75) return 'xlarge';
  return 'yacht';
}

function dbListingToJetty(listing: DbListing): Jetty {
  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    location: `${listing.address}, ${listing.city}`,
    city: listing.city,
    coordinates: { lat: listing.lat, lng: listing.lng },
    pricePerNight: listing.pricePerNight,
    maxBoatLength: listing.maxBoatLength,
    maxBoatLengthCategory: getBoatLengthCategory(listing.maxBoatLength),
    images: listing.images.length > 0
      ? listing.images.map(img => img.url)
      : ['https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800'],
    amenities: listing.amenities,
    rating: listing.rating,
    reviewCount: listing.reviewCount,
    host: {
      id: listing.host.id,
      name: listing.host.name,
      avatar: listing.host.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      superhost: false,
      responseRate: 100,
      responseTime: 'within an hour',
    },
    availability: {
      instantBook: listing.instantBook,
      minimumStay: 1,
    },
    features: {
      depth: listing.waterDepth,
      width: listing.berthWidth,
      power: listing.amenities.includes('Power'),
      water: listing.amenities.includes('Water'),
      wifi: listing.amenities.includes('WiFi'),
      security: listing.amenities.includes('Security'),
      lighting: listing.amenities.includes('Lighting'),
      fuel: listing.amenities.includes('Fuel'),
    },
    isFromDatabase: true,
  };
}

const boatSizeOptions = [
  { value: '', label: 'Any size' },
  { value: 'small', label: 'Small (up to 20ft)' },
  { value: 'medium', label: 'Medium (20-35ft)' },
  { value: 'large', label: 'Large (35-50ft)' },
  { value: 'xlarge', label: 'Extra Large (50-75ft)' },
  { value: 'yacht', label: 'Yacht (75ft+)' },
];

const amenityOptions = [
  { value: 'Power', icon: '⚡' },
  { value: 'Water', icon: '💧' },
  { value: 'WiFi', icon: '📶' },
  { value: 'Security', icon: '🔒' },
  { value: 'Fuel', icon: '⛽' },
  { value: 'Lighting', icon: '💡' },
  { value: 'Showers', icon: '🚿' },
  { value: 'Parking', icon: '🅿️' },
];

const sortOptions = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'reviews', label: 'Most Reviews' },
];

function BrowseContent() {
  const searchParams = useSearchParams();
  const initialLocation = searchParams.get('location') || '';
  const initialBoatSize = searchParams.get('boatSize') || '';
  const initialCheckIn = searchParams.get('checkIn') || '';
  const initialCheckOut = searchParams.get('checkOut') || '';

  const [location, setLocation] = useState(initialLocation);
  const [boatSize, setBoatSize] = useState(initialBoatSize);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'split'>('list');
  const [selectedJetty, setSelectedJetty] = useState<Jetty | null>(null);

  // Database listings state
  const [dbListings, setDbListings] = useState<Jetty[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);

  // Availability data (for date-based filtering)
  const [unavailableListings, setUnavailableListings] = useState<Set<string>>(new Set());

  // Fetch database listings on mount
  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch('/api/listings');
        if (response.ok) {
          const data = await response.json();
          const converted = data.listings.map(dbListingToJetty);
          setDbListings(converted);
        }
      } catch (error) {
        console.log('Failed to fetch database listings:', error);
      } finally {
        setLoadingDb(false);
      }
    }
    fetchListings();
  }, []);

  // Check availability when dates change
  useEffect(() => {
    if (!checkIn || !checkOut) {
      setUnavailableListings(new Set());
      return;
    }

    async function checkAvailability() {
      try {
        // Get all database listing IDs
        const dbIds = dbListings.filter(j => j.isFromDatabase).map(j => j.id);
        if (dbIds.length === 0) return;

        // Check availability for each listing
        const unavailable = new Set<string>();
        await Promise.all(
          dbIds.map(async (listingId) => {
            try {
              const response = await fetch(`/api/listings/${listingId}/availability?checkIn=${checkIn}&checkOut=${checkOut}`);
              if (response.ok) {
                const data = await response.json();
                if (!data.available) {
                  unavailable.add(listingId);
                }
              }
            } catch (err) {
              // Ignore individual listing errors
            }
          })
        );
        setUnavailableListings(unavailable);
      } catch (error) {
        console.log('Failed to check availability:', error);
      }
    }

    checkAvailability();
  }, [checkIn, checkOut, dbListings]);

  // Combine database listings with demo listings (db listings first)
  const allJetties = useMemo(() => {
    // Filter out demo jetties that might conflict with db jetties by ID
    const dbIds = new Set(dbListings.map(j => j.id));
    const filteredDemo = demoJetties.filter(j => !dbIds.has(j.id));
    return [...dbListings, ...filteredDemo];
  }, [dbListings]);

  const filteredJetties = useMemo(() => {
    // Apply filters to combined listings
    let results = allJetties;

    // Availability filter (based on dates)
    if (checkIn && checkOut && unavailableListings.size > 0) {
      results = results.filter(j => !unavailableListings.has(j.id));
    }

    // Location filter
    if (location) {
      const loc = location.toLowerCase();
      results = results.filter(j =>
        j.location.toLowerCase().includes(loc) ||
        j.city.toLowerCase().includes(loc) ||
        j.title.toLowerCase().includes(loc)
      );
    }

    // Boat size filter
    if (boatSize) {
      const sizeMap: Record<string, number> = {
        small: 20,
        medium: 35,
        large: 50,
        xlarge: 75,
        yacht: 200,
      };
      const minLength = sizeMap[boatSize] || 0;
      results = results.filter(j => j.maxBoatLength >= minLength);
    }

    // Price filter
    if (minPrice) {
      results = results.filter(j => j.pricePerNight >= parseInt(minPrice));
    }
    if (maxPrice) {
      results = results.filter(j => j.pricePerNight <= parseInt(maxPrice));
    }

    // Amenities filter
    if (selectedAmenities.length > 0) {
      results = results.filter(j =>
        selectedAmenities.every(amenity => j.amenities.includes(amenity))
      );
    }

    // Sort results
    switch (sortBy) {
      case 'price-low':
        results = [...results].sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case 'price-high':
        results = [...results].sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case 'rating':
        results = [...results].sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        results = [...results].sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        // Recommended: Show database listings first, then by rating
        results = [...results].sort((a, b) => {
          const aDb = (a as Jetty & { isFromDatabase?: boolean }).isFromDatabase ? 1 : 0;
          const bDb = (b as Jetty & { isFromDatabase?: boolean }).isFromDatabase ? 1 : 0;
          if (bDb !== aDb) return bDb - aDb;
          return b.rating - a.rating;
        });
    }

    return results;
  }, [allJetties, location, boatSize, minPrice, maxPrice, selectedAmenities, sortBy, checkIn, checkOut, unavailableListings]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setLocation('');
    setBoatSize('');
    setCheckIn('');
    setCheckOut('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedAmenities([]);
  };

  const hasActiveFilters = location || boatSize || checkIn || checkOut || minPrice || maxPrice || selectedAmenities.length > 0;
  const activeFilterCount = [location, boatSize, checkIn, checkOut, minPrice, maxPrice].filter(Boolean).length + selectedAmenities.length;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Premium Search Header */}
      <div className="relative bg-gradient-to-r from-primary-700 via-primary-600 to-accent-600 py-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
              Find Your Perfect Berth
            </h1>
            <p className="text-primary-100 mt-1">
              {filteredJetties.length} premium jetties available
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <SearchBar variant="compact" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filters Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-[var(--muted)] border border-[var(--border)] rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex items-center justify-center w-6 h-6 bg-gradient-premium text-white text-xs font-bold rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Premium Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 shrink-0`}>
            <div className="sticky top-24 card-premium p-6 space-y-6">
              {/* Filters Header */}
              <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-premium rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h2 className="font-display font-bold text-lg">Filters</h2>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by city or area..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input-premium w-full pl-10"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Dates Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Dates
                </label>
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="input-premium w-full cursor-pointer"
                      placeholder="Check-in"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--foreground-muted)] pointer-events-none">
                      Check-in
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      className="input-premium w-full cursor-pointer"
                      placeholder="Check-out"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--foreground-muted)] pointer-events-none">
                      Check-out
                    </span>
                  </div>
                </div>
                {checkIn && checkOut && (
                  <p className="text-xs text-primary-600">
                    Showing available jetties for selected dates
                  </p>
                )}
              </div>

              {/* Boat Size Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Boat Size
                </label>
                <select
                  value={boatSize}
                  onChange={(e) => setBoatSize(e.target.value)}
                  className="input-premium w-full appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.25rem',
                    paddingRight: '2.5rem'
                  }}
                >
                  {boatSizeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Price per Night
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">$</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="input-premium w-full pl-7"
                    />
                  </div>
                  <span className="flex items-center text-[var(--foreground-muted)]">—</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">$</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="input-premium w-full pl-7"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities Filter */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Amenities
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {amenityOptions.map((amenity) => (
                    <button
                      key={amenity.value}
                      onClick={() => toggleAmenity(amenity.value)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedAmenities.includes(amenity.value)
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-2 border-primary-500'
                          : 'bg-[var(--muted)] text-[var(--foreground-muted)] border-2 border-transparent hover:bg-[var(--border)]'
                      }`}
                    >
                      <span className="text-base">{amenity.icon}</span>
                      <span className="truncate">{amenity.value}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filters Count */}
              {activeFilterCount > 0 && (
                <div className="pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--foreground-muted)]">Active filters</span>
                    <span className="px-2.5 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full font-semibold">
                      {activeFilterCount}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-[var(--foreground)]">
                  {location ? `Jetties in ${location}` : 'All Jetties'}
                </h2>
                <p className="text-[var(--foreground-muted)] mt-1">
                  Showing <span className="font-semibold text-[var(--foreground)]">{filteredJetties.length}</span> {filteredJetties.length === 1 ? 'result' : 'results'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Premium View Toggle */}
                <div className="flex items-center p-1 bg-[var(--muted)] rounded-xl">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-[var(--background)] text-[var(--foreground)] shadow-sm'
                        : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      viewMode === 'map'
                        ? 'bg-white dark:bg-[var(--background)] text-[var(--foreground)] shadow-sm'
                        : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span className="hidden sm:inline">Map</span>
                  </button>
                  <button
                    onClick={() => setViewMode('split')}
                    className={`hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      viewMode === 'split'
                        ? 'bg-white dark:bg-[var(--background)] text-[var(--foreground)] shadow-sm'
                        : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                    <span>Split</span>
                  </button>
                </div>

                {/* Premium Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input-premium pr-10 appearance-none cursor-pointer font-medium"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25rem',
                    }}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Content */}
            {loadingDb ? (
              // Premium Loading Skeleton
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="card-premium overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-gradient-to-r from-[var(--muted)] to-[var(--border)]" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-[var(--muted)] rounded-lg w-3/4" />
                      <div className="h-4 bg-[var(--muted)] rounded-lg w-1/2" />
                      <div className="flex gap-2">
                        <div className="h-6 bg-[var(--muted)] rounded-md w-16" />
                        <div className="h-6 bg-[var(--muted)] rounded-md w-16" />
                      </div>
                      <div className="pt-4 border-t border-[var(--border)]">
                        <div className="h-6 bg-[var(--muted)] rounded-lg w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredJetties.length > 0 ? (
              <>
                {/* List/Grid View */}
                {viewMode === 'list' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJetties.map((jetty, index) => (
                      <div
                        key={jetty.id}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <JettyCard jetty={jetty} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Map View */}
                {viewMode === 'map' && (
                  <div className="h-[600px] rounded-2xl overflow-hidden shadow-premium-lg border border-[var(--border)]">
                    <Suspense
                      fallback={
                        <div className="w-full h-full bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                            <span className="text-sm text-[var(--foreground-muted)]">Loading map...</span>
                          </div>
                        </div>
                      }
                    >
                      <JettyMap
                        jetties={filteredJetties}
                        selectedJetty={selectedJetty}
                        onMarkerClick={setSelectedJetty}
                      />
                    </Suspense>
                  </div>
                )}

                {/* Split View */}
                {viewMode === 'split' && (
                  <div className="flex gap-6 h-[700px]">
                    {/* List Side */}
                    <div className="w-1/2 overflow-y-auto pr-2 space-y-4 scrollbar-thin">
                      {filteredJetties.map((jetty) => (
                        <div
                          key={jetty.id}
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedJetty?.id === jetty.id
                              ? 'ring-2 ring-primary-500 rounded-2xl scale-[1.02]'
                              : 'hover:scale-[1.01]'
                          }`}
                          onClick={() => setSelectedJetty(jetty)}
                        >
                          <JettyCard jetty={jetty} />
                        </div>
                      ))}
                    </div>
                    {/* Map Side */}
                    <div className="w-1/2 rounded-2xl overflow-hidden shadow-premium-lg border border-[var(--border)]">
                      <Suspense
                        fallback={
                          <div className="w-full h-full bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                              <span className="text-sm text-[var(--foreground-muted)]">Loading map...</span>
                            </div>
                          </div>
                        }
                      >
                        <JettyMap
                          jetties={filteredJetties}
                          selectedJetty={selectedJetty}
                          onMarkerClick={setSelectedJetty}
                        />
                      </Suspense>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Premium Empty State
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-bold mb-2 text-[var(--foreground)]">No jetties found</h3>
                <p className="text-[var(--foreground-muted)] mb-6 max-w-sm mx-auto">
                  We couldn&apos;t find any jetties matching your criteria. Try adjusting your filters or search in a different area.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <span className="text-[var(--foreground-muted)] font-medium">Loading jetties...</span>
        </div>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
