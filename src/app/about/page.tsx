import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  const values = [
    {
      icon: '🤝',
      title: 'Trust & Safety',
      description: 'We verify every host and protect every booking. Your security is built into everything we do.',
    },
    {
      icon: '🌊',
      title: 'Community First',
      description: 'We\'re building a community of boat lovers and waterfront owners who share a passion for the water.',
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'We\'re constantly improving our platform to make finding and booking jetties easier than ever.',
    },
    {
      icon: '🌏',
      title: 'Sustainability',
      description: 'We promote responsible boating and support hosts who maintain environmentally friendly practices.',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Jetties Listed' },
    { value: '50,000+', label: 'Happy Boaters' },
    { value: '500+', label: 'Locations' },
    { value: '4.9/5', label: 'Average Rating' },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">About HouseQuay</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            We&apos;re on a mission to connect boat owners with perfect mooring spots,
            while helping waterfront property owners earn from their unused jetties.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge badge-primary mb-4">Our Story</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Born from a Simple Problem
              </h2>
              <div className="space-y-4 text-[var(--foreground-muted)] leading-relaxed">
                <p>
                  HouseQuay started when our founders, avid boaters themselves, struggled to find
                  convenient and affordable mooring options along Australia&apos;s beautiful coastline.
                </p>
                <p>
                  Meanwhile, they noticed countless private jetties sitting empty, their owners
                  unaware of the demand or unsure how to safely rent them out.
                </p>
                <p>
                  In 2023, we launched HouseQuay to bridge this gap—creating Australia&apos;s first
                  dedicated marketplace for private jetty rentals. Today, we&apos;re proud to serve
                  thousands of boaters and hosts across the country.
                </p>
              </div>
            </div>
            <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop"
                alt="Boat at jetty"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[var(--background-secondary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-[var(--foreground-muted)] font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="badge badge-primary mb-4">Our Values</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[var(--background-secondary)] p-6 rounded-2xl border border-[var(--border)] text-center"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-display text-lg font-bold mb-2">{value.title}</h3>
                <p className="text-[var(--foreground-muted)] text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--background-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Join the HouseQuay Community</h2>
          <p className="text-[var(--foreground-muted)] mb-8 max-w-2xl mx-auto">
            Whether you&apos;re looking for the perfect mooring spot or want to earn from your waterfront,
            we&apos;re here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/browse"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-colors"
            >
              Browse Jetties
            </Link>
            <Link
              href="/host"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[var(--border)] px-8 py-3 rounded-xl font-semibold hover:bg-[var(--muted)] transition-colors"
            >
              Become a Host
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
