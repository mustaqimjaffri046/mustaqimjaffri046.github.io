"""Write project data from data/projects.json into portfolio.html as plain HTML.

The page's JavaScript renders the same data on load; this copy is what search
engines and link previews see without running JavaScript. Run it after editing
data/projects.json (or after exporting from edit.html):

    python tools/prerender.py
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "projects.json"
PAGE = ROOT / "portfolio.html"


def esc(value):
    return html.escape(str(value or ""), quote=True)


def drive_id(url):
    match = re.search(r"drive\.google\.com/file/d/([^/?#]+)", url or "") or re.search(r"[?&]id=([^&#]+)", url or "")
    return match.group(1) if match else ""


def media(project):
    demo = (project.get("videos") or [""])[0]
    poster = project.get("poster") or (project.get("images") or [""])[0]
    if not poster and drive_id(demo):
        poster = "https://drive.google.com/thumbnail?id=" + drive_id(demo) + "&sz=w1280"
    if not poster:
        return "<div class='featured-media-empty'><p>Demo coming soon</p></div>"
    image = (
        f"<img class='featured-poster' src='{esc(poster)}' alt='{esc(project['title'])} screenshot' "
        "loading='lazy' decoding='async' referrerpolicy='no-referrer' "
        "onerror=\"this.closest('.featured-media').classList.add('is-missing')\">"
    )
    if not demo:
        return image
    return (
        f"<button type='button' class='featured-play' data-play-video='{esc(demo)}' "
        f"data-video-title='{esc(project['title'])}'>{image}"
        "<span class='featured-play-badge'><span aria-hidden='true'>▶</span> Watch demo</span></button>"
    )


def tech_row(project):
    return "<p class='tech-row'>" + "".join(f"<span>{esc(t)}</span>" for t in project.get("technologies", [])[:4]) + "</p>"


def featured(data):
    picked = sorted((p for p in data["projects"] if p.get("featured")), key=lambda p: p.get("featuredOrder") or 99)[:3]
    out = []
    for p in picked:
        demo = (p.get("videos") or [""])[0]
        out.append(
            "<article class='featured-card'>"
            f"<div class='featured-media'>{media(p)}</div>"
            "<div class='featured-body'>"
            f"<p class='featured-kicker'>{esc(p.get('type') or 'Project')}</p>"
            f"<h3>{esc(p['title'])}</h3>"
            + (f"<p class='featured-highlight'>{esc(p['highlight'])}</p>" if p.get("highlight") else "")
            + f"<p class='featured-desc'>{esc(p['description'])}</p>"
            + tech_row(p)
            + "<div class='project-actions'>"
            f"<a class='btn btn-secondary' href='project.html?slug={esc(p['slug'])}'>Project details</a>"
            + (f"<a class='btn btn-ghost' href='{esc(demo)}' data-play-video='{esc(demo)}' "
               f"data-video-title='{esc(p['title'])}'>Watch demo</a>" if demo else "")
            + "</div></div></article>"
        )
    return "\n".join(out)


def projects(data):
    out = []
    for p in data["projects"]:
        if p.get("listed") is False:
            continue
        tags = ["Type: " + (p.get("type") or "Game")] + p.get("tags", [])
        details = (
            f"<a class='btn btn-secondary' href='project.html?slug={esc(p['slug'])}'>Details</a>"
            if p.get("projectDetails") else ""
        )
        out.append(
            "<article class='project-card'>"
            f"<div class='project-slider-frame featured-media'>{media(p)}</div>"
            "<div class='project-card-body'>"
            "<p class='tag-row'>" + "".join(f"<span>{esc(t)}</span>" for t in tags) + "</p>"
            f"<h3>{esc(p['title'])}</h3><p>{esc(p['description'])}</p>"
            + tech_row(p)
            + f"<div class='project-actions'>{details}</div></div></article>"
        )
    return "\n".join(out)


def experience(data):
    return "\n".join(
        "<article class='timeline-item'>"
        f"<p class='timeline-period'>{esc(e['period'])}</p><h3>{esc(e['role'])}</h3>"
        f"<h4>{esc(e['company'])}</h4><p>{esc(e['description'])}</p></article>"
        for e in data["experience"]
    )


def skills(data):
    out = []
    for group in data["skillCategories"]:
        names = group.get("items") or [s["name"] for s in data["skills"] if s.get("category") == group["id"]]
        out.append(
            f"<article class='skill-category'><h3>{esc(group['title'])}</h3><ul>"
            + "".join(f"<li><span>{esc(n)}</span></li>" for n in names)
            + "</ul></article>"
        )
    return "\n".join(out)


def testimonials(data):
    picked = [t for t in data["testimonials"] if t.get("featured")] or data["testimonials"]
    out = []
    for t in picked:
        rating = t.get("rating") or 0
        stars = "★" * round(rating) + "☆" * (5 - round(rating))
        out.append(
            "<article class='testimonial-card'>"
            + (f"<p class='testimonial-rating' aria-label='Rated {rating} out of 5'>"
               f"<span class='testimonial-stars' aria-hidden='true'>{stars}</span>"
               f"<span class='testimonial-rating-num'>{rating:.1f}</span></p>" if rating else "")
            + f"<p class='testimonial-quote'>“{esc(t['text'])}”</p>"
            f"<h3>{esc(t['name'])}</h3>"
            + (f"<small>{esc(t['country'])}</small>" if t.get("country") else "")
            + "<span class='testimonial-badge'>Client review</span></article>"
        )
    return "\n".join(out)


def main():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    page = PAGE.read_text(encoding="utf-8")
    blocks = {
        "featured": featured(data),
        "projects": projects(data),
        "experience": experience(data),
        "skills": skills(data),
        "about": esc(data["site"].get("about")),
        "testimonials": testimonials(data),
    }
    for name, content in blocks.items():
        pattern = re.compile(rf"(<!-- prerender:{name} -->\n).*?(<!-- /prerender:{name} -->)", re.S)
        if not pattern.search(page):
            raise SystemExit(f"marker prerender:{name} not found in {PAGE.name}")
        page = pattern.sub(lambda m: m.group(1) + content + "\n" + m.group(2), page)
    PAGE.write_text(page, encoding="utf-8", newline="")
    print("prerendered", ", ".join(blocks))


if __name__ == "__main__":
    main()
