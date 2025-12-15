'use client';

import { useState, useMemo, Suspense, lazy } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import JettyCard from '@/components/JettyCard';
import { jetties, filterJetties, Jetty } from '@/data/jetties';

const JettyMap = lazy(() => import('@/components/JettyMap'));

const boatSizeOptions = [
  { value: '', label: 'Any size' },
  { value: 'small', label: 'Small (up to 20ft)' },
  { value: 'medium', label: 'Medium (20-35ft)' },
  { value: 'large', label: 'Large (35-50ft)' },
  { value: 'xlarge', label: 'Extra Large (50-75ft)' },
  { value: 'yacht', label: 'Yacht (75ft+)' },
];

const amenityOptions = [
  'Power',
  'Water',
  'WiFi',
  'Security',
  'Fuel',
  'Lighting',
  'Showers',
  'Parking',
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

  const [location, setLocation] = useState(initialLocation);
  const [boatSize, setBoatSize] = useState(initialBoatSize);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'split'>('list');
  const [selectedJetty, setSelectedJetty] = useState<Jetty | null>(null);

  const filteredJetties = useMemo(() => {
    let results = filterJetties({
      location: location || undefined,
      boatSize: boatSize || undefined,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
    });

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
    }

    return results;
  }, [location, boatSize, minPrice, maxPrice, selectedAmenities, sortBy]);

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
    setMinPrice('');
    setMaxPrice('');
    setSelectedAmenities([]);
  };

  const hasActiveFilters = location || boatSize || minPrice || maxPrice || selectedAmenities.length > 0;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Search Header */}
      <div className="bg-white dark:bg-[var(--muted)] border-b border-[var(--border)] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar variant="compact" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Toggle (Mobile) */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {hasActiveFilters && (
              <span className="bg-[var(--primary)] text-white text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 shrink-0`}>
            <div className="sticky top-24 space-y-6 bg-white dark:bg-[var(--muted)] p-6 rounded-xl border border-[var(--border)]">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[var(--primary)] hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Search location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              {/* Boat Size */}
              <div>
                <label className="block text-sm font-medium mb-2">Boat Size</label>
                <select
                  value={boatSize}
                  onChange={(e) => setBoatSize(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  {boatSizeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium mb-2">Price per night</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium mb-2">Amenities</label>
                <div className="space-y-2">
                  {amenityOptions.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">
                  {location ? `Jetties in ${location}` : 'All Jetties'}
                </h1>
                <p className="text-[var(--foreground)]/60">
                  {filteredJetties.length} {filteredJetties.length === 1 ? 'jetty' : 'jetties'} available
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    List
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'map'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Map
                  </button>
                  <button
                    onClick={() => setViewMode('split')}
                    className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'split'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                    Split
                  </button>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Content */}
            {filteredJetties.length > 0 ? (
              <>
                {/* List View */}
                {viewMode === 'list' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJetties.map((jetty) => (
                      <JettyCard key={jetty.id} jetty={jetty} />
                    ))}
                  </div>
                )}

                {/* Map View */}
                {viewMode === 'map' && (
                  <div className="h-[600px] rounded-xl overflow-hidden border border-[var(--border)]">
                    <Suspense
                      fallback={
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary)]"></div>
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
                    <div className="w-1/2 overflow-y-auto pr-2 space-y-4">
                      {filteredJetties.map((jetty) => (
                        <div
                          key={jetty.id}
                          className={`cursor-pointer transition-all ${
                            selectedJetty?.id === jetty.id
                              ? 'ring-2 ring-[var(--primary)] rounded-xl'
                              : ''
                          }`}
                          onClick={() => setSelectedJetty(jetty)}
                        >
                          <JettyCard jetty={jetty} />
                        </div>
                      ))}
                    </div>
                    {/* Map Side */}
                    <div className="w-1/2 rounded-xl overflow-hidden border border-[var(--border)]">
                      <Suspense
                        fallback={
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary)]"></div>
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
              <div className="text-center py-16">
                <svg className="w-16 h-16 mx-auto text-[var(--foreground)]/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold mb-2">No jetties found</h3>
                <p className="text-[var(--foreground)]/60 mb-4">
                  Try adjusting your filters to see more results.
                </p>
                <button
                  onClick={clearFilters}
                  className="text-[var(--primary)] hover:underline"
                >
                  Clear all filters
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
