import Link from 'next/link';

export default function HostInsurancePage() {
  const coverageItems = [
    {
      title: 'Property Damage Protection',
      amount: 'Up to $50,000',
      description: 'Coverage for physical damage to your jetty, dock, and associated structures caused by guests.',
    },
    {
      title: 'Liability Coverage',
      amount: 'Up to $1,000,000',
      description: 'Protection if a guest is injured on your property and you\'re found legally responsible.',
    },
    {
      title: 'Loss of Income',
      amount: 'Up to 30 days',
      description: 'Compensation for lost bookings if your jetty is damaged and unusable.',
    },
  ];

  const notCovered = [
    'Intentional damage by the host',
    'Normal wear and tear',
    'Pre-existing damage',
    'Damage to guest vessels',
    'Cash, jewelry, or personal valuables',
  ];

  const steps = [
    {
      step: '1',
      title: 'Document the Damage',
      description: 'Take photos and videos of any damage as soon as you discover it.',
    },
    {
      step: '2',
      title: 'Report Within 24 Hours',
      description: 'Submit a claim through your host dashboard within 24 hours of the guest\'s checkout.',
    },
    {
      step: '3',
      title: 'Provide Documentation',
      description: 'Upload photos, repair estimates, and any relevant receipts.',
    },
    {
      step: '4',
      title: 'Claim Review',
      description: 'Our team reviews your claim within 5 business days.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Host Protection Insurance</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Every booking on HouseQuay includes our Host Protection Program at no extra cost.
          </p>
        </div>
      </section>

      {/* Coverage Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">What&apos;s Covered</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coverageItems.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[var(--background-secondary)] p-6 rounded-2xl border border-[var(--border)] text-center"
              >
                <div className="text-3xl font-bold gradient-text mb-2">{item.amount}</div>
                <h3 className="font-display text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-[var(--foreground-muted)] text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Not Covered Section */}
      <section className="py-16 bg-[var(--background-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-[var(--background)] p-8 rounded-2xl border border-[var(--border)]">
            <h2 className="font-display text-xl font-bold mb-4">What&apos;s Not Covered</h2>
            <p className="text-[var(--foreground-muted)] mb-4">
              The Host Protection Program has some exclusions. The following are not covered:
            </p>
            <ul className="space-y-2">
              {notCovered.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-[var(--foreground-muted)]">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Claims Process */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">How to File a Claim</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-display font-bold mb-2">{step.title}</h3>
                <p className="text-[var(--foreground-muted)] text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendation Section */}
      <section className="py-16 bg-[var(--background-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl p-8">
            <h2 className="font-display text-xl font-bold text-primary-700 dark:text-primary-400 mb-4">
              Additional Insurance Recommendation
            </h2>
            <p className="text-primary-700 dark:text-primary-300 mb-4">
              While our Host Protection Program provides valuable coverage, we recommend hosts also maintain their own
              property and liability insurance. Your personal insurance may offer additional protections and higher
              coverage limits.
            </p>
            <p className="text-primary-700 dark:text-primary-300">
              Consult with your insurance provider to ensure you have adequate coverage for hosting activities.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Questions About Coverage?</h2>
          <p className="text-[var(--foreground-muted)] mb-8">
            Our team can help you understand your protection options.
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
