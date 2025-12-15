'use client';

import { useState } from 'react';
import Link from 'next/link';

const boatSizeOptions = [
  { value: 'small', label: 'Small (up to 20ft)', description: 'Kayaks, jet skis, dinghies' },
  { value: 'medium', label: 'Medium (20-35ft)', description: 'Runabouts, fishing boats' },
  { value: 'large', label: 'Large (35-50ft)', description: 'Cruisers, sailboats' },
  { value: 'xlarge', label: 'Extra Large (50-75ft)', description: 'Motor yachts' },
  { value: 'yacht', label: 'Yacht (75ft+)', description: 'Superyachts' },
];

const amenityOptions = [
  { id: 'power', label: 'Shore Power', icon: '⚡' },
  { id: 'water', label: 'Fresh Water', icon: '💧' },
  { id: 'wifi', label: 'WiFi', icon: '📶' },
  { id: 'security', label: 'Security', icon: '🔒' },
  { id: 'lighting', label: 'Lighting', icon: '💡' },
  { id: 'fuel', label: 'Fuel Station', icon: '⛽' },
  { id: 'parking', label: 'Parking', icon: '🅿️' },
  { id: 'showers', label: 'Showers', icon: '🚿' },
  { id: 'laundry', label: 'Laundry', icon: '🧺' },
  { id: 'storage', label: 'Storage', icon: '📦' },
];

export default function HostPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    city: '',
    maxBoatLength: '',
    boatSize: '',
    depth: '',
    width: '',
    pricePerNight: '',
    minimumStay: '1',
    instantBook: false,
    amenities: [] as string[],
  });

  const updateField = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.title && formData.description;
      case 2:
        return formData.location && formData.city;
      case 3:
        return formData.maxBoatLength && formData.boatSize && formData.depth && formData.width;
      case 4:
        return formData.amenities.length > 0;
      case 5:
        return formData.pricePerNight;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    alert('Your jetty listing has been submitted for review!');
    // In a real app, this would submit to an API
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      {step === 0 && (
        <div className="relative bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Turn Your Jetty into Income
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Join thousands of hosts earning money by renting out their jetties to boat owners. It&apos;s easy to get started.
              </p>
              <button
                onClick={() => setStep(1)}
                className="bg-white text-[var(--primary)] px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Benefits */}
          <h2 className="text-3xl font-bold text-center mb-12">Why host on HouseQuay?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn Extra Income</h3>
              <p className="text-[var(--foreground)]/60">
                Hosts earn an average of $500/month from their jetties. Premium locations can earn much more.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Protected Hosting</h3>
              <p className="text-[var(--foreground)]/60">
                Our Host Protection Insurance covers up to $1M in damages. Host with peace of mind.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">You&apos;re in Control</h3>
              <p className="text-[var(--foreground)]/60">
                Set your own prices, availability, and house rules. Accept or decline bookings as you see fit.
              </p>
            </div>
          </div>

          {/* How it works */}
          <h2 className="text-3xl font-bold text-center mb-12">How hosting works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { step: '1', title: 'Create your listing', desc: 'Share details about your jetty and what makes it special' },
              { step: '2', title: 'Set your terms', desc: 'Choose your price, availability, and booking preferences' },
              { step: '3', title: 'Get bookings', desc: 'Receive requests from boaters looking for a spot' },
              { step: '4', title: 'Earn money', desc: 'Get paid securely through HouseQuay' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="w-10 h-10 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--foreground)]/60">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setStep(1)}
              className="bg-[var(--primary)] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-colors"
            >
              Start Your Listing
            </button>
          </div>
        </div>
      )}

      {/* Multi-step Form */}
      {step > 0 && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-[var(--foreground)]/60 mb-2">
              <span>Step {step} of 6</span>
              <span>{Math.round((step / 6) * 100)}% complete</span>
            </div>
            <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--primary)] transition-all duration-300"
                style={{ width: `${(step / 6) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Tell us about your jetty</h2>
              <p className="text-[var(--foreground)]/60">
                Start with a catchy title and description that will attract boaters.
              </p>

              <div>
                <label className="block text-sm font-medium mb-2">Listing Title</label>
                <input
                  type="text"
                  placeholder="e.g., Private Jetty in Sydney Harbour"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  placeholder="Describe your jetty, its features, and what makes it special..."
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Where is your jetty located?</h2>
              <p className="text-[var(--foreground)]/60">
                Help boaters find your jetty by providing accurate location details.
              </p>

              <div>
                <label className="block text-sm font-medium mb-2">Street Address</label>
                <input
                  type="text"
                  placeholder="e.g., 123 Harbour Street, Point Piper"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City / Region</label>
                <input
                  type="text"
                  placeholder="e.g., Sydney Harbour"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>
          )}

          {/* Step 3: Specifications */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Jetty specifications</h2>
              <p className="text-[var(--foreground)]/60">
                Help boaters know if their vessel will fit at your jetty.
              </p>

              <div>
                <label className="block text-sm font-medium mb-2">Maximum Boat Length (feet)</label>
                <input
                  type="number"
                  placeholder="e.g., 35"
                  value={formData.maxBoatLength}
                  onChange={(e) => updateField('maxBoatLength', e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Boat Size Category</label>
                <div className="space-y-2">
                  {boatSizeOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.boatSize === option.value
                          ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                          : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="boatSize"
                        value={option.value}
                        checked={formData.boatSize === option.value}
                        onChange={(e) => updateField('boatSize', e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-[var(--foreground)]/60">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Water Depth (meters)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g., 3.5"
                    value={formData.depth}
                    onChange={(e) => updateField('depth', e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Berth Width (meters)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g., 4"
                    value={formData.width}
                    onChange={(e) => updateField('width', e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Amenities */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">What amenities do you offer?</h2>
              <p className="text-[var(--foreground)]/60">
                Select all the amenities available at your jetty.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {amenityOptions.map((amenity) => (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`flex items-center gap-3 p-4 border rounded-lg text-left transition-colors ${
                      formData.amenities.includes(amenity.id)
                        ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                        : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                    }`}
                  >
                    <span className="text-2xl">{amenity.icon}</span>
                    <span className="font-medium">{amenity.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Pricing */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Set your price</h2>
              <p className="text-[var(--foreground)]/60">
                You can always change this later. Similar jetties in your area charge $50-$200/night.
              </p>

              <div>
                <label className="block text-sm font-medium mb-2">Price per night (AUD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground)]/60">$</span>
                  <input
                    type="number"
                    placeholder="100"
                    value={formData.pricePerNight}
                    onChange={(e) => updateField('pricePerNight', e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Minimum stay (nights)</label>
                <select
                  value={formData.minimumStay}
                  onChange={(e) => updateField('minimumStay', e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="1">1 night</option>
                  <option value="2">2 nights</option>
                  <option value="3">3 nights</option>
                  <option value="7">1 week</option>
                  <option value="30">1 month</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-lg">
                <div>
                  <div className="font-medium">Instant Book</div>
                  <div className="text-sm text-[var(--foreground)]/60">
                    Let boaters book without waiting for approval
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateField('instantBook', !formData.instantBook)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    formData.instantBook ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      formData.instantBook ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Review your listing</h2>
              <p className="text-[var(--foreground)]/60">
                Make sure everything looks good before publishing.
              </p>

              <div className="bg-[var(--muted)] rounded-xl p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{formData.title || 'Untitled Listing'}</h3>
                  <p className="text-[var(--foreground)]/60">{formData.location}, {formData.city}</p>
                </div>

                <hr className="border-[var(--border)]" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[var(--foreground)]/60">Max Boat Length:</span>
                    <span className="ml-2 font-medium">{formData.maxBoatLength}ft</span>
                  </div>
                  <div>
                    <span className="text-[var(--foreground)]/60">Water Depth:</span>
                    <span className="ml-2 font-medium">{formData.depth}m</span>
                  </div>
                  <div>
                    <span className="text-[var(--foreground)]/60">Berth Width:</span>
                    <span className="ml-2 font-medium">{formData.width}m</span>
                  </div>
                  <div>
                    <span className="text-[var(--foreground)]/60">Price:</span>
                    <span className="ml-2 font-medium">${formData.pricePerNight}/night</span>
                  </div>
                </div>

                <hr className="border-[var(--border)]" />

                <div>
                  <span className="text-sm text-[var(--foreground)]/60">Amenities:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.amenities.map((amenityId) => {
                      const amenity = amenityOptions.find((a) => a.id === amenityId);
                      return amenity ? (
                        <span
                          key={amenityId}
                          className="px-3 py-1 bg-[var(--background)] rounded-full text-sm"
                        >
                          {amenity.icon} {amenity.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                <hr className="border-[var(--border)]" />

                <div className="text-sm">
                  <span className="text-[var(--foreground)]/60">Description:</span>
                  <p className="mt-1">{formData.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border border-[var(--border)] rounded-lg font-medium hover:bg-[var(--muted)] transition-colors"
            >
              Back
            </button>

            {step < 6 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-colors"
              >
                Publish Listing
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
