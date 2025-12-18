import Link from 'next/link';

export default function PressPage() {
  const pressReleases = [
    {
      date: 'December 2024',
      title: 'HouseQuay Reaches 10,000 Listed Jetties Across Australia',
      excerpt: 'Platform milestone reflects growing demand for private mooring solutions.',
    },
    {
      date: 'October 2024',
      title: 'HouseQuay Launches Host Protection Program',
      excerpt: 'New insurance-backed protection gives hosts peace of mind when renting their jetties.',
    },
    {
      date: 'August 2024',
      title: 'HouseQuay Expands to Queensland',
      excerpt: 'Gold Coast and Brisbane regions now available on the platform.',
    },
    {
      date: 'June 2024',
      title: 'HouseQuay Secures Series A Funding',
      excerpt: 'Investment will accelerate platform development and national expansion.',
    },
  ];

  const mediaFeatures = [
    { outlet: 'Australian Financial Review', quote: 'The Airbnb for boat moorings is making waves.' },
    { outlet: 'Boating Industry Australia', quote: 'A game-changer for recreational boaters.' },
    { outlet: 'Sydney Morning Herald', quote: 'Turning idle jetties into income streams.' },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Press & Media</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            News, announcements, and media resources from HouseQuay.
          </p>
        </div>
      </section>

      {/* Media Contact */}
      <section className="py-12 bg-[var(--background-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-[var(--background)] p-8 rounded-2xl border border-[var(--border)] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold mb-1">Media Inquiries</h2>
              <p className="text-[var(--foreground-muted)]">
                For press inquiries, interviews, or media resources
              </p>
            </div>
            <Link
              href="mailto:press@housequay.com"
              className="inline-flex items-center justify-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-colors"
            >
              press@housequay.com
            </Link>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[var(--background-secondary)] p-6 rounded-2xl border border-[var(--border)] hover:shadow-lg transition-shadow"
              >
                <span className="text-sm text-[var(--primary)] font-medium">{release.date}</span>
                <h3 className="font-display text-lg font-bold mt-1 mb-2">{release.title}</h3>
                <p className="text-[var(--foreground-muted)]">{release.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Features */}
      <section className="py-20 bg-[var(--background-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">In the Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mediaFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[var(--background)] p-6 rounded-2xl border border-[var(--border)] text-center"
              >
                <p className="text-[var(--foreground-muted)] italic mb-4">&ldquo;{feature.quote}&rdquo;</p>
                <p className="font-semibold text-sm">{feature.outlet}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Assets */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Brand Assets</h2>
          <p className="text-[var(--foreground-muted)] mb-8 max-w-xl mx-auto">
            Download our logo, brand guidelines, and other media assets for use in your publications.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-[var(--border)] px-8 py-3 rounded-xl font-semibold hover:bg-[var(--muted)] transition-colors"
          >
            Request Brand Kit
          </Link>
        </div>
      </section>
    </div>
  );
}
