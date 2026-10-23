# mustaqimjaffri046.github.io — redirects only

This site has moved to **<https://mustakeem.pages.dev/>**.

Everything here exists only to send visitors and search engines to the new address.
The portfolio itself is built and deployed from the `portfolio-redesign` branch to
Cloudflare Pages; nothing on this branch is part of it any more.

## How the redirect works

GitHub Pages cannot send a 301, so each old URL keeps a stub that returns **200** and
points at its new address with `rel="canonical"` plus a 0-second meta refresh — the pair
Google reads as a permanent redirect — and `location.replace()` for people. `?slug=` and
`#hash` are preserved.

| Old URL | New URL |
| --- | --- |
| `/` and `/index.html` | `/` |
| `/project.html?slug=…` | `/project?slug=…` |
| `/videos.html` | `/videos` |
| `/portfolio-details.html` | `/portfolio` |
| `/service-details.html`, `/starter-page.html`, `/projects/*.html` | `/` |
| anything else | `/` (via `404.html`) |

## Do not delete the stub files

Each `.html` here stands in for a URL that search engines already know. Deleting one
turns a working redirect into a 404 and discards whatever that URL had earned. They are
cheap to keep — a few hundred bytes each.

To regenerate them, run `python tools/make_redirect_site.py` on the `portfolio-redesign`
branch and copy `redirect-site/` over this root again.
