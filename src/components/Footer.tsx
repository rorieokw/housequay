'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[var(--muted)] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15l4-8 4 8M7 11h4M17 9v6M21 9l-4 3 4 3" />
                </svg>
              </div>
              <span className="text-xl font-bold">HouseQuay</span>
            </Link>
            <p className="text-sm text-[var(--foreground)]/60">
              The marketplace for boat owners to find the perfect jetty, and jetty owners to earn from their waterfront.
            </p>
          </div>

          {/* For Boaters */}
          <div>
            <h3 className="font-semibold mb-4">For Boaters</h3>
            <ul className="space-y-2 text-sm text-[var(--foreground)]/60">
              <li><Link href="/browse" className="hover:text-[var(--foreground)]">Browse Jetties</Link></li>
              <li><Link href="/how-it-works" className="hover:text-[var(--foreground)]">How It Works</Link></li>
              <li><Link href="/safety" className="hover:text-[var(--foreground)]">Safety Tips</Link></li>
              <li><Link href="/faq" className="hover:text-[var(--foreground)]">FAQ</Link></li>
            </ul>
          </div>

          {/* For Hosts */}
          <div>
            <h3 className="font-semibold mb-4">For Hosts</h3>
            <ul className="space-y-2 text-sm text-[var(--foreground)]/60">
              <li><Link href="/host" className="hover:text-[var(--foreground)]">List Your Jetty</Link></li>
              <li><Link href="/host/resources" className="hover:text-[var(--foreground)]">Host Resources</Link></li>
              <li><Link href="/host/insurance" className="hover:text-[var(--foreground)]">Insurance</Link></li>
              <li><Link href="/host/guidelines" className="hover:text-[var(--foreground)]">Community Guidelines</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-[var(--foreground)]/60">
              <li><Link href="/about" className="hover:text-[var(--foreground)]">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-[var(--foreground)]">Careers</Link></li>
              <li><Link href="/press" className="hover:text-[var(--foreground)]">Press</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--foreground)]">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--foreground)]/60">
            &copy; {currentYear} HouseQuay. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-[var(--foreground)]/60">
            <Link href="/privacy" className="hover:text-[var(--foreground)]">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[var(--foreground)]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
