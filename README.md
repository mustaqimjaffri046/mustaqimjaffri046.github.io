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
projects/
  titan-drift-vr.html
  astra-colony-sim.html
index.html
project.html
edit.html
data/projects.json
```

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
3. Home page cards are auto-generated from this JSON.
4. Project details are available at:
   - `project.html?slug=your-slug`
   - `projects/your-slug.html` (optional dedicated page pattern)

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
