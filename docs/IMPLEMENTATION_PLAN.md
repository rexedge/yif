# YIF Website — Implementation Plan

> **Autopilot guide.** Work through phases in order. Each step lists the exact files to create/edit, skills to load, and acceptance criteria. Never skip a phase — later phases depend on earlier ones.

---

## How to use this plan

1. Read [AGENTS.md](../AGENTS.md) before starting any work.
2. Read [docs/YIF Website Content Inventory.md](YIF%20Website%20Content%20Inventory.md) — use real org data, never placeholder text.
3. Load the skills listed in each step **before** writing code.
4. Mark steps `[x]` as you complete them.
5. Run `pnpm build` after each phase to catch regressions early.

---

## Phase 1 — Foundation (do this first, everything depends on it)

### 1.1 Brand tokens & typography

**Skills:** `frontend-design`  
**Files to edit:**

- `app/globals.css` — replace placeholder tokens with YIF brand system

```css
/* Add to :root */
--color-yif-navy: #1a2744;
--color-yif-gold: #c9913d;
--color-yif-amber: #e8a93e;
--color-yif-terracotta: #c0553a;
--color-yif-green: #2d6a4f;
--color-yif-cream: #f5f0e8;
--color-yif-charcoal: #2c2c2c;
```

- `app/layout.tsx` — replace Geist with brand fonts via `next/font/google`
  - Display: **Cormorant Garamond** (weight 400, 600, 700)
  - Body: **DM Sans** (weight 400, 500, 600)
  - Update `<html lang="en">` to include proper `lang` for accessibility

**Acceptance:** `pnpm dev` shows custom fonts; CSS variables resolve in browser DevTools.

---

### 1.2 Shared layout components

**Skills:** `frontend-design`, `nextjs`  
**Files to create:**

- `components/layout/Navbar.tsx` — responsive nav with YIF logo, links, "Donate" CTA button
  - Links: Home, About, Programs, Events, Blog, Contact, Member Login
  - Mobile: hamburger drawer
  - Trust bar above nav: "UN/ECOSOC Special Consultative Status · Reg. IT 28744"
- `components/layout/Footer.tsx` — address (33A Bode Thomas St, Surulere, Lagos), phone, emails, social links, copyright
- `components/layout/TrustBadge.tsx` — reusable UN/ECOSOC badge chip

**Files to edit:**

- `app/layout.tsx` — import and render `<Navbar>` and `<Footer>` wrapping `{children}`

**Acceptance:** Navbar and footer appear on every page. Trust bar visible.

---

### 1.3 Route group scaffolding

**Skills:** `nextjs`  
**Files to create (empty `page.tsx` stubs with `// TODO` are fine):**

```
app/(public)/about/page.tsx
app/(public)/programs/page.tsx
app/(public)/events/page.tsx
app/(public)/events/[slug]/page.tsx
app/(public)/donate/page.tsx
app/(public)/scholarship/page.tsx
app/(public)/blog/page.tsx
app/(public)/blog/[slug]/page.tsx
app/(public)/contact/page.tsx
app/(auth)/dashboard/page.tsx
app/(auth)/dashboard/tickets/page.tsx
app/(auth)/dashboard/donations/page.tsx
app/(auth)/dashboard/membership/page.tsx
app/(auth)/dashboard/scholarship/page.tsx
app/(auth)/layout.tsx
app/(public)/layout.tsx
```

**Note:** Each parallel-route slot needs a `default.tsx` if used. Every `[slug]` page must `await params`.

**Acceptance:** `pnpm build` compiles without errors. All routes return 200 in dev.

---

## Phase 2 — Homepage

**Skills:** `frontend-design`, `nextjs`  
**File:** `app/page.tsx` (replaces the current Next.js starter)

### Sections to build (in order, top to bottom):

| Section              | Key details                                                                                                                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hero**             | Full-viewport. Headline: "Uniting the global Yoruba in diaspora". Subtext from mission statement in content inventory §1.1. CTAs: "Become a Member", "Donate Now", "Explore Events". Cultural pattern texture overlay. |
| **Stats bar**        | Animated counters on scroll. Stats: 15+ Countries, 19 years active (founded 2005), UN/ECOSOC 2019, scholarships awarded.                                                                                               |
| **Programs grid**    | 4 cards: Karo-Ojire Investments, Scholarship 2024–25, Events & Awards, Youth Development. Each links to its page.                                                                                                      |
| **About teaser**     | 2-col layout: mission text (from §1.1 content inventory) + founding history blurb. CTA "Our Story".                                                                                                                    |
| **Leadership strip** | Horizontal scroll of top 6 leaders from content inventory §2.1 with name + title.                                                                                                                                      |
| **Testimonials**     | 3-card carousel. Use placeholder structure; real testimonials from content inventory if present.                                                                                                                       |
| **Blog preview**     | 3 latest blog card previews (static data from §7.2 content inventory for now).                                                                                                                                         |
| **Newsletter CTA**   | Email capture form. Server Action for submission.                                                                                                                                                                      |
| **Donate CTA band**  | Full-width gold band. "Fund a Scholarship. Empower a Community." + donation button.                                                                                                                                    |

**Acceptance:** All sections render. Stat counters animate. No placeholder/lorem text. Mobile responsive.

---

## Phase 3 — About Us Page

**Skills:** `frontend-design`  
**File:** `app/(public)/about/page.tsx`

### Sections:

| Section                      | Source                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Page hero**                | Title "About YIF". Brief tagline from mission.                                                                     |
| **Mission & Vision**         | Full text from content inventory §1.1                                                                              |
| **Founding story timeline**  | Founded 2005/06, UN/ECOSOC 2019 milestone, key events                                                              |
| **Organizational values**    | Unity · Empowerment · Transparency · Cultural Pride                                                                |
| **National leadership grid** | Full table from content inventory §2.1. Cards with name, role.                                                     |
| **Advisory & patrons**       | Content inventory §2.2                                                                                             |
| **UK Executive team**        | Content inventory §2.3                                                                                             |
| **Diaspora map**             | Content inventory §2.4 — world map (static SVG or simple CSS grid of countries) with representative names/contacts |
| **Affiliated orgs**          | Content inventory §4.1 — list of 21 affiliate orgs                                                                 |
| **UN/ECOSOC certification**  | Prominent badge + "Granted 2019"                                                                                   |
| **Governance CTA**           | Link to downloadable documents (placeholder PDF link for now)                                                      |

**Acceptance:** All real names/titles from content inventory used verbatim. No invented leadership data.

---

## Phase 4 — Programs & Initiatives Page

**Skills:** `frontend-design`  
**File:** `app/(public)/programs/page.tsx`

### Sections:

| Program               | Key content (from content inventory §3)                                                                                                         |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Karo-Ojire**        | Description, philosophy quote, membership tiers (Gold N10k, Silver N5k, Platinum N20k, Diamond N15k), sources of finance. CTA "Join Karo-Ojire" |
| **Scholarship**       | 2024–25 batch info, eligibility (Yoruba heritage, academic merit, N5,000 reg fee), amounts. CTA "Apply for Scholarship" → `/scholarship`        |
| **Events & Awards**   | Annual ceremony, Order of Odua recognition, upcoming events teaser. CTA "View Events" → `/events`                                               |
| **Youth Development** | Coordinator: Ogundare Adenike. Director IT & Youth: Mr. Oluwatosin Famori. Program goals. CTA "Join Youth Program"                              |

**Acceptance:** All four programs have CTAs. Membership tier prices match content inventory exactly.

---

## Phase 5 — Contact Page

**Skills:** `frontend-design`  
**File:** `app/(public)/contact/page.tsx`

### Sections:

- Address: 33A Bode Thomas Street, Surulere, Lagos State, Nigeria
- Phones: +234 816 919 9745, +1 (917) 703-0107, +234 802 288 9403
- Emails: info@yifworldwide.org, yorubaindigenesngo@gmail.com
- Google Maps embed (static iframe for the Lagos address)
- Contact form: name, email, phone, subject (select: Inquiry / Donation / Membership / Scholarship / Event / Other), message, CAPTCHA placeholder
- WhatsApp CTA button (prominent)
- Diaspora representatives directory from content inventory §2.4
- Regional office: UK contact from §2.3

**Server Action:** `app/(public)/contact/actions.ts` — handle form submission, Zod validation, return success/error state. Email send via env-configured SMTP (no key hardcoded).

**Acceptance:** Form validates client + server side. Zod schema covers all fields. No secrets in client bundle.

---

## Phase 6 — Blog Pages

**Skills:** `frontend-design`, `nextjs`

### 6.1 Blog listing

**File:** `app/(public)/blog/page.tsx`

- Card grid (3-col desktop, 1-col mobile)
- Categories filter: Culture, Politics, Diaspora, Youth Development, Events
- Seed with 4 real posts from content inventory §7.2
- Static data in `lib/blog-data.ts` for now (CMS integration later)

### 6.2 Blog post detail

**File:** `app/(public)/blog/[slug]/page.tsx`

- Must `await params` (Next.js 16 rule)
- Full article, author, date, estimated read time
- Related posts (2 cards)
- Social share: WhatsApp, LinkedIn, Facebook, Twitter/X
- Newsletter signup CTA

**Acceptance:** `[slug]` page works. `params` awaited. `generateStaticParams` exported.

---

## Phase 7 — Paystack Setup (prerequisite for Donations + Events)

**Skills:** `paystack-setup`, `paystack-transactions`, `paystack-webhooks`  
**Files to create:**

- `.env.local.example` — document required env vars (never commit real keys)
  ```
  PAYSTACK_SECRET_KEY=sk_live_...
  PAYSTACK_PUBLIC_KEY=pk_live_...
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
  ```
- `lib/paystack/client.ts` — server-side fetch wrapper for Paystack API base URL
- `lib/paystack/types.ts` — TypeScript types for transaction, webhook event
- `app/api/webhooks/paystack/route.ts` — webhook handler with HMAC SHA512 signature verification

**Rules:**

- `PAYSTACK_SECRET_KEY` only used server-side (no `NEXT_PUBLIC_` prefix)
- All Paystack API calls in Server Actions or Route Handlers only
- Webhook verifies `x-paystack-signature` before processing any event

**Acceptance:** Webhook endpoint returns 400 for invalid signatures, 200 for valid. `pnpm build` passes with no secret exposure warnings.

---

## Phase 8 — Donations Page

**Skills:** `frontend-design`, `paystack-transactions`  
**File:** `app/(public)/donate/page.tsx`

### Sections:

- Preset amounts: ₦5,000 / ₦10,000 / ₦25,000 / ₦50,000 + custom amount input
- Program selector: General Fund / Scholarship Fund / Youth Development / Economic Empowerment
- One-time vs recurring toggle (recurring = subscription plan)
- Donor recognition opt-in (public wall vs anonymous)
- Impact calculator: "₦5,000 funds 2 hours of youth mentoring"
- Payment flow via Paystack Popup (public key from `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`)

**Server Action:** `app/(public)/donate/actions.ts`

- Zod validate amount + program + donor details
- Initialize Paystack transaction, return `authorization_url`
- After redirect back: verify transaction server-side before showing success

**Acceptance:** Transaction initializes. Verification runs server-side. No secret key in client bundle. Zod rejects invalid amounts.

---

## Phase 9 — Events & Ticketing

**Skills:** `frontend-design`, `paystack-transactions`

### 9.1 Events listing

**File:** `app/(public)/events/page.tsx`

- Calendar/card hybrid layout
- Filter by type: Awards, Conferences, Workshops, Fundraisers, Cultural
- Static seed data in `lib/events-data.ts`

### 9.2 Event detail + ticket purchase

**File:** `app/(public)/events/[slug]/page.tsx`

- Full event info, agenda, venue map embed
- Ticket tiers: General / VIP / Student / Sponsor
- Quantity selector, promo code field
- "Buy Tickets" → Paystack transaction initialize (Server Action)
- Post-payment: QR code generation for digital ticket (`lib/tickets/generate-qr.ts`)

**Server Action:** `app/(public)/events/[slug]/actions.ts`

- Zod validate ticket selection + attendee details
- Initialize Paystack transaction
- On webhook `charge.success`: generate QR, send email receipt

**Acceptance:** End-to-end ticket purchase flow works in Paystack test mode. QR code generated after successful payment. Email receipt triggered.

---

## Phase 10 — Scholarship Application Portal

**Skills:** `nextjs`  
**Files:**

- `app/(public)/scholarship/page.tsx` — overview + CTA to apply
- `app/(public)/scholarship/apply/page.tsx` — multi-step form (5 steps, progress bar)

**Form steps:**

1. Personal info: name, email, phone, DOB, Yoruba heritage attestation
2. Academic history: institution, GPA, year of study
3. Financial information: household income, financial need statement
4. Essays: 2 short answer fields (max 500 words each)
5. Documents: file upload for transcripts + recommendation letter (max 5MB each, PDF/DOCX only)
6. Review & submit

**Server Action:** `app/(public)/scholarship/actions.ts`

- Zod validates every step server-side
- Persist application to DB (use `lib/db.ts` as a stub; wire real DB in a later phase)
- Return application reference number on success

**Acceptance:** Multi-step form navigates forward/back. All fields validated server-side. File upload validates type and size before server processing. Auto-save between steps via `sessionStorage`.

---

## Phase 11 — Auth & Member Portal

**Skills:** `better-auth-best-practices`, `nextjs`  
**Files:**

- `lib/auth.ts` — Better Auth configuration (email/password, email verification, MFA optional)
- `app/(auth)/layout.tsx` — protect all `/dashboard/*` routes; redirect unauthenticated users to login
- `app/(public)/login/page.tsx` — login form
- `app/(public)/register/page.tsx` — registration form (name, email, password, membership tier)
- `app/(auth)/dashboard/page.tsx` — member overview: name, membership tier, expiry, quick actions
- `app/(auth)/dashboard/tickets/page.tsx` — list of purchased event tickets with QR codes
- `app/(auth)/dashboard/donations/page.tsx` — donation history, recurring donation management
- `app/(auth)/dashboard/membership/page.tsx` — tier info, renewal, upgrade CTA
- `app/(auth)/dashboard/scholarship/page.tsx` — application status tracker

**Rules:**

- `cookies()` and `headers()` must be awaited (Next.js 16)
- Session stored server-side; never expose session token to client JS
- Email verification required before dashboard access

**Acceptance:** Unauth user redirected from `/dashboard`. Login/register flows complete. Dashboard shows real session data.

---

## Phase 12 — Database Setup

**Skills:** `prisma-database-setup`, `prisma-client-api`  
**Files:**

- `prisma/schema.prisma` — models: `User`, `Member`, `Event`, `Ticket`, `Donation`, `ScholarshipApplication`, `BlogPost`
- `lib/db.ts` — Prisma client singleton (safe for Next.js dev hot-reload)
- `prisma/seed.ts` — seed blog posts from content inventory §7.2, seed 1 test event

**Key model relationships:**

```
User → Member (1:1)
Member → Ticket[] (1:N)
Member → Donation[] (1:N)
Member → ScholarshipApplication[] (1:N)
Event → Ticket[] (1:N)
```

**Acceptance:** `pnpm prisma migrate dev` runs without errors. Seed populates blog posts and a test event. Prisma Client generates types correctly.

---

## Phase 13 — SEO & Metadata

**Skills:** `nextjs`  
**Files to edit:**

- `app/layout.tsx` — root `metadata` object: title template `%s | YIF`, description, OG image, robots
- Every `page.tsx` — export page-level `metadata` with real titles and descriptions from content inventory
- `app/sitemap.ts` — generate sitemap including all public routes + blog slugs
- `app/robots.ts` — allow all, point to sitemap

**Acceptance:** `<title>` tags are page-specific. OG meta tags present. Sitemap accessible at `/sitemap.xml`.

---

## Phase 14 — Performance & Security Hardening

**Files to edit:**

- `next.config.ts` — add security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- `next.config.ts` — configure `images.domains` for any external image hosts
- All Server Actions — confirm Zod validation on every mutation
- `app/api/webhooks/paystack/route.ts` — IP allowlist check (Paystack webhook IPs)

**Run:**

```bash
pnpm build       # must produce zero type errors
pnpm lint        # must produce zero lint errors
```

**Acceptance:** `pnpm build` clean. Security headers present in `curl -I` response. No `any` types in production code paths.

---

## Dependency order summary

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5
                                        ↓
Phase 6 (blog, anytime after Phase 1)
                                        ↓
Phase 7 (Paystack) → Phase 8 (Donate) → Phase 9 (Events)
                                        ↓
Phase 10 (Scholarship)
                                        ↓
Phase 11 (Auth) → Phase 12 (DB) wires into all prior phases
                                        ↓
Phase 13 (SEO) → Phase 14 (Hardening)
```

---

## Environment variables required

| Variable                                           | Used by                                  | Side            |
| -------------------------------------------------- | ---------------------------------------- | --------------- |
| `PAYSTACK_SECRET_KEY`                              | Paystack API calls, webhook verification | Server only     |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`                  | Paystack Popup (client)                  | Client          |
| `DATABASE_URL`                                     | Prisma                                   | Server only     |
| `BETTER_AUTH_SECRET`                               | Better Auth session signing              | Server only     |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Email receipts                           | Server only     |
| `NEXT_PUBLIC_SITE_URL`                             | Absolute URL for OG tags, redirects      | Client + Server |

Copy `.env.local.example` → `.env.local` and fill in values before starting Phase 7+.
