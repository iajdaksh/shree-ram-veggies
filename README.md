# 🥬 Shree Ram Veggies — Complete Web Platform

**Domain:** shreeramveggies.online | **Stack:** Next.js 14 + Supabase + Vercel

---

## ✨ Features

### Customer Side
- 🏠 **Home Page** — Hero, categories, featured products, delivery info, testimonials
- 🛒 **Product Catalog** — Filter by category, search, sort, add to cart
- 🛍️ **Cart & Checkout** — Home delivery or store pickup, order notes, COD
- 👤 **Auth** — Google OAuth + Email/Password signup
- 📦 **Orders** — Full order history with status tracking
- 📍 **Addresses** — Multiple saved delivery addresses
- 📱 **Notifications** — Email + WhatsApp order updates

### Admin Panel (`/admin`)
- 📊 **Dashboard** — Live stats: orders, revenue, users, today's orders
- 📦 **Orders** — View all orders, update status (Pending → Confirmed → Out for Delivery → Delivered)
- 🏪 **Products** — Add/edit/delete products, toggle availability, set featured
- 👥 **Users** — View all users, grant/revoke admin access
- ⚙️ **Settings** — Store info, delivery zones, charges, notification config

### Pages
- `/` — Home
- `/products` — Product catalog
- `/cart` — Cart & checkout
- `/auth` — Sign in / Sign up
- `/account` — Profile, Orders, Addresses
- `/admin` — Admin panel (protected)
- `/about` — About page, owner profile, farm story, timeline
- `/contact` — Contact form + map
- `/terms` — Terms & Conditions
- `/privacy` — Privacy Policy
- `/refund` — Refund & Return Policy

---

## 🚀 Setup Guide

### Step 1 — Clone & Install
```bash
git clone <repo>
cd annapurna-dairy
npm install
```

### Step 2 — Supabase Setup
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Open SQL Editor and paste the entire content of `supabase-schema.sql`
3. Run it — this creates all tables, RLS policies, and seeds products
4. Go to **Authentication → Providers → Google** and enable Google OAuth
   - Add your Google Client ID & Secret from Google Cloud Console
   - Set redirect URL: `https://shreeramveggies.online/auth/callback`

### Step 3 — Environment Variables
```bash
cp .env.example .env.local
```
Fill in:
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase → Settings → API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from same page
- `SUPABASE_SERVICE_ROLE_KEY` — from same page (keep secret!)
- `RESEND_API_KEY` — from [resend.com](https://resend.com) (for email notifications)
- `ADMIN_EMAIL` — your email to receive order alerts
- `WHATSAPP_ACCESS_TOKEN` — from Meta for Developers (optional)

### Step 4 — Make Yourself Admin
After signing up with your account, run in Supabase SQL Editor:
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your@email.com';
```

### Step 5 — Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```
Or connect your GitHub repo on [vercel.com](https://vercel.com) and add environment variables in project settings.

**Custom Domain:**
1. In Vercel → Domains → Add `shreeramveggies.online`
2. Update your domain's DNS to point to Vercel

---

## 📱 WhatsApp Notifications Setup

1. Create a Meta Developer account at [developers.facebook.com](https://developers.facebook.com)
2. Create a WhatsApp Business App
3. Add your `WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` to `.env.local`
4. Customers who add their WhatsApp number in account settings will receive order updates

---

## 📧 Email Notifications Setup (Resend)

1. Sign up at [resend.com](https://resend.com)
2. Add and verify your domain `shreeramveggies.online`
3. Create an API key
4. Add `RESEND_API_KEY` to environment variables
5. Add `ADMIN_EMAIL` to receive new order notifications

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home
│   ├── products/page.tsx     # Product catalog
│   ├── cart/page.tsx         # Cart & checkout
│   ├── auth/page.tsx         # Sign in/up
│   ├── account/              # User account pages
│   ├── admin/                # Admin panel
│   ├── about/page.tsx        # About page
│   ├── contact/page.tsx      # Contact
│   ├── terms/page.tsx        # Terms
│   ├── privacy/page.tsx      # Privacy policy
│   ├── refund/page.tsx       # Refund policy
│   └── api/notify-order/     # Order notification API
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── Providers.tsx
├── context/
│   └── AuthContext.tsx       # Auth state management
└── lib/
    ├── supabase.ts           # Supabase client
    └── cartStore.ts          # Zustand cart store
```

---

## 🎨 Theme

- **Dark mode default** with full light mode support
- **Glass morphism** — frosted glass cards with backdrop blur
- **Color palette:** Deep amber gold (#F5C842) on dark (#0D0800) or cream (#FFF8E7)
- **Animated** — Framer Motion page transitions, floating elements, smooth hover states

---

Built with ❤️ for Shree Ram Veggies, Muzaffarnagar
