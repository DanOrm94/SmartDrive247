# SmartDrive247

Premium Manchester chauffeur, executive travel, event and airport transfer website built with Astro, Tailwind CSS and Cloudflare Pages Functions.

## Stack

- Astro + Tailwind CSS
- Cloudflare Pages / Functions
- Resend for enquiry email delivery
- Cloudflare Turnstile for spam protection
- Optional Cloudflare D1 can be added later for enquiry storage

## Local development

Requirements: Node.js 22+ and npm.

```bash
npm install
cp .env.example .env
npm run dev
```

Open the local URL shown by Astro. The public booking form is at `/booking`.

## Environment variables

- `RESEND_API_KEY` — Resend API key.
- `BOOKING_TO_EMAIL` — address that should receive website booking requests.
- `TURNSTILE_SECRET_KEY` — Turnstile secret key used by the Pages Function.
- `PUBLIC_TURNSTILE_SITE_KEY` — public Turnstile site key used by the frontend widget.

## Booking form flow

The form posts to `/api/booking`, implemented by `functions/api/booking.ts` for Cloudflare Pages. The function reads the submitted fields, trims and bounds user input, validates required fields and email format, verifies Turnstile with Cloudflare, sends the enquiry to `BOOKING_TO_EMAIL` via Resend, and redirects the customer to `/booking?sent=1` on success.

The handler does not persist enquiry data yet; Cloudflare D1 can be added later once storage requirements are finalised.

## Cloudflare Pages deployment

Connect this GitHub repository to Cloudflare Pages and configure:

- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`
- Node.js: `22` or newer

The Cloudflare Pages project name controls the `*.pages.dev` hostname. If you want `smartdrive247.pages.dev`, create/use a Pages project named `smartdrive247` and connect it to this repository.

Add these production variables/secrets in Pages → Settings → Variables and Secrets:

- `RESEND_API_KEY` (encrypted secret)
- `BOOKING_TO_EMAIL`
- `TURNSTILE_SECRET_KEY` (encrypted secret)
- `PUBLIC_TURNSTILE_SITE_KEY`

Astro's Cloudflare adapter outputs the deployment bundle needed by Pages. Cloudflare's Git integration can auto-deploy pushes to `main`.

## Branding placeholders

Replace `[PHONE]`, `[EMAIL]`, `[INSTAGRAM]` and `[LOGO]` with final business details/assets. The website is designed around the operator's single vehicle, so vehicle photography can be added to the relevant service/about content without a separate fleet page.

## Production checklist

Replace testimonial placeholders with verified reviews, add real vehicle photography/specifications, add the final Google Maps embed/service area, verify all licensing/insurance wording, and add the production Turnstile widget/client script to the booking form.
