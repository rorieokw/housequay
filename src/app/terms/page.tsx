import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-lg max-w-none text-[var(--foreground)]/80 space-y-6">
          <p className="text-sm text-[var(--foreground)]/60">
            Last updated: December 2025
          </p>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using HouseQuay (&ldquo;the Platform&rdquo;), you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              2. Description of Service
            </h2>
            <p>
              HouseQuay is an online marketplace that connects boat owners (&ldquo;Guests&rdquo;) with property
              owners who have private jetties or moorings available for rent (&ldquo;Hosts&rdquo;). We facilitate
              bookings but are not a party to any rental agreement between Hosts and Guests.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              3. User Accounts
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 18 years old to create an account</li>
              <li>You are responsible for maintaining the security of your account credentials</li>
              <li>You must provide accurate and complete information when registering</li>
              <li>You may not transfer your account to another person</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              4. Host Responsibilities
            </h2>
            <p>As a Host, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate descriptions of your jetty or mooring facilities</li>
              <li>Maintain your property in a safe and clean condition</li>
              <li>Honor confirmed bookings</li>
              <li>Comply with all local laws and regulations regarding short-term rentals</li>
              <li>Have appropriate insurance coverage for your property</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              5. Guest Responsibilities
            </h2>
            <p>As a Guest, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the jetty or mooring only for its intended purpose</li>
              <li>Respect the Host&apos;s property and any house rules</li>
              <li>Operate your vessel safely and in compliance with maritime laws</li>
              <li>Leave the property in the condition you found it</li>
              <li>Have appropriate insurance coverage for your vessel</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              6. Bookings and Payments
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All bookings are subject to Host acceptance (unless Instant Book is enabled)</li>
              <li>Payment is processed securely through our payment provider (Stripe)</li>
              <li>HouseQuay charges a 12% service fee on each booking</li>
              <li>Hosts receive payment after Guest check-in, minus any applicable fees</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              7. Cancellation Policy
            </h2>
            <p>
              Cancellation terms vary by listing. The applicable cancellation policy will be displayed
              before booking confirmation. Generally:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Flexible:</strong> Full refund up to 24 hours before check-in</li>
              <li><strong>Moderate:</strong> Full refund up to 5 days before check-in</li>
              <li><strong>Strict:</strong> 50% refund up to 7 days before check-in</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              8. Limitation of Liability
            </h2>
            <p>
              HouseQuay is a platform that connects Hosts and Guests. We are not responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The condition or safety of any listed property</li>
              <li>Any damage to property or vessels during a booking</li>
              <li>Any disputes between Hosts and Guests</li>
              <li>Acts of nature, weather conditions, or other force majeure events</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              9. Prohibited Activities
            </h2>
            <p>Users may not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create fraudulent listings or bookings</li>
              <li>Use the platform for any illegal activities</li>
              <li>Harass, threaten, or discriminate against other users</li>
              <li>Circumvent payment through the platform</li>
              <li>Violate any intellectual property rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              10. Changes to Terms
            </h2>
            <p>
              We may update these Terms of Service from time to time. We will notify users of any
              material changes via email or through the platform. Continued use of the service after
              changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              11. Contact Us
            </h2>
            <p>
              If you have questions about these Terms of Service, please contact us at{' '}
              <Link href="/contact" className="text-[var(--primary)] hover:underline">
                our contact page
              </Link>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <Link
            href="/"
            className="text-[var(--primary)] hover:underline"
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
