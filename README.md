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

DNS is managed at **Domains.co.za**. The domain currently points to a Squarespace site, so this is a migration: existing Squarespace records get replaced with GitHub Pages records on the same zone. Following [GitHub's custom-domain guidance](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site), the order of operations matters.

### Pre-flight

**Confirm Domains.co.za is the authoritative DNS host.** Log in to Domains.co.za → **Manage Services** → **Domains** → **Manage** next to `franamar.co.za` → check the Nameservers section. They should be the Domains.co.za defaults:

- `ns1.tld-ns.net`
- `ns2.tld-ns.com`
- `ns3.tld-ns.net`
- `ns4.tld-ns.com`

If the Nameservers section shows anything else (e.g. Squarespace's own nameservers), switch them back to the four above first — records added in Domains.co.za's DNS editor won't take effect until the nameservers point there. Propagation can take up to 24–48 hours.

**Check for DS records (DNSSEC).** If the domain has DS records set (from a prior DNSSEC setup), **remove them before changing the zone** — otherwise resolvers will reject the new records as bogus and the site will appear broken. If there are none, skip. Glue records aren't relevant here — leave alone.

**Inspect what's there now** so you know what to delete:

```bash
dig +short franamar.co.za        # likely Squarespace IPs (198.185.159.* / 198.49.23.*)
dig +short www.franamar.co.za    # likely a CNAME to ext-cust.squarespace.com
dig DS franamar.co.za +short     # any output means DNSSEC is active — clear it first
```

### Steps

**1. Add the custom domain in the GitHub repo first.** Settings → Pages → Custom domain → enter `franamar.co.za` → Save. GitHub recommends this *before* changing DNS so nobody else can claim a subdomain on the way through.

**2. Open the DNS editor on Domains.co.za.** **Manage Services** → **Domains** → **Manage** next to `franamar.co.za` → **Manage DNS** (adjacent to the "DNS Records" section).

**3. Remove the existing Squarespace records.** Typically these are:

- A records on the apex pointing at `198.185.159.144`, `198.185.159.145`, `198.49.23.144`, `198.49.23.145` (Squarespace's IPs).
- A CNAME on `www.franamar.co.za` pointing at `ext-cust.squarespace.com` (or similar).
- A verification CNAME (a long hex/alphanumeric host) pointing at `verify.squarespace.com`.

Delete each, plus anything else on the apex or `www` that isn't relevant.

**4. Add the GitHub Pages records.** Click **Add DNS Records** and add each row below. Domains.co.za's panel uses the **full domain name** in the Host field — *not* `@`.

**Apex (`franamar.co.za`) — four A records pointing at GitHub Pages:**

| Type | Host             | Value           | TTL  |
|------|------------------|-----------------|------|
| A    | franamar.co.za   | 185.199.108.153 | 3600 |
| A    | franamar.co.za   | 185.199.109.153 | 3600 |
| A    | franamar.co.za   | 185.199.110.153 | 3600 |
| A    | franamar.co.za   | 185.199.111.153 | 3600 |

An `ALIAS`/`ANAME` on the apex pointing at `giladamar.github.io.` would also work but Domains.co.za doesn't support those record types, so we use the four A records.

**Apex — matching AAAA records for IPv6 clients** (keep alongside the A records — GitHub recommends both due to uneven IPv6 adoption):

| Type | Host             | Value                | TTL  |
|------|------------------|----------------------|------|
| AAAA | franamar.co.za   | 2606:50c0:8000::153  | 3600 |
| AAAA | franamar.co.za   | 2606:50c0:8001::153  | 3600 |
| AAAA | franamar.co.za   | 2606:50c0:8002::153  | 3600 |
| AAAA | franamar.co.za   | 2606:50c0:8003::153  | 3600 |

**`www` — single CNAME pointing at the GitHub Pages user site:**

| Type  | Host               | Value                | TTL  |
|-------|--------------------|----------------------|------|
| CNAME | www.franamar.co.za | giladamar.github.io. | 3600 |

(The trailing dot on `giladamar.github.io.` is usually added by Domains.co.za automatically.)

**5. Enforce HTTPS.** Back in GitHub Settings → Pages, tick **Enforce HTTPS** once the certificate provisions. The option can take up to 24 hours to become available after DNS propagates.

**6. Disconnect the domain in Squarespace.** Once the site is serving from GitHub Pages over HTTPS, go to the Squarespace dashboard → Settings → Domains → `franamar.co.za` → Disconnect. Doing this *after* the cutover avoids any window where neither host is serving the domain. Squarespace may continue sending renewal/verification emails until disconnected, which is harmless but worth clearing up.

### Verifying

```bash
dig +short franamar.co.za        # should return the four 185.199.x.153 IPs
dig +short www.franamar.co.za    # should return giladamar.github.io. then the IPs
curl -I https://franamar.co.za   # should be HTTP/2 200 from GitHub.com servers
```

If `dig` still shows old records, propagation can take up to 24 hours depending on the previous TTL. If GitHub Pages reports a domain verification error, check the `CNAME` file in the repo matches the domain entered in Settings → Pages.
