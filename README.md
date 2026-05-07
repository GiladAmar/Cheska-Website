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

The header, footer, JSON-LD, and Google Fonts links are shared across pages via `partials/`. After editing anything in `partials/`, run `npm run build` to inject the changes into all pages. The build is idempotent and uses `<!-- include:NAME --> ... <!-- /include -->` markers in each page.

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

Pushes to the default branch deploy automatically via GitHub Pages (Settings → Pages, source = repo root). The `CNAME` file in the repo root holds the custom domain (`franamar.co.za`) — do not delete it.

## DNS configuration

DNS is managed at **Domains.co.za**. To point the apex domain `franamar.co.za` and the `www` subdomain at this GitHub Pages site, set the following records on the `franamar.co.za` zone:

**Apex (`@` / `franamar.co.za`) — four A records pointing at GitHub Pages:**

| Type | Host | Value           | TTL  |
|------|------|-----------------|------|
| A    | @    | 185.199.108.153 | 3600 |
| A    | @    | 185.199.109.153 | 3600 |
| A    | @    | 185.199.110.153 | 3600 |
| A    | @    | 185.199.111.153 | 3600 |

Optionally add the matching IPv6 AAAA records (same `@` host) for IPv6 clients:

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

**`www` subdomain — single CNAME pointing at the GitHub Pages user site:**

| Type  | Host | Value                | TTL  |
|-------|------|----------------------|------|
| CNAME | www  | giladamar.github.io. | 3600 |

(Note the trailing dot on `giladamar.github.io.` — Domains.co.za usually adds it automatically.)

**Then in the GitHub repo:** Settings → Pages → Custom domain → enter `franamar.co.za` → Save → tick **Enforce HTTPS** once the certificate provisions (can take up to ~24 hours after DNS propagates).

### Verifying

```bash
dig +short franamar.co.za        # should return the four 185.199.x.153 IPs
dig +short www.franamar.co.za    # should return giladamar.github.io. then the IPs
curl -I https://franamar.co.za   # should be HTTP/2 200 from GitHub.com servers
```

If `dig` still shows old records, propagation can take up to 24 hours depending on the previous TTL. If GitHub Pages reports a domain verification error, check the `CNAME` file in the repo matches the domain entered in Settings → Pages.
