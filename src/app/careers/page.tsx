import Link from 'next/link';

export default function CareersPage() {
  const benefits = [
    { icon: '🏠', title: 'Remote First', description: 'Work from anywhere in Australia' },
    { icon: '🏖️', title: 'Flexible Leave', description: 'Generous PTO and flexible hours' },
    { icon: '📈', title: 'Equity', description: 'Share in our success with stock options' },
    { icon: '🎓', title: 'Learning Budget', description: '$2,000 annual learning stipend' },
    { icon: '🏥', title: 'Health Coverage', description: 'Comprehensive health insurance' },
    { icon: '⚓', title: 'Boating Perks', description: 'Free HouseQuay credits for bookings' },
  ];

  const openings = [
    {
      title: 'Senior Full Stack Engineer',
      department: 'Engineering',
      location: 'Remote (Australia)',
      type: 'Full-time',
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Sydney / Remote',
      type: 'Full-time',
    },
    {
      title: 'Customer Success Manager',
      department: 'Operations',
      location: 'Brisbane / Remote',
      type: 'Full-time',
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Remote (Australia)',
      type: 'Full-time',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">We&apos;re hiring!</span>
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Join Our Crew</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Help us build the future of waterfront access. We&apos;re looking for passionate people
            who love the water as much as we do.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="badge badge-primary mb-4">Benefits</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Why Work With Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[var(--background-secondary)] p-6 rounded-2xl border border-[var(--border)]"
              >
                <div className="text-3xl mb-3">{benefit.icon}</div>
                <h3 className="font-display text-lg font-bold mb-1">{benefit.title}</h3>
                <p className="text-[var(--foreground-muted)] text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-[var(--background-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="badge badge-primary mb-4">Open Positions</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Current Openings</h2>
          </div>
          <div className="space-y-4">
            {openings.map((job, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[var(--background)] p-6 rounded-2xl border border-[var(--border)] hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-bold">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-[var(--foreground-muted)]">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-[var(--primary)] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-colors text-sm"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No Match Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Don&apos;t see a role that fits?
          </h2>
          <p className="text-[var(--foreground-muted)] mb-8 max-w-xl mx-auto">
            We&apos;re always looking for talented people. Send us your resume and tell us how you
            could contribute to HouseQuay.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-[var(--border)] px-8 py-3 rounded-xl font-semibold hover:bg-[var(--muted)] transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
