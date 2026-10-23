# Handoff: Cloudflare Pages migration (in progress)

Branch: `portfolio-redesign` (local; `main` and the live github.io site are unchanged).
Read this first, then `SEO-LAUNCH.md` (keyword map, claims to confirm, launch checklist).

## Decisions already made by the owner
- Production address: **https://mustakeem.pages.dev/** (free pages.dev, no custom domain yet).
- Deploy: direct upload from this computer with Wrangler (no Git integration). The owner
  approves each deploy.
- Old site `mustaqimjaffri046.github.io`: replace later with a page that redirects to the
  new address (needs one push to `main`, with the owner's OK).
- GA4: loads for every visitor, no consent banner (owner's choice; note GDPR/UK risk).

## Done (committed on this branch)
- Cloudflare Pages project **`mustakeem`** created in the owner's account (production
  branch `main`). Nothing deployed yet.
- All canonicals, sitemap, robots, structured data and social tags moved to
  `https://mustakeem.pages.dev`. Page URLs are extensionless (`/portfolio`,
  `/services/vr-training-simulation`), because Pages redirects `/x.html` → `/x`.
  Internal links updated to match.
- Social image regenerated with the new address (`assets/preview/og-unity-vr-developer.jpg`).
- `_headers`: security headers, `noindex` header for `/project` and `/videos`, image caching.
- `tools/build.py` builds `dist/` (only public files; runs `tools/prerender.py` first).
- Analytics moved to `assets/js/analytics.js`, loaded on every page (incl. project,
  videos, 404). Off until IDs are set in `assets/js/config.js` → `analytics`.

## NOT done yet — next steps, in order
1. **Local test with Cloudflare's dev server** (python http.server can't serve
   extensionless URLs any more):
   ```
   python tools/build.py
   wrangler pages dev dist --port 8788
   ```
   Check: `/`, `/portfolio`, `/services/*`, `/project?slug=homedecor`, `/videos`, a missing
   URL shows the 404 page, hire links land on the form, 0 console errors, mobile at 375px.
   `.claude/launch.json` still points at the old python server on 8099 — update it to the
   command above if using the preview tool.
2. **Deploy** (only with the owner's OK):
   ```
   python tools/build.py
   wrangler pages deploy dist --project-name mustakeem --branch main
   ```
   `--branch main` matters: the current git branch is `portfolio-redesign`, and any other
   branch name makes a preview (noindex) deployment instead of production.
3. **Cloudflare Web Analytics**: dashboard → Workers & Pages → `mustakeem` → Metrics →
   Enable Web Analytics, then redeploy (Cloudflare injects the beacon). Leave
   `cloudflareBeaconToken` empty in that case, or it double-counts.
4. **GA4**: owner creates a GA4 property + web stream for `https://mustakeem.pages.dev`,
   puts the `G-…` ID in `config.js` → `analytics.ga4MeasurementId`, rebuild, redeploy.
   In GA4: mark `generate_lead` as a key event; add custom dimensions for event params
   `service`, `budget`, `method`, `label`. Event list is in `SEO-LAUNCH.md` §5.
   Only `generate_lead` means a sent inquiry — it needs a form endpoint
   (`contact.formEndpoint` in `data/projects.json`, e.g. Formspree). Without one, the form
   falls back to email (tracked as `lead_brief_prepared` / `lead_email_app_opened`).
5. **Search Console**: URL-prefix property `https://mustakeem.pages.dev/`, HTML-tag method;
   paste the tag where the comment is in `index.html` `<head>`, rebuild, redeploy, verify,
   submit `https://mustakeem.pages.dev/sitemap.xml`, inspect `/` and the 3 service pages.
6. **Redirect the old github.io site** (owner's OK + push to `main`): replace its content
   with an `index.html` + `404.html` that send visitors to the same path on
   `mustakeem.pages.dev` (drop `.html`) via `<link rel="canonical">` + meta refresh +
   `location.replace`. Not written yet.
7. **Weekly review** (owner): Search Console Performance (queries/pages/countries) +
   GA4 (sessions vs `generate_lead` per landing page). Improve pages with impressions or
   visits but no inquiries: title/intro match to queries, clearer CTA, stronger proof.
8. Owner still has to confirm the claims listed in `SEO-LAUNCH.md` §4.

## Gotchas
- On the F: drive, Python `open(path, "w")` fails with "Invalid argument" when a browser or
  editor has the file open; write in place (`r+` + truncate) as the scripts here do.
- The F: drive once disconnected mid-session and lost the last edits; after big changes,
  check files on disk before committing.
- `wrangler whoami` shows the owner's account "Mustakeem" with `pages (write)`.
