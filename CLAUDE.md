# HouseQuay Development Roadmap

## Current Status
**Phase:** 2 - Transactions (COMPLETE)
**Step:** Phase 3 - Trust & Safety (NEXT)
**Overall Progress:** ~75% to MVP
**Last Updated:** 2025-12-16

---

## WHAT'S WORKING NOW
- User authentication (signup, login, logout)
- Creating jetty listings via host wizard (7 steps)
- Image upload to Cloudinary with drag-and-drop
- Viewing listings (database + demo data fallback)
- User dashboard with session info
- Host dashboard to manage listings
- Protected routes and user roles
- **Booking system** - Request to book / Instant book
- **Booking modal** with boat details and price breakdown
- **Bookings list page** with upcoming/past tabs
- **Booking detail page** with approve/decline/cancel actions
- **Availability calendar** with booked/blocked dates display
- **Messaging system** - Conversations and messages

## NEXT STEPS
- Implement Stripe payments (2.2)
- Build remaining messaging features (2.3)
- Connect browse page to show database listings alongside demo data

---

## Progress Tracker

### Phase 1: Foundation (CURRENT)
- [x] **1.1 Authentication System** (COMPLETE)
  - [x] Install NextAuth.js
  - [x] Create login/signup pages (`/login`, `/signup`)
  - [x] Add protected routes (`/dashboard`)
  - [x] User profiles (boater vs host roles)
  - [x] Wire up "Sign In" and "Get Started" buttons
  - [x] User dropdown menu with sign out
  - [x] Database connected and working

- [x] **1.2 Database & API** (COMPLETE)
  - [x] Install and configure Prisma ORM
  - [x] Create database schema (Users, Listings, Bookings, Reviews, Messages)
  - [x] Auth API routes (`/api/auth/[...nextauth]`, `/api/auth/register`)
  - [x] Set up PostgreSQL database (Supabase)
  - [x] Run migrations
  - [x] Listings API (`/api/listings`, `/api/listings/[id]`)

- [x] **1.3 Host Listing Creation** (COMPLETE)
  - [x] Save listings from host wizard to database
  - [x] Jetty detail page fetches from database
  - [x] Image upload (Cloudinary) with drag-and-drop
  - [x] Listing management dashboard for hosts

### Phase 2: Transactions (CURRENT)
- [x] **2.1 Booking System** (COMPLETE)
  - [x] Booking API endpoints (create, get, update)
  - [x] Booking request UI in jetty detail page
  - [x] Booking modal with boat details
  - [x] Instant book vs request-to-book logic
  - [x] Bookings list page (upcoming/past)
  - [x] Booking detail page with actions
  - [x] Approve/decline for hosts
  - [x] Cancel booking functionality
  - [x] Real calendar with availability display

- [x] **2.2 Payment Processing** (COMPLETE - MVP)
  - [x] Stripe integration (checkout sessions)
  - [x] Checkout API (`/api/checkout`)
  - [x] Webhook for payment events (`/api/webhook/stripe`)
  - [x] Pay Now button on booking detail page
  - [x] Service fee collection (12%)
  - [ ] Hold funds until check-in (post-MVP)
  - [ ] Host payouts via Stripe Connect (post-MVP)

- [x] **2.3 Messaging** (COMPLETE)
  - [x] Conversations list (`/messages`)
  - [x] Real-time chat UI (`/messages/[id]`)
  - [x] Contact Host button on listing pages
  - [x] Conversation API with listing context
  - [x] Message send/receive functionality

### Phase 3: Trust & Safety
- [ ] **3.1 Reviews & Ratings**
  - [ ] Post-stay reviews
  - [ ] Host responses
  - [ ] Rating display on listings

- [ ] **3.2 Verification**
  - [ ] Email/phone verification
  - [ ] ID verification (optional)
  - [ ] Host verification badges

- [ ] **3.3 Policies & Insurance**
  - [ ] Cancellation policies
  - [ ] Insurance integration info
  - [ ] Terms of service pages

### Phase 4: Growth Features
- [ ] **4.1 Notifications**
  - [ ] Email notifications (SendGrid/Resend)
  - [ ] Optional SMS alerts

- [ ] **4.2 Wishlist/Favorites**
  - [ ] Save listings
  - [ ] Share lists

- [ ] **4.3 Enhanced Search**
  - [ ] Date-aware availability search
  - [ ] Recently viewed listings
  - [ ] Search suggestions

### Phase 5: Scale
- [ ] **5.1 Mobile App** (React Native)
- [ ] **5.2 Analytics Dashboard** (for hosts)
- [ ] **5.3 Admin Tools** (moderation, support)
- [ ] **5.4 API for Marina Partnerships**

---

## Tech Stack Decisions

| Layer | Technology | Status |
|-------|------------|--------|
| Frontend | Next.js 14 + React 18 | ✅ Done |
| Styling | Tailwind CSS | ✅ Done |
| Maps | Leaflet + OpenStreetMap | ✅ Done |
| Auth | NextAuth.js | ✅ Done |
| Database | PostgreSQL (Supabase) | ✅ Done |
| ORM | Prisma | ✅ Done |
| Image Storage | Cloudinary | ✅ Done |
| Payments | Stripe | Pending |
| Email | Resend | Pending |
| Hosting | Vercel | Pending |

---

## Files Created/Modified

### Authentication
- `src/lib/auth.ts` - NextAuth configuration
- `src/lib/db.ts` - Prisma client singleton
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API route
- `src/app/api/auth/register/route.ts` - User registration API
- `src/app/login/page.tsx` - Login page
- `src/app/signup/page.tsx` - Signup page
- `src/app/dashboard/page.tsx` - Protected user dashboard with host listings
- `src/components/Providers.tsx` - Session provider wrapper
- `src/types/next-auth.d.ts` - TypeScript types for NextAuth

### Database
- `prisma/schema.prisma` - Full database schema (includes ListingImage with publicId)
- `.env` - Environment variables

### Listings & Images
- `src/app/api/listings/route.ts` - GET/POST listings API
- `src/app/api/listings/[id]/route.ts` - Single listing API
- `src/app/api/listings/my/route.ts` - Current user's listings API
- `src/app/api/upload/route.ts` - Cloudinary image upload API
- `src/components/ImageUpload.tsx` - Drag-and-drop image upload component

### Bookings
- `src/app/api/bookings/route.ts` - GET/POST bookings API
- `src/app/api/bookings/[id]/route.ts` - Single booking (GET, PATCH for actions)
- `src/app/bookings/page.tsx` - Bookings list with upcoming/past tabs
- `src/app/bookings/[id]/page.tsx` - Booking detail with approve/decline/cancel

### Updated
- `src/app/layout.tsx` - Added Providers wrapper
- `src/components/Header.tsx` - Auth-aware with user menu
- `src/app/host/page.tsx` - 7-step wizard with image upload
- `src/app/jetty/[id]/page.tsx` - Booking modal, auth check, date validation

---

## Quick Commands

```bash
# Development
# IMPORTANT: Always kill old servers before starting new ones to avoid port conflicts
# Check for running servers:
netstat -ano | findstr :3000
# Kill by PID:
taskkill //F //PID <pid>

npm run dev

# Build
npm run build

# Database
npx prisma migrate dev --name init  # Create tables
npx prisma generate                  # Generate Prisma client
npx prisma studio                    # View/edit data in browser
npx prisma db push                   # Push schema changes (dev only)

# Auth secret generation
npx auth secret
```

---

## Database Schema Overview

```
User
├── Account (OAuth providers)
├── Session
├── Listing[] (as host)
├── Booking[] (as guest)
├── Review[] (given/received)
├── Message[] (sent/received)
├── Favorite[]
└── Conversation[]

Listing
├── ListingImage[]
├── Booking[]
├── Review[]
├── Availability[]
└── Favorite[]

Booking
├── User (guest)
├── Listing
└── Review
```

---

## Notes
- All UI/UX is complete and Airbnb-quality
- Frontend components are built and responsive
- Database-first approach with static data fallback for demo listings
- 10 sample listings in src/data/jetties.ts (Sydney, Gold Coast, Brisbane, Whitsundays, Cairns)
- Auth system fully functional with Supabase PostgreSQL
- Image uploads stored on Cloudinary with publicId for future deletion
- Host wizard has 7 steps: Basic Info, Location, Specs, Amenities, Photos, Pricing, Review
- Dashboard shows "My Listings" for hosts, "Become a Host" CTA for boaters
