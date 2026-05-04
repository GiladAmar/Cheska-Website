# franamar.co.za

Static website for **Fran Amar Psychotherapy**, a Counselling Psychologist practice in Camps Bay, Cape Town. Hosted on GitHub Pages with the apex domain `franamar.co.za`.

## Layout

```
index.html              — home
about/index.html        — about Fran + therapeutic approach
services/index.html     — services offered
contact/index.html      — contact details + form
404.html                — not-found page
assets/css/site.css     — single stylesheet
assets/js/site.js       — single script (mobile menu only)
assets/img/             — photos and illustrations
sitemap.xml, robots.txt — SEO basics
CNAME                   — custom-domain pointer for GitHub Pages
```

## Editing

It's plain HTML + CSS — open the file, make the change, commit, push. GitHub Pages serves the repo root.

For a quick local preview:

```bash
python3 -m http.server 8765
# then open http://localhost:8765
```

## Contact form

The contact form on `index.html` and `contact/index.html` posts to Formspree. The endpoint is in the `<form action>` attribute. Submissions are emailed to Fran via Formspree's notification settings.

## Screenshots

`scripts/screenshot.js`, `screenshot-local.js`, and `screenshot-menu.js` capture the live site, the local rebuild, and the mobile menu-open state respectively. They require Playwright:

```bash
npm install playwright
npx playwright install chromium
node scripts/screenshot-local.js
```

Output lands in `reference/` (gitignored).

## Deployment

Pushes to the default branch deploy automatically via GitHub Pages (Settings → Pages, source = repo root). DNS is managed at Domains.co.za with A records pointing at GitHub Pages' IPs and a `www` CNAME to `giladamar.github.io`.
