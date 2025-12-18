import Link from 'next/link';

export default function CommunityGuidelinesPage() {
  const guidelines = [
    {
      icon: '🤝',
      title: 'Be Honest & Accurate',
      description: 'Provide accurate descriptions and photos of your jetty. Set realistic expectations about amenities, conditions, and any limitations.',
    },
    {
      icon: '💬',
      title: 'Communicate Promptly',
      description: 'Respond to inquiries and booking requests within 24 hours. Keep guests informed about check-in procedures and any changes.',
    },
    {
      icon: '🧹',
      title: 'Maintain Your Space',
      description: 'Ensure your jetty is clean, safe, and well-maintained. Address any hazards promptly and keep facilities in working order.',
    },
    {
      icon: '⏰',
      title: 'Honor Your Commitments',
      description: 'Avoid cancellations whenever possible. If you must cancel, do so as early as possible and help guests find alternatives.',
    },
    {
      icon: '🛡️',
      title: 'Prioritize Safety',
      description: 'Maintain proper lighting, secure dock conditions, and clear access. Provide safety equipment information and emergency contacts.',
    },
    {
      icon: '🌊',
      title: 'Respect the Environment',
      description: 'Promote responsible boating practices. Ensure proper waste disposal facilities and protect local marine environments.',
    },
    {
      icon: '👥',
      title: 'Respect Privacy',
      description: 'Disclose any cameras or recording devices. Respect guest privacy while ensuring property security.',
    },
    {
      icon: '📋',
      title: 'Follow Local Laws',
      description: 'Comply with all local regulations regarding waterfront rentals, permits, and taxes. Know your responsibilities as a host.',
    },
  ];

  const violations = [
    {
      severity: 'Minor',
      examples: ['Late response to inquiries', 'Minor accuracy issues in listing', 'Late cancellations'],
      consequence: 'Warning and guidance',
    },
    {
      severity: 'Moderate',
      examples: ['Repeated cancellations', 'Significant misrepresentation', 'Poor communication'],
      consequence: 'Temporary suspension, reduced visibility',
    },
    {
      severity: 'Severe',
      examples: ['Fraud or deception', 'Safety violations', 'Harassment or discrimination'],
      consequence: 'Permanent removal from platform',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Community Guidelines</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Our guidelines help create a safe, welcoming community for all HouseQuay members.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-[var(--background-secondary)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-[var(--foreground-muted)]">
            These guidelines apply to all hosts on HouseQuay. By listing your jetty, you agree to uphold
            these standards to ensure a positive experience for everyone in our community.
          </p>
        </div>
      </section>

      {/* Guidelines Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">Host Standards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guidelines.map((guideline, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[var(--background-secondary)] p-6 rounded-2xl border border-[var(--border)]"
              >
                <div className="text-3xl mb-3">{guideline.icon}</div>
                <h3 className="font-display text-lg font-bold mb-2">{guideline.title}</h3>
                <p className="text-[var(--foreground-muted)] text-sm">{guideline.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Violations Section */}
      <section className="py-16 bg-[var(--background-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">Enforcement</h2>
          <p className="text-[var(--foreground-muted)] text-center mb-8">
            We take guideline violations seriously. Consequences depend on severity and frequency.
          </p>
          <div className="space-y-4">
            {violations.map((violation, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[var(--background)] p-6 rounded-2xl border border-[var(--border)]"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="md:w-1/4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      violation.severity === 'Minor' ? 'bg-yellow-100 text-yellow-800' :
                      violation.severity === 'Moderate' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {violation.severity}
                    </span>
                  </div>
                  <div className="md:w-2/4">
                    <p className="text-sm text-[var(--foreground-muted)]">
                      <span className="font-semibold">Examples:</span> {violation.examples.join(', ')}
                    </p>
                  </div>
                  <div className="md:w-1/4">
                    <p className="text-sm">
                      <span className="font-semibold">Consequence:</span> {violation.consequence}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reporting Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl p-8 text-center">
            <h2 className="font-display text-xl font-bold text-primary-700 dark:text-primary-400 mb-4">
              Report a Concern
            </h2>
            <p className="text-primary-700 dark:text-primary-300 mb-6">
              If you witness or experience any violation of these guidelines, please report it to our
              Trust & Safety team. All reports are confidential.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-colors"
            >
              Report an Issue
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--background-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Ready to Start Hosting?</h2>
          <p className="text-[var(--foreground-muted)] mb-8">
            Join our community of hosts and start earning from your waterfront.
          </p>
          <Link
            href="/host"
            className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-colors"
          >
            List Your Jetty
          </Link>
        </div>
      </section>
    </div>
  );
}
