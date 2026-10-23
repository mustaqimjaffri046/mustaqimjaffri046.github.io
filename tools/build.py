"""Build the Cloudflare Pages upload folder (dist/) from the repository.

Copies only what the public site needs — no README, notes, tools, editor or git files —
after refreshing portfolio.html from data/projects.json.

    python tools/build.py
    wrangler pages deploy dist --project-name mustakeem --branch main
"""
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"

FILES = [
    "index.html", "portfolio.html", "project.html", "videos.html", "404.html",
    "sitemap.xml", "robots.txt", "_headers", "data/projects.json",
    # Google Search Console ownership proof: it must stay reachable or the site
    # silently loses verification.
    "googlec64db0e6d4d94ef3.html",
]
DIRS = ["services", "assets"]
# The local editor (edit.html) writes to the browser only; it isn't part of the public site.
SKIP = {"assets/js/edit.js", "assets/css/edit.css"}


def main():
    subprocess.run([sys.executable, str(ROOT / "tools" / "prerender.py")], check=True)
    if DIST.exists():
        shutil.rmtree(DIST)
    copied = 0
    for name in FILES:
        target = DIST / name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT / name, target)
        copied += 1
    for folder in DIRS:
        for path in (ROOT / folder).rglob("*"):
            rel = path.relative_to(ROOT).as_posix()
            if path.is_dir() or rel in SKIP or path.name.startswith("."):
                continue
            target = DIST / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, target)
            copied += 1
    print(f"built {DIST.relative_to(ROOT)}/ with {copied} files")


if __name__ == "__main__":
    main()
