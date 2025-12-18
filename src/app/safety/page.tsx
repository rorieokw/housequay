import Link from 'next/link';

export default function SafetyPage() {
  const safetyTips = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Verify Your Host',
      description: 'Check host reviews, response rate, and verification badges before booking. Look for Superhosts who have proven track records.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Pay Through HouseQuay',
      description: 'Always use the HouseQuay payment system. Never pay hosts directly or outside the platform to ensure your payment is protected.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Communicate on Platform',
      description: 'Keep all communications within HouseQuay messaging. This creates a record and helps us assist you if any issues arise.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: 'Check Jetty Specifications',
      description: 'Ensure the jetty can accommodate your boat size, draft, and beam. Verify water depth, dock width, and available power connections.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Know Weather Conditions',
      description: 'Check local weather forecasts and tide schedules. Ask hosts about conditions during storms and seasonal variations.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Have Emergency Contacts',
      description: 'Save local coast guard numbers, marina contacts, and emergency services. Share your mooring location with someone you trust.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Safety Tips</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Your safety is our priority. Follow these guidelines to ensure a secure and enjoyable experience on HouseQuay.
          </p>
        </div>
      </section>

      {/* Safety Tips Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safetyTips.map((tip, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[var(--background-secondary)] p-6 rounded-2xl border border-[var(--border)] hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 mb-4">
                  {tip.icon}
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{tip.title}</h3>
                <p className="text-[var(--foreground-muted)] text-sm leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-16 bg-[var(--background-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-red-700 dark:text-red-400 mb-4">In Case of Emergency</h2>
            <ul className="space-y-3 text-red-700 dark:text-red-400">
              <li className="flex items-start gap-3">
                <span className="font-bold">Australian Maritime Emergency:</span> VHF Channel 16 or call 000
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold">HouseQuay Support:</span> Available 24/7 through the app or website
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold">Report an Incident:</span>{' '}
                <Link href="/contact" className="underline hover:no-underline">Contact our safety team</Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Have Questions?</h2>
          <p className="text-[var(--foreground-muted)] mb-8">
            Our support team is here to help you have a safe experience.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
}
