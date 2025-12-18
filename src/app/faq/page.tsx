'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const faqData: FAQSection[] = [
  {
    title: 'For Boaters',
    items: [
      {
        question: 'How do I book a jetty?',
        answer: 'Browse available jetties using our search feature, select your dates, and click "Book Now" or "Request to Book". For instant bookings, your reservation is confirmed immediately. For booking requests, the host will respond within 24 hours.',
      },
      {
        question: 'What if the jetty doesn\'t match the description?',
        answer: 'Contact the host immediately through our messaging system. If the issue can\'t be resolved, reach out to HouseQuay support and we\'ll help find an alternative or process a refund according to our cancellation policy.',
      },
      {
        question: 'Can I cancel my booking?',
        answer: 'Yes, you can cancel bookings through your dashboard. Refund amounts depend on the host\'s cancellation policy and how far in advance you cancel. Check the specific listing for policy details.',
      },
      {
        question: 'What amenities are typically included?',
        answer: 'Amenities vary by listing but commonly include water hookup, shore power, WiFi, security lighting, and parking. Each listing clearly displays available amenities so you know exactly what to expect.',
      },
      {
        question: 'Is my boat insured while moored?',
        answer: 'You should maintain your own boat insurance. HouseQuay provides platform protection for bookings, but individual boat coverage remains the owner\'s responsibility. Check with your insurer about coverage while using private moorings.',
      },
    ],
  },
  {
    title: 'For Hosts',
    items: [
      {
        question: 'How do I list my jetty?',
        answer: 'Click "List Your Jetty" and follow our simple 7-step wizard. You\'ll add details about your jetty, upload photos, set pricing, and define your availability. Most hosts complete their listing in under 15 minutes.',
      },
      {
        question: 'How much can I earn?',
        answer: 'Earnings depend on your location, jetty specifications, and local demand. Sydney Harbour jetties can earn $100-300+ per night, while regional areas typically see $50-150 per night. You set your own prices.',
      },
      {
        question: 'When do I get paid?',
        answer: 'Payments are released 24 hours after the guest\'s check-in date. Funds are transferred directly to your linked bank account, typically arriving within 3-5 business days.',
      },
      {
        question: 'What if a guest damages my property?',
        answer: 'Document any damage with photos immediately and report it through the platform. HouseQuay\'s Host Protection Program covers eligible damages. We recommend also maintaining your own property insurance.',
      },
      {
        question: 'Can I decline booking requests?',
        answer: 'Yes, for non-instant bookings you can decline requests. However, maintaining a high acceptance rate helps your listing appear higher in search results. If you need to decline, respond promptly with a brief explanation.',
      },
    ],
  },
  {
    title: 'Payments & Fees',
    items: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and Apple Pay through our secure Stripe payment processing.',
      },
      {
        question: 'What fees does HouseQuay charge?',
        answer: 'Guests pay a 12% service fee on each booking. Hosts receive the full nightly rate minus payment processing fees (approximately 2.9% + $0.30 per transaction).',
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes, all payments are processed through Stripe, a PCI-compliant payment processor. HouseQuay never stores your full credit card details on our servers.',
      },
    ],
  },
  {
    title: 'Account & Support',
    items: [
      {
        question: 'How do I verify my account?',
        answer: 'You can verify your email during signup. Additional verification options like phone verification and ID verification are available in your account settings to build trust with other users.',
      },
      {
        question: 'How do I contact support?',
        answer: 'Visit our Contact page or use the help button in your dashboard. Our support team typically responds within 2-4 hours during business hours.',
      },
      {
        question: 'Can I be both a host and a boater?',
        answer: 'Absolutely! Many of our users both list their own jetties and book stays at other locations. Your account supports both activities seamlessly.',
      },
    ],
  },
];

function FAQAccordion({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[var(--border)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left hover:text-[var(--primary)] transition-colors"
      >
        <span className="font-medium pr-4">{item.question}</span>
        <svg
          className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-5 text-[var(--foreground-muted)] leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Find answers to common questions about booking, hosting, and using HouseQuay.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqData.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-12">
              <h2 className="font-display text-2xl font-bold mb-6 text-[var(--primary)]">{section.title}</h2>
              <div className="bg-white dark:bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="px-6">
                  {section.items.map((item, itemIndex) => (
                    <FAQAccordion key={itemIndex} item={item} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[var(--background-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-[var(--foreground-muted)] mb-8">
            Our support team is ready to help you with anything else you need.
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
