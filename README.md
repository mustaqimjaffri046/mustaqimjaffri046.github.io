# Developer Portfolio (Static)

Professional static portfolio website for a game/VR developer, built with pure HTML, CSS, and JavaScript.

## Folder structure

```text
assets/
  css/
    portfolio.css
    edit.css
  js/
    config.js
    data-store.js
    slider.js
    main.js
    project-page.js
    edit.js
  images/
  videos/
services/
  vr-training-simulation.html
  meta-quest-development.html
  unity-vr-optimization.html
tools/
  prerender.py
index.html        hiring page (static HTML)
portfolio.html    shareable portfolio (prerendered from JSON)
project.html      project detail page (rendered from JSON)
videos.html
edit.html
data/projects.json
```

## Where content lives

- `index.html` and `services/*.html` are plain HTML: edit the text there directly.
- `portfolio.html` is filled from `data/projects.json`. After changing the JSON (by hand or
  by exporting from `edit.html`), run `python tools/prerender.py` so the HTML that search
  engines read matches the data.
- `"listed": false` on a project hides it from the portfolio but keeps its page URL working.
- `SEO-LAUNCH.md` has the keyword-to-page map, case-study checklist and launch plan. It,
  this README and `tools/` are kept off the published site by `_config.yml`.
- `404.html` is served by GitHub Pages for missing URLs; it uses root-absolute paths.
- Contact, analytics and Search Console placeholders: `contact.formEndpoint`, `whatsapp`,
  `bookingUrl`, `reviewsUrl` in `data/projects.json`; `analytics` in `assets/js/config.js`;
  the verification comment in the `<head>` of `index.html`.

## How to add a project

1. Open `data/projects.json`.
2. Add a new object under `projects` with:
   - `title`
   - `slug`
   - `description`
   - `technologies`
   - `images[]`
   - `videos[]`
   - `github`
   - `demo`
   - `playStore` (optional)
   - `tags`
   - `projectDetails`
   - `features`
   - `screenshots`
3. Portfolio cards are generated from this JSON; run `python tools/prerender.py` afterwards.
4. Project details are available at `project.html?slug=your-slug`.

## How to edit sections

1. Open `edit.html`.
2. In **Sections**, you can:
   - add new section entries
   - reorder using up/down
   - enable/disable with checkbox
   - edit custom section title/content
3. Save and export JSON.
4. Replace `data/projects.json` with exported file if needed.

## How to upload images/videos

Because this is a static GitHub Pages site, browser uploads cannot directly write to repo files.

Recommended workflow:

1. Put media files into:
   - `assets/images/`
   - `assets/videos/`
2. Use relative paths in JSON:
   - `assets/images/my-shot.png`
   - `assets/videos/my-demo.mp4`

Editor upload behavior:

- Uploading files in `edit.html` converts them to data URLs for quick preview/testing.
- For production, move files into `assets/` folders and replace data URLs with real file paths.

## Customization

Use `assets/js/config.js` to change:

- colors
- fonts
- layout sizes
- default theme mode
- key file paths

## GitHub Pages deployment

1. Commit and push repository to GitHub.
2. In repository settings, open **Pages**.
3. Set source to:
   - branch: `main` (or your branch)
   - folder: `/ (root)`
4. Save.
5. Your site becomes available at:
   - `https://<username>.github.io/<repo>/`

## Notes

- Works without heavy frameworks.
- Fully static and GitHub Pages friendly.
- Includes dark/light mode, smooth scrolling, project filtering, animation, SEO/OG tags, and reusable media slider.
