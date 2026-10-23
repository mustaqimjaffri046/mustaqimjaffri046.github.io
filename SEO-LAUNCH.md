# SEO and launch plan

Working notes for launching and growing the site. Not published (excluded in `_config.yml`).

Technical SEO readiness is not the same as search performance. Nothing here guarantees
rankings or traffic; it makes the site crawlable, clear and measurable so results can be
tracked and improved. No search volumes or difficulty scores are given because none have
been measured — check them in Google Search Console after launch (real queries) or a
keyword tool before investing in new pages.

## 1. Keyword-to-page map

One primary theme per page, so pages don't compete with each other.

| Page | Search intent | Primary theme | Secondary themes | Title | CTA |
|---|---|---|---|---|---|
| `/` | Commercial: hire someone | Unity VR developer for hire | hire Unity XR developer, remote Unity VR developer, Unity VR development services, Unity XR developer for contract work, VR prototypes, technical consulting | Unity VR Developer for Hire \| VR Training & Meta Quest Apps | Discuss your VR project (form) |
| `/services/vr-training-simulation.html` | Commercial: buy a training sim | VR training simulation development | VR simulation developer for industrial training, VR training simulator developer, enterprise / multi-user VR training | VR Training Simulation Development in Unity \| Muhammad Mustakeem | Discuss your training simulation |
| `/services/meta-quest-development.html` | Commercial: build a Quest app | Meta Quest app development | Meta Quest developer, mixed reality application development, Quest passthrough apps, Revit to VR walkthrough, OpenXR | Meta Quest App Development: VR & Mixed Reality \| Muhammad Mustakeem | Discuss your Quest app |
| `/services/unity-vr-optimization.html` | Commercial: fix performance | Unity VR optimization | Quest performance optimization, Unity VR frame rate, PC VR to Quest | Unity VR Optimization Services for Meta Quest \| Muhammad Mustakeem | Get your VR project optimized |
| `/portfolio.html` | Navigational / evaluation | Unity VR developer portfolio | Muhammad Mustakeem, VR projects, experience | Unity VR Developer Portfolio \| Muhammad Mustakeem | Discuss your VR project |

Deliberately **not** separate pages yet:

- **Mixed reality** — covered as a section of the Meta Quest page (`#mixed-reality`). Give it
  its own page only once there is at least one published MR project to show.
- **VR prototypes / technical consulting** — a home page service card and FAQ. A page makes
  sense once there are examples of prototype or review work to describe.
- **Country pages** (USA, UK, Germany, UAE, Saudi Arabia) — would repeat the same content with
  a different country name. Remote collaboration and time-zone facts are on the home page
  instead. Add `hreflang` only if real translated pages (e.g. German, Arabic) are created.

## 2. Case studies: evidence and what's missing

No static case-study pages have been published: the project data has a short description,
role and one-line challenge/outcome per project, which is not enough for an original case
study, and publication permission is unconfirmed. `project.html?slug=…` pages are
`noindex` until each strong project has its own page.

| Project | In the data now | Missing for a case study | Permission |
|---|---|---|---|
| Warehouse Management VR Simulator | Goal, role, task system with scoring, multiplayer-ready structure, GPU instancing + occlusion culling, demo video | Client/context, headset, team size, testing done, measured results (e.g. frame time before/after), screenshots | **Check** — likely client or IDRAK AI work; the video has a Fiverr watermark |
| VR Plane Marshalling Trainer | Goal, role, gesture recognition, signal validation, guided flow, "stable 90 FPS" claim, video | How gestures are tracked (hands/controllers), validation with real marshallers, how 90 FPS was measured, screenshots | **Check** — aviation work at IDRAK AI |
| Workers Posture Correction System | Goal, role, joint tracking, posture analysis, live cues, session report, video | Tracking hardware, how posture rules were defined/validated, outcomes, screenshots | **Check** |
| HomeDecor | Revit model to Unity on Quest 2, video | Whether it is VR or **mixed reality** (you called it "mixed reality home design"; the data says VR walkthrough), client, features, screenshots | **Check** |
| Wardrobe Management VR | Role, physics grab, 3D UI, persistence, video | Client/context, headset, results | **Check** |
| VR Bus Driving Simulation | One-line description, video | Role, features, challenge, outcome | **Check** |

**To turn a project into a case study, provide:** 1) objective and context (client can be
anonymised, e.g. "a European logistics company"); 2) your role and what you personally
built; 3) the hardest technical problems; 4) tools and implementation; 5) how it was tested
and optimized; 6) verified outcomes — only real numbers; 7) 3–5 screenshots and a 30–60 s
clip; 8) written permission to publish. Each becomes `/work/<slug>.html` with its own title,
canonical, sitemap entry and a link from the matching service page.

## 3. Article ideas (only with your real experience)

Write these only when you can add first-hand detail; one strong article beats ten generic ones.

1. **How to scope a VR training simulation** — the inputs you ask clients for (see the
   "What to send for a quote" list), how you split milestones, what changes cost.
2. **Meta Quest app or PC VR simulation?** — trade-offs you've hit: performance headroom,
   deployment, cost of headsets, fidelity.
3. **Optimizing Unity VR for standalone headsets** — what you actually did on the warehouse
   and marshalling projects, with before/after numbers if you have them.
4. **Testing and deploying VR training** — on-device testing, subject-expert validation,
   distributing builds to a fleet of headsets.

## 4. Facts and claims to confirm before launch

- "Senior Unity Developer at IDRAK AI", June 2023 – present; "4+ years" in Unity
- "90 FPS on Quest 2" (experience entry, marshalling project, optimization page)
- The 8 client reviews are real; which platform they came from
- Mixed reality: which MR features you have shipped (passthrough, scene, anchors) — the site
  now offers MR on Quest without naming a specific MR project
- HomeDecor: VR or mixed reality
- Copy on the service pages: "who it's for", testing/deployment and quote checklists
- Budget ranges in the form
- "Published hyper-casual mobile games with Unity Ads"
- Certifications (hidden) — restore only with credential links
- Achievements (hidden: 500K+ downloads, ratings, 40% / 30% figures) — restore only with store
  links or other proof

## 5. Account-dependent tasks (only you can do these)

| Task | Where | Then |
|---|---|---|
| Create a form endpoint (e.g. Formspree, free tier) | formspree.io | Put the URL in `contact.formEndpoint` in `data/projects.json` |
| Choose analytics: Plausible (cookieless) or GA4 (needs consent for EU visitors) | plausible.io / analytics.google.com | Put the domain or `G-…` ID in `analytics` in `assets/js/config.js` |
| Verify Search Console (URL-prefix property `https://mustaqimjaffri046.github.io/`) | search.google.com/search-console | Paste the `google-site-verification` meta tag where the comment is in `index.html` |
| Optional: WhatsApp number, booking link, review profile | — | `whatsapp`, `bookingUrl`, `reviewsUrl` in `data/projects.json` |
| Résumé PDF | — | `assets/resume/…pdf` and `site.resumeUrl` |
| Permission to publish client / employer projects | Your clients / IDRAK AI | Hide any project you can't show (`"listed": false`) |

Events sent once analytics is on: `generate_lead` (form endpoint accepted the brief — the
only real lead event), `lead_brief_prepared` and `lead_email_app_opened` / `lead_brief_copied`
(intent, no endpoint), `lead_error`, `email_click`, `linkedin_click`, `whatsapp_click`,
`booking_click`, `video_play`, `cta_*` (button clicks, not leads). In Plausible, add the
events you care about as Goals; in GA4, mark `generate_lead` as a key event.

## 6. Launch checklist

**Can be done locally (done unless noted)**
- [x] One H1, unique title and description on every indexable page
- [x] Canonical URLs on the production domain (`https://mustaqimjaffri046.github.io/…`)
- [x] Sitemap lists only the 5 indexable pages; robots.txt points to it
- [x] `noindex` on `project.html`, `videos.html`, `edit.html`, `404.html`
- [x] No broken internal links or missing assets
- [x] Social preview image and tags on all indexable pages
- [ ] Confirm every claim in section 4
- [ ] Run `python tools/prerender.py` after any JSON change
- [ ] Commit; untrack IDE files: `git rm -r --cached .vs .DS_Store assets/.DS_Store`

**Needs the live site or accounts**
- [ ] Push to `main`; wait for the GitHub Pages build; open the site over HTTPS
- [ ] Check removed URLs return the custom 404 (e.g. `/portfolio-details.html`, `/projects/titan-drift-vr.html`)
- [ ] Verify Search Console; submit `https://mustaqimjaffri046.github.io/sitemap.xml`
- [ ] URL Inspection → "Test live URL" for `/` and the 3 service pages; request indexing
- [ ] Send a real test brief through the form; confirm the email arrives and the reply-to is correct
- [ ] Analytics real-time view shows a visit and a `generate_lead` from the test brief
- [ ] Test on a real phone (iOS Safari and Android Chrome) and a desktop browser
- [ ] Share the home page on LinkedIn and check the preview card
- [ ] Update LinkedIn, Upwork/Fiverr and GitHub profiles to link to the site

## 7. After launch

**Days 1–30 — get indexed, measure**
- Check Search Console Pages report weekly: are the 5 sitemap URLs indexed? Fix anything excluded.
- Watch Core Web Vitals (it needs real visits; small sites may show "not enough data").
- Note every inquiry: source, country, service, budget, qualified yes/no.
- Publish the first case study once you have the facts and permission (section 2).

**Days 31–60 — content from evidence**
- Two or three case studies linked from the matching service pages; add them to the sitemap.
- One article from section 3, written from your own project experience.
- Look at Search Console queries: which pages get impressions for which searches? Adjust
  titles and intros to match how people actually search — without stuffing.

**Days 61–90 — compound**
- Ask satisfied clients for a review on the platform you use, and link it (`reviewsUrl`).
- Earn links: LinkedIn posts with demo clips, Unity / XR community posts, GitHub READMEs
  for any open-source tools, client sites if they'll credit you.
- Consider a custom domain (e.g. `yourname.dev`) and matching email; set it up with a 301
  from github.io and update canonicals and the sitemap at the same time.
- If a market responds (e.g. German or Gulf inquiries), consider a real translated page
  with `hreflang` — only with genuinely translated, reviewed content.
