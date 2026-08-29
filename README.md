# Smart Drive 24/7

Premium-feeling Astro + Tailwind marketing site for a Manchester executive chauffeur company.

## Stack

- Astro static output
- Tailwind CSS v4 via Vite
- Cloudflare Pages + root `functions/` route for the quote endpoint
- Resend email API
- Cloudflare Turnstile spam protection

## Local setup

```bash
npm install
npm run dev
```

For the form endpoint, create a local `.dev.vars` file with:

```dotenv
RESEND_API_KEY="re_xxxxxxxxx"
QUOTE_TO_EMAIL="your-inbox@example.com"
QUOTE_FROM_EMAIL="Smart Drive 24/7 <quotes@your-domain.example>"
TURNSTILE_SECRET_KEY="your-turnstile-secret"
```

Do not commit `.dev.vars` or production secrets.

## Cloudflare Pages

Use:

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`

Set these encrypted Function secrets / variables in Cloudflare:

- `RESEND_API_KEY`
- `TURNSTILE_SECRET_KEY`
- `QUOTE_TO_EMAIL`
- `QUOTE_FROM_EMAIL`

Then replace `YOUR_TURNSTILE_SITE_KEY` in `src/pages/index.astro` with the public Turnstile site key.

Cloudflare Pages will rebuild on pushes to the connected GitHub repository.

## Content to replace before launch

1. Swap `public/images/vehicle-*.svg` for real WebP/AVIF vehicle photography.
2. Swap the hero placeholder treatment for a high-end car photograph.
3. Replace testimonial placeholders with verified reviews.
4. Replace the licensing placeholder with exact operator / driver details.
5. Replace the placeholder privacy wording with the final privacy notice and link.
6. Confirm the live website domain if it is not `https://smartdrive247.co.uk`.

## Notes

The public site deliberately contains no third-party analytics and only loads the Turnstile client script for the quote form. The Resend and Turnstile secrets are server-side only.
