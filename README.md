# franamar.co.za — GitHub Pages Migration

Migrating from Squarespace to GitHub Pages. See `MIGRATION_SPEC.md` for the full plan.

## How to complete the migration

### Step 1 — Mirror the live site (run on your local machine)

The mirroring step must be run locally because Squarespace blocks cloud server IPs.

```bash
# Install dependencies (one-time)
npm install playwright
npx playwright install chromium

# Mirror the site
node scripts/mirror.js
```

This saves the raw site to `./site/`.

### Step 2 — Set your Formspree endpoint

1. Create a free account at https://formspree.io
2. Create a new form project
3. Copy the endpoint URL (looks like `https://formspree.io/f/xxxxxxxx`)
4. Open `scripts/clean.js` and replace `REPLACE_ME` on line 11 with your endpoint

### Step 3 — Clean Squarespace code

```bash
node scripts/clean.js
```

This strips Squarespace scripts, removes the cookie banner, rewires the contact form to Formspree, and copies all files to the repo root.

### Step 4 — Commit and push

```bash
git add .
git commit -m "Add migrated static site"
git push
```

### Step 5 — Enable GitHub Pages

In the GitHub repo settings → Pages:
- Source: `main` branch, root folder
- Custom domain: `franamar.co.za`
- Enforce HTTPS: enabled

### Step 6 — Update DNS (Domains.co.za)

Remove the Squarespace A records. Add:

```
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153

CNAME    www    giladamar.github.io.
```

### Step 7 — Verify, then cancel Squarespace

See the verification checklist in `MIGRATION_SPEC.md`.
