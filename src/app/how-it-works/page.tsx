import Link from 'next/link';

const boaterSteps = [
  {
    number: '1',
    title: 'Search for a jetty',
    description: 'Enter your destination, dates, and boat size to find available jetties that match your needs.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    number: '2',
    title: 'Compare and choose',
    description: 'Browse listings, read reviews, check amenities, and find the perfect spot for your vessel.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    number: '3',
    title: 'Book instantly or request',
    description: 'Some jetties offer instant booking, while others require host approval. Either way, booking is easy.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: '4',
    title: 'Moor and enjoy',
    description: 'Arrive at your jetty, meet your host if needed, and enjoy your time on the water.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
];

const hostSteps = [
  {
    number: '1',
    title: 'Create your listing',
    description: 'Sign up and tell us about your jetty. Add photos, describe amenities, and set your specifications.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    number: '2',
    title: 'Set your terms',
    description: 'Choose your nightly rate, minimum stay, and whether to allow instant booking or approve each request.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: '3',
    title: 'Welcome boaters',
    description: 'Receive booking requests, communicate with guests, and provide a great experience.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    number: '4',
    title: 'Get paid',
    description: 'Receive secure payments directly to your account after each completed stay.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
];

const faqs = [
  {
    question: 'What size boats can use HouseQuay?',
    answer: 'HouseQuay accommodates all boat sizes, from kayaks and jet skis to superyachts over 100 feet. Each listing specifies the maximum boat length, water depth, and berth width to help you find the right fit.',
  },
  {
    question: 'Is my boat insured while moored?',
    answer: 'HouseQuay provides Host Protection Insurance up to $1M for hosts. However, we recommend all boaters maintain their own comprehensive boat insurance for full coverage during their stay.',
  },
  {
    question: 'How do payments work?',
    answer: 'Boaters pay through our secure platform when booking. Hosts receive payment 24 hours after the guest checks in, minus our service fee. We handle all payment processing securely.',
  },
  {
    question: 'What if I need to cancel?',
    answer: 'Cancellation policies vary by listing. Hosts set their own policies (Flexible, Moderate, or Strict). Check the listing details before booking to understand the cancellation terms.',
  },
  {
    question: 'How do I become a Superhost?',
    answer: 'Superhosts are experienced hosts with a track record of providing exceptional experiences. To qualify, you need at least 10 stays, a 4.8+ rating, 90%+ response rate, and fewer than 1% cancellations.',
  },
  {
    question: 'Can I list multiple jetties?',
    answer: 'Yes! Many hosts manage multiple jetty listings. Each jetty is listed separately with its own photos, amenities, and pricing.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How HouseQuay Works</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Whether you&apos;re looking for a place to moor or want to earn from your jetty, we make it simple.
          </p>
        </div>
      </section>

      {/* For Boaters */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">For Boaters</h2>
            <p className="text-[var(--foreground)]/60 max-w-2xl mx-auto">
              Find the perfect mooring spot in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {boaterSteps.map((step) => (
              <div key={step.number} className="relative">
                <div className="bg-[var(--primary)]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-[var(--primary)]">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-[var(--foreground)]/60 text-sm">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/browse"
              className="inline-block bg-[var(--primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-colors"
            >
              Start Searching
            </Link>
          </div>
        </div>
      </section>

      {/* For Hosts */}
      <section className="py-20 bg-[var(--muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">For Hosts</h2>
            <p className="text-[var(--foreground)]/60 max-w-2xl mx-auto">
              Turn your unused jetty into a source of income
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {hostSteps.map((step) => (
              <div key={step.number} className="relative bg-white dark:bg-[var(--background)] p-6 rounded-2xl">
                <div className="bg-[var(--secondary)]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-[var(--secondary)]">
                  {step.icon}
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-[var(--secondary)] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-[var(--foreground)]/60 text-sm">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/host"
              className="inline-block bg-[var(--secondary)] text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Become a Host
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trust & Safety</h2>
            <p className="text-[var(--foreground)]/60 max-w-2xl mx-auto">
              Your safety and security are our top priorities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Verified Profiles</h3>
              <p className="text-[var(--foreground)]/60 text-sm">
                All users verify their identity. Reviews help you know who you&apos;re dealing with.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
              <p className="text-[var(--foreground)]/60 text-sm">
                All payments are processed securely. Hosts don&apos;t receive payment until check-in.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-[var(--foreground)]/60 text-sm">
                Our support team is available around the clock to help with any issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-[var(--muted)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="bg-white dark:bg-[var(--background)] rounded-xl p-6 group"
              >
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                  {faq.question}
                  <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-[var(--foreground)]/60">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-3xl p-8 md:p-16 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of boaters and hosts already using HouseQuay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/browse"
                className="inline-block bg-white text-[var(--primary)] px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-colors"
              >
                Find a Jetty
              </Link>
              <Link
                href="/host"
                className="inline-block bg-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-colors"
              >
                List Your Jetty
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
