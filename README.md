# Meridian · Specialty Coffee Coming-Soon Site

An editorial coming-soon landing page for **Meridian**, a specialty coffee brand launching with a single-origin, direct-trade sourcing model.

## Stack

- **Astro 5** (SSR on Vercel, `output: 'server'`) + `@astrojs/vercel` adapter
- **Tailwind v4** via `@tailwindcss/vite`
- **@astrojs/sitemap** → auto-generated `/sitemap-index.xml`
- **Supabase** (`meridian_waitlist`, `meridian_content`) — waitlist captures
- **Resend** (via REST) — confirmation emails
- Typography: Fraunces (display) + Inter (body) + JetBrains Mono (meta)
- Accent: warm copper `#B87333` on cream/ink editorial base
- Dark/light theme toggle stored in `localStorage`

## Pages

| Path | Purpose | Schema |
| ---- | ------- | ------ |
| `/` | Coming-soon hero + Origin + Story + Waitlist | Organization, WebSite, Event |
| `/our-story` | Long-form founding letter | AboutPage, Breadcrumb |
| `/thanks` | Post-submission confirmation | WebPage, Breadcrumb |

## Develop

```bash
npm install --legacy-peer-deps
cp .env.example .env
npm run dev
```
