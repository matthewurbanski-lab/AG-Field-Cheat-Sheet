# mattataquaguard.com — AquaGuard Foundation Solutions

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/matthewurbanski-lab/AG-Field-Cheat-Sheet&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_KEY,RESEND_API_KEY&envDescription=See%20.env.example%20for%20descriptions&project-name=aquaguard-booking&repository-name=aquaguard-booking)

**CFI Matthew Urbanski's Personal Inspection Booking Website**

This site lets homeowners book free home inspections directly with you. It includes a booking form, lead management dashboard, availability calendar, and automatic email notifications.

---

## Quick Start for Matt

### Logging into the Admin Dashboard

1. Go to **mattataquaguard.com/admin**
2. Enter your email and password (set up in Supabase Auth)
3. You'll see your dashboard with new leads, hot leads, and upcoming appointments

### Managing Leads

1. From the dashboard, click **Leads** in the sidebar
2. You'll see all leads sorted by newest first
3. Each lead shows a colored score badge:
   - 🔴 **HOT** (70-100) — High urgency, take action fast
   - 🟡 **WARM** (40-69) — Moderate urgency
   - 🟢 **COOL** (0-39) — Low urgency / just browsing
4. Click any lead to see full details, photos, and answers
5. Update the status as you work through the lead: New → Contacted → Appointment Set → Inspected → Proposal Sent → Sold or Lost
6. Add private notes to any lead — they auto-save

### Managing Your Availability

1. Click **Calendar** in the sidebar
2. To add available slots: Pick a date, set start/end times, click Add
3. Use the **"Generate Week"** preset to quickly add Mon-Fri, 9am-5pm slots
4. To block a day off: Click the block button next to any date
5. Customers can only book slots you've made available

### Updating Your Settings

1. Click **Settings** in the sidebar
2. Update your phone number, email, or name
3. Paste your **Google Business Profile review link** so the "Leave a Review" button works
4. Add ZIP codes for your service area
5. Toggle which service types show in the booking form
6. Click **Save** when done

### Swapping Photos

Replace any image in the `/public/images/` folder with a new file using the **same filename**. The site will automatically use the new image.

Current image files:
- `matt-headshot.jpg` — Your professional headshot
- `matt-linkedin-banner.png` — LinkedIn banner image
- `matt-credential-card.png` — CFI credential card
- `basement-before-after.jpg` — Basement waterproofing before/after
- `foundation-repair.jpg` — Foundation pier installation
- `crawl-space-before-after.jpg` — Crawl space encapsulation
- `concrete-lifting.jpg` — Concrete lifting before/after
- `sloping-floors.jpg` — Floor leveling before/after
- `sump-pump-install.jpg` — Sump pump installation
- `services-collage.jpg` — 3-panel services overview

---

## Developer Setup

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)
- A Resend account (for transactional email)
- Optional: Google Places API key (for address autocomplete)

### Local Development

```bash
# 1. Clone the repo
git clone https://github.com/matthewurbanski-lab/ag-field-cheat-sheet.git
cd ag-field-cheat-sheet

# 2. Install dependencies
npm install

# 3. Copy environment file and fill in your keys
cp .env.example .env.local

# 4. Set up database — run these SQL files in Supabase SQL Editor:
#    - supabase/migration.sql  (creates tables)
#    - supabase/seed.sql       (adds demo data — optional)

# 5. Create a storage bucket in Supabase called "lead-photos" (set to public)

# 6. Create an admin user in Supabase Auth (email + password)

# 7. Start the dev server
npm run dev
```

The site runs at `http://localhost:3000`.

### Environment Variables

Set these in your `.env.local` file (local) or Vercel dashboard (production):

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (server-side only) |
| `RESEND_API_KEY` | Resend API key for sending emails |
| `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` | Google Places API key (optional) |

### Deployment to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the GitHub repo
3. Add all environment variables in Vercel project settings
4. Deploy — Vercel auto-builds on every push

### Connecting the Domain (mattataquaguard.com)

In your Wix domain manager:
1. Add a **CNAME record**: `www` → `cname.vercel-dns.com`
2. Or add an **A record**: `@` → `76.76.21.21`
3. In Vercel, go to Project Settings → Domains → Add `mattataquaguard.com`
4. Vercel will auto-provision an SSL certificate

### Database Schema

See `supabase/migration.sql` for the complete schema. Four tables:
- **leads** — Customer booking submissions with scoring
- **photos** — Uploaded inspection photos linked to leads
- **time_slots** — Matt's availability calendar
- **settings** — Key-value configuration store

---

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** for styling
- **Supabase** (Postgres DB + Auth + Storage)
- **Resend** for transactional email
- **Framer Motion** for animations
- **Lucide React** for icons
- **Vercel** for hosting

---

© 2025 Matthew Urbanski — AquaGuard Foundation Solutions, A Groundworks Company
