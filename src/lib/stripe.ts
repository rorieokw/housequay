import Stripe from 'stripe'

// Lazy initialization to avoid build-time errors when env var is not set
let stripeInstance: Stripe | null = null

export const getStripe = (): Stripe => {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-11-17.clover',
      typescript: true,
    })
  }
  return stripeInstance
}

// Calculate service fee (12%)
export const calculateServiceFee = (subtotal: number): number => {
  return Math.round(subtotal * 0.12)
}

// Format amount for Stripe (cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100)
}
