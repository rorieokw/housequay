import Link from 'next/link';
import SearchBar from '@/components/SearchBar';

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: 'Find the Perfect Spot',
    description: 'Search thousands of jetties by location, size, and amenities. Filter by boat length to find the perfect fit.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Book with Confidence',
    description: 'Secure bookings with verified hosts. Read reviews from other boaters and know what to expect.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Earn from Your Jetty',
    description: 'Own a jetty? List it on HouseQuay and earn money from your waterfront when you\'re not using it.',
  },
];

const popularLocations = [
  { name: 'Sydney Harbour', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop', count: 245 },
  { name: 'Gold Coast', image: 'https://images.unsplash.com/photo-1571704258042-1f1a2bbb7e55?w=400&h=300&fit=crop', count: 189 },
  { name: 'Great Barrier Reef', image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop', count: 156 },
  { name: 'Whitsundays', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop', count: 134 },
];

const boatCategories = [
  { name: 'Small Boats', description: 'Dinghies, kayaks, jet skis', size: 'Up to 20ft', icon: '🚤' },
  { name: 'Medium Boats', description: 'Runabouts, fishing boats', size: '20-35ft', icon: '⛵' },
  { name: 'Large Boats', description: 'Cruisers, sailboats', size: '35-50ft', icon: '🛥️' },
  { name: 'Yachts', description: 'Motor yachts, sailing yachts', size: '50ft+', icon: '🛳️' },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Mooring
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Discover and book jetties for boats of all sizes. From kayaks to yachts, we&apos;ve got you covered.
            </p>
          </div>
          <SearchBar />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[var(--muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How HouseQuay Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-[var(--background)] p-8 rounded-2xl shadow-sm">
                <div className="text-[var(--primary)] mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-[var(--foreground)]/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Boat Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Jetties for Every Boat</h2>
          <p className="text-center text-[var(--foreground)]/60 mb-12 max-w-2xl mx-auto">
            Whether you have a small dinghy or a luxury yacht, find the right berth for your vessel.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {boatCategories.map((category, index) => (
              <Link
                key={index}
                href={`/browse?boatSize=${category.size.toLowerCase().replace(/[^a-z]/g, '')}`}
                className="group p-6 border border-[var(--border)] rounded-2xl hover:border-[var(--primary)] hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-semibold mb-1 group-hover:text-[var(--primary)]">{category.name}</h3>
                <p className="text-sm text-[var(--foreground)]/60 mb-2">{category.description}</p>
                <p className="text-sm font-medium text-[var(--primary)]">{category.size}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="py-20 bg-[var(--muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Popular Locations</h2>
          <p className="text-center text-[var(--foreground)]/60 mb-12 max-w-2xl mx-auto">
            Explore top destinations where boaters love to moor.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularLocations.map((location, index) => (
              <Link
                key={index}
                href={`/browse?location=${encodeURIComponent(location.name)}`}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundImage: `url(${location.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-semibold">{location.name}</h3>
                  <p className="text-sm text-white/80">{location.count} jetties</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-3xl p-8 md:p-16 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Own a Jetty?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Turn your waterfront into income. List your jetty on HouseQuay and start earning from boaters looking for the perfect spot.
            </p>
            <Link
              href="/host"
              className="inline-block bg-white text-[var(--primary)] px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-colors"
            >
              Start Hosting
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[var(--muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[var(--primary)] mb-2">10,000+</div>
              <div className="text-[var(--foreground)]/60">Jetties Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--primary)] mb-2">50,000+</div>
              <div className="text-[var(--foreground)]/60">Happy Boaters</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--primary)] mb-2">500+</div>
              <div className="text-[var(--foreground)]/60">Locations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--primary)] mb-2">4.8</div>
              <div className="text-[var(--foreground)]/60">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
