import Link from 'next/link';

export default function HostResourcesPage() {
  const resources = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Getting Started Guide',
      description: 'Everything you need to know about listing your jetty and welcoming your first guests.',
      link: '#',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Photography Tips',
      description: 'Learn how to take stunning photos that showcase your jetty and attract more bookings.',
      link: '#',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Pricing Strategy',
      description: 'Set competitive prices that maximize your earnings while attracting quality guests.',
      link: '#',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Guest Communication',
      description: 'Best practices for responding to inquiries and managing guest expectations.',
      link: '#',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: 'Safety Checklist',
      description: 'Ensure your jetty meets safety standards and provide a secure experience for guests.',
      link: '#',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      title: 'Superhost Program',
      description: 'Learn how to achieve Superhost status and unlock exclusive benefits.',
      link: '#',
    },
  ];

  const faqs = [
    {
      question: 'How do I update my listing?',
      answer: 'Go to your Dashboard, click on the listing you want to edit, and make your changes. Updates are live immediately.',
    },
    {
      question: 'How do I handle a booking request?',
      answer: 'You\'ll receive an email and app notification for each request. Review the guest profile and respond within 24 hours to maintain a good response rate.',
    },
    {
      question: 'What if I need to cancel a booking?',
      answer: 'Host cancellations should be avoided when possible as they impact your ranking. If unavoidable, cancel through the dashboard and contact the guest directly.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Host Resources</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Everything you need to become a successful HouseQuay host.
          </p>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[var(--background-secondary)] p-6 rounded-2xl border border-[var(--border)] hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 mb-4">
                  {resource.icon}
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{resource.title}</h3>
                <p className="text-[var(--foreground-muted)] text-sm mb-4">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick FAQ */}
      <section className="py-16 bg-[var(--background-secondary)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">Common Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[var(--background)] p-6 rounded-2xl border border-[var(--border)]"
              >
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-[var(--foreground-muted)] text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/faq"
              className="text-[var(--primary)] font-semibold hover:underline"
            >
              View all FAQs →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Need More Help?</h2>
          <p className="text-[var(--foreground-muted)] mb-8">
            Our host support team is here to assist you every step of the way.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-colors"
          >
            Contact Host Support
          </Link>
        </div>
      </section>
    </div>
  );
}
