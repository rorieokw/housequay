import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none text-[var(--foreground)]/80 space-y-6">
          <p className="text-sm text-[var(--foreground)]/60">
            Last updated: December 2025
          </p>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              1. Introduction
            </h2>
            <p>
              HouseQuay (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              2. Information We Collect
            </h2>
            <h3 className="text-lg font-medium text-[var(--foreground)] mt-4 mb-2">
              Personal Information
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name and email address</li>
              <li>Phone number (optional)</li>
              <li>Profile photo (optional)</li>
              <li>Payment information (processed securely by Stripe)</li>
              <li>Boat information (for guests)</li>
              <li>Property details (for hosts)</li>
            </ul>

            <h3 className="text-lg font-medium text-[var(--foreground)] mt-4 mb-2">
              Usage Information
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Browser type and device information</li>
              <li>IP address and location data</li>
              <li>Pages visited and features used</li>
              <li>Search queries and booking history</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              3. How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our services</li>
              <li>Process bookings and payments</li>
              <li>Facilitate communication between Hosts and Guests</li>
              <li>Send important updates about your account or bookings</li>
              <li>Improve our platform and develop new features</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              4. Information Sharing
            </h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Other Users:</strong> Hosts and Guests can see relevant profile information for bookings</li>
              <li><strong>Service Providers:</strong> Third parties who help us operate (Stripe, Cloudinary, etc.)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
            <p className="mt-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              5. Data Security
            </h2>
            <p>
              We implement appropriate security measures to protect your information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption of data in transit (HTTPS)</li>
              <li>Secure password hashing</li>
              <li>Regular security audits</li>
              <li>Access controls for sensitive data</li>
            </ul>
            <p className="mt-4">
              However, no method of transmission over the internet is 100% secure. We cannot guarantee
              absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              6. Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us through our{' '}
              <Link href="/contact" className="text-[var(--primary)] hover:underline">
                contact page
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              7. Cookies and Tracking
            </h2>
            <p>
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Analyze site usage</li>
              <li>Improve our services</li>
            </ul>
            <p className="mt-4">
              You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              8. Data Retention
            </h2>
            <p>
              We retain your information for as long as your account is active or as needed to provide
              services. We may retain certain information for legal or business purposes, such as:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Transaction records (7 years for tax purposes)</li>
              <li>Communication records (as required by law)</li>
              <li>Anonymized analytics data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              9. Children&apos;s Privacy
            </h2>
            <p>
              HouseQuay is not intended for users under 18 years of age. We do not knowingly collect
              personal information from children. If you believe we have collected information from a
              child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              10. International Data Transfers
            </h2>
            <p>
              Your information may be transferred to and processed in countries outside Australia.
              We ensure appropriate safeguards are in place to protect your information in accordance
              with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              11. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material
              changes by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-4">
              12. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy or our data practices, please contact us at{' '}
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
