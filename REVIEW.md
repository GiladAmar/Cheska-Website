# Site Review — franamar.co.za

A full pass over the codebase: content, copy, semantics, accessibility, SEO, performance, code quality, and visual polish.

Items are tagged by priority so you can triage:

- **🔴 Critical** — actually broken, accessibility-blocking, or factually misleading. Fix before anyone visits.
- **🟠 High** — meaningful impact on SEO, conversions, or trust. Fix soon.
- **🟡 Medium** — code-health, performance, polish. Worth doing.
- **🟢 Low** — nice-to-have, stylistic, future enhancements.

A quick action summary lives at the bottom.

---

## 0. Visual review (from fresh screenshots)

I rebuilt and captured the live state at 1440 / 768 / 390 viewports plus the mobile menu-open state, then read each screenshot. Findings below either confirm code-review items visually or are *only* visible from rendered output.

### 🔴 Mobile menu doesn't cover the header (z-index bug)
The screenshot of the menu-open state shows the cream `site-header` with full-size logo **floating above** the rose menu overlay — the rose only fills the area below the header. That's because:

```css
.site-header  { z-index: 50; }
.mobile-menu  { z-index: 40; }   /* lower → header sits on top */
```

The intent (per the rebuild brief) was a full-screen overlay. Today the menu is a "drawer below the header", and the oversized logo competes visually with the menu links. Two-line fix:

```css
.mobile-menu.is-open { z-index: 60; }      /* or simply raise base z-index */
body.menu-open .site-header { background: transparent; }
```

Or restructure so the menu owns its own close button (the `×` icon already exists in the screenshot — make sure it's the only header element visible when open).

### 🟠 Header logo is oversized on desktop
On `desktop/contact.png` the header logo renders at roughly 165 × 165 px square, dwarfing the three nav links to its right. The asset is `logo.png` at 500×500 with `max-width: 11rem` — on a wide viewport it hits its max and looks like a logo block, not a wordmark. Options:
- Cap it harder: `max-width: 7rem` and `height: auto`.
- Crop a horizontal lockup variant for the header (logo + script wordmark beside, not stacked) and keep the square version for the footer.
- Set explicit `width="140" height="140"` on the `<img>` so it doesn't drift with viewport size.

This also fixes the no-dimensions / CLS issue flagged in §5.

### 🟠 Map iframe is not visible on the home page
On `desktop/home.png` the "In-person and online options" rose band is text-only — no map renders even though `index.html:176-182` does have a `<iframe class="map-frame" src="…maps?q=Camps+Bay+Medical+Practice…">`. Likely causes, in order of probability:
1. The iframe loads asynchronously and Playwright's `networkidle` was satisfied before Google's embed finished.
2. The aspect-ratio rule is collapsing the frame to zero height in some condition.
3. Ad/tracking blocker behavior in headless Chromium.

Worth opening `index.html` in a real browser and confirming the iframe actually displays. If it does, this is a screenshot-tooling artifact and not a real bug. If it doesn't, fall back to a static map image with a "View on Google Maps" link (which also addresses §6's "no fallback" note).

### ~~🟠 Cream-on-sage contrast failure — visually confirmed~~
In `desktop/home.png` the body copy of the About preview band reads as faint cream-on-sage. From a reading-distance glance the paragraph blurs into the background. This is the same item flagged in §1 by ratio (2.89:1) — the screenshot makes it concrete.

### 🟡 Home "Available Services" band is empty-looking
In `desktop/home.png` the sage Available Services band is: tiny script title + one italic line + a single button. It reads as filler between the heavier rust and rose sections. Reinforces the design note in §7 — either add bullets, or merge into a richer offerings block.

### 🟡 Areas-of-Interest illustration is small relative to the band
The book illustration on the rust band sits in the right column but renders much smaller than the bullet list to its left, leaving visual dead space below it. Either scale it up (320 → ~480 px) or move it to a corner motif.

### 🟡 Send button on contact form blends into the rust section
On the home page contact band, the rust background + sage button works. On the dedicated `/contact/` page (rose band) the sage button is fine. On both, the button label "Send" / "SEND" is very small relative to the form fields. Consider sizing up to 1.1rem and adding hover affordance.

### 🟢 Mobile, tablet, and desktop layouts all hold together
No broken stacking, no overflow, no horizontal scroll. The two-column `cols` collapses sensibly at 768px. The hero image renders correctly at all three viewports. This is a strong baseline — most of the issues above are polish, not structural breakage.

---

## 1. Accessibility & semantics

### ~~🔴 Color contrast fails WCAG AA on two key sections~~
I computed the actual contrast ratios:

| Combination | Used on | Ratio | WCAG AA |
|---|---|---|---|
| Cream text on sage `#8a9d80` | Home About preview, home Available Services, About page Meet Fran + Therapeutic Approach | **2.89 : 1** | ❌ Fail (need 4.5) |
| Rust-deep text on rose `#dfb5a3` | Home In-person section, Contact page body | **4.19 : 1** | ❌ Borderline fail |
| Cream text on rust `#a64019` | Home Areas of Interest, home Contact form | 6.12 : 1 | ✅ Pass |
| Ink-soft on cream | Footer | 8.5 : 1 | ✅ Pass |

This affects **every page**. The cream-on-sage problem is the worst — it's the dominant body-text combination on the home and About pages.

Fix: darken sage to roughly `#6f8267` (already in your palette as `--c-sage-deep`) for backgrounds where cream text sits on top, OR change the body text on sage from cream to a near-black ink. Either change is one line in `site.css`.

### ~~🔴 About and Services pages have no `<h1>`~~
Both pages use a `<span class="section__eyebrow">` for the page title ("About", "Services Offered"). To Google and screen readers, neither page has a primary heading at all. The first heading they see is "Meet Fran" / "Individual Psychotherapy" as `<h2>` — so the heading tree is broken (h2 with no h1 above).

Fix: change those eyebrow `<span>`s to `<h1>` and style with `.section__eyebrow` (CSS doesn't care about the tag). Five-second change, big SEO/a11y win.

### 🟠 Footer h4s without an h2/h3 above them
Each page jumps from `h2` (or no h1) directly to `h4` in the footer. Heading levels should never skip. Either drop them to `<p class="footer-heading">` or up-level the `<h2>`/`<h3>` structure on each page.

### 🟠 No skip-to-content link
Keyboard users have to tab through every nav link on every page before reaching content. Add a hidden-until-focused skip link as the first focusable element:

```html
<a class="skip-link" href="#main">Skip to content</a>
…
<main id="main">
```

CSS: position absolute off-screen, become visible on `:focus`.

### 🟠 Mobile menu doesn't trap focus or move it
When you click the burger, the menu opens but keyboard focus stays on the burger button. Tabbing from there hits hidden header links behind the overlay. Best practice: when the menu opens, move focus to the first menu link; while open, trap Tab inside the menu; on close, return focus to the burger. About 15 lines of JS.

### 🟠 Mobile menu lacks `aria-hidden` toggling
The `<nav id="mobile-menu">` is in the DOM at all times. When closed it's `visibility: hidden` which is correct for screen readers, but explicitly setting `aria-hidden="true"` on close (and removing on open) is more robust across assistive tech.

### 🟡 Default link styling strips underlines globally
`a { text-decoration: none; }` removes underlines from every link, including body text. The email and phone in the contact section are visually indistinguishable from regular text — only color (which is currently inherited and identical) hints they're links. Add a body-text-link rule:

```css
main p a, main li a { text-decoration: underline; text-underline-offset: 0.2em; }
```

### 🟡 Hero text contrast varies with the wave image
`Fran Amar` and the script tagline sit over a JPEG. The current 5%–15% overlay gradient is too subtle. Bright wave-crest pixels behind the text fail contrast. Either deepen the overlay (15%–35%) or shift the text to a panel background.

### 🟡 No `:focus-visible` styling
Browsers provide default focus rings, but they're inconsistent (Chrome ≠ Safari ≠ Firefox) and can disappear on some elements with custom styling. Add a single explicit rule:

```css
:focus-visible { outline: 2px solid var(--c-rust); outline-offset: 2px; }
```

### 🟡 The "(required)" label uses opacity 0.7
That dims the contrast of an important indicator. Use full opacity and a smaller font size, or rely on the `*` convention with full contrast.

### 🟢 The hamburger animation has no `prefers-reduced-motion` respect
Add a single block:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }
}
```

---

## 2. SEO

### 🟠 No Open Graph / Twitter Card metadata
Right now if anyone shares a page on WhatsApp, Facebook, LinkedIn, or Twitter/X, the preview is bare. Add to each page's `<head>`:

```html
<meta property="og:type" content="website">
<meta property="og:title" content="…">
<meta property="og:description" content="…">
<meta property="og:url" content="https://franamar.co.za/…">
<meta property="og:image" content="https://franamar.co.za/assets/img/og-card.jpg">
<meta property="og:locale" content="en_ZA">
<meta name="twitter:card" content="summary_large_image">
```

You'll need a 1200×630 OG card image — Fran's portrait + name + tagline laid out on the cream/rose palette.

### 🟠 No `<link rel="canonical">` on any page
Helps prevent duplicate-content issues if Google ever crawls the GitHub Pages preview URL too. One line per page:

```html
<link rel="canonical" href="https://franamar.co.za/about/">
```

### 🟠 JSON-LD `medicalSpecialty: "Psychiatric"` is misleading
Schema.org's `Psychiatric` enum value is for psychiatry (medical doctors). Fran is a Counselling Psychologist — not a psychiatrist. Either omit the field entirely (`Psychologist` type already conveys the specialty) or use a custom URL like `https://schema.org/Psychiatric` won't help here. Recommendation: **delete the `medicalSpecialty` line** from the JSON-LD on all four pages.

### 🟡 JSON-LD `Person.image` points at a small portrait
Schema.org rich-result guidance recommends ≥1200×630 or square ≥1200×1200 for `Person.image`. The current `fran-portrait.jpg` is 300×458. Use the 1200×1200 framed portrait instead, or generate a higher-res version.

### 🟡 No `priceRange` on the `Psychologist` business
Google sometimes uses this for local-business panels. Add `"priceRange": "ZAR 800 – 1500"` (or whatever Fran's actual range is) — even rough numbers help the structured-data quality score.

### 🟡 Sitemap `lastmod` is hard-coded
`2026-05-04` will become inaccurate the moment you change anything. For a 4-page site updated rarely, this is OK — just add a note to bump it on edits, or write a tiny pre-commit hook.

### 🟡 Hero `<h1>` is just "Fran Amar"
The search snippet for the home page would benefit from a more descriptive h1 — "Fran Amar — Counselling Psychologist" or "Counselling Psychologist · Camps Bay" — without losing the visual wordmark effect (use `<span>` or `<small>` for a styled second line).

### 🟢 No `breadcrumbs` structured data
Optional but useful for site-link results in Google. Each non-home page could declare a BreadcrumbList.

### 🟢 No `WebSite` schema with `potentialAction.SearchAction`
Only relevant if you add site search later. Skip for now.

---

## 3. Content & copy

### 🟠 Inconsistent wording between Home and Services list
Compare the "Areas of interest" lists — Home and Services have *similar but not identical* item wording:

| Home | Services |
|---|---|
| Eating disorders **and** disordered eating | Eating disorders**,** and disordered eating |
| Adjustment to chronic illness diagnoses | Adjustment to life changes, especially chronic illness diagnoses (e.g. diabetes and auto-immune disorders) |
| Affirming care for the LGBTQIA+ community | Affirming care for clients **from** the LGBTQIA+ community |

Pick one master version (Services is more complete) and have Home reuse it verbatim. Or trim Home to high-level themes and let Services own the detail.

### 🟠 HPCSA number — confirm it's correct
Site shows `PS 0156052` everywhere. The HPCSA online register is searchable — worth a 10-second check that this is the right number (digits transposed = different practitioner). I have no way to verify; you/Fran do.

### 🟡 "Suffering with" vs "suffering from"
On About: *"…those suffering with a specific mental health problem…"*. Standard English is "suffering from". Both pass, but "from" is more idiomatic.

### 🟡 Missing hyphens in compound modifiers
Three small grammar nits on the About page:
- "level III BAPSA accredited" → **"Level III BAPSA-accredited"** (capital L, hyphen).
- "object-relations" — usually written without the hyphen in psychology literature: **"object relations"**.
- "professional individuals" → **"working professionals"** is clearer.

### 🟡 Services-page metaphor is a bit awkward
*"When we notice our car's tyre may have a puncture, we typically seek help as soon as we are aware of the problem and not after the tyre is completely deflated."* Tighter alternative:

> "When we notice our car's tyre may have a puncture, we don't wait until it's flat to fix it. The same is true for mental health."

### 🟡 The home "About" preview is too quiet
Two short paragraphs, one CTA. Visitors landing on the home page have no sense of *what working with Fran is like*. One sentence describing the experience ("Sessions are 50 minutes, in-person or via secure video, with no diagnosis required to begin") would go a long way.

### 🟢 No fees / session-length / booking specifics anywhere
Logged in `DESIGN_NOTES.md` already — just re-flagging because it's the most common reason South African clients bounce off practitioner sites.

### 🟢 No POPIA / privacy note
South Africa's POPIA law applies to handling personal information, including via the contact form. A short privacy notice (linked from the form, e.g. *"By submitting this form you consent to Fran contacting you about psychotherapy services. Your details will not be shared with third parties."*) covers the basics. A full privacy policy at `/privacy/` is recommended.

---

## 4. Code quality

### 🟠 Significant inline styling
Lots of `style="..."` attributes scattered through the HTML — `style="font-size:clamp(...)"`, `style="margin-top:var(--space-3)"`, `style="border-color:rgba(255,255,255,0.25)"`, etc. They duplicate or override `site.css` and force you to edit four HTML files instead of one stylesheet to make a design tweak. Promote each to a class:

| Inline | Suggested class |
|---|---|
| `style="font-weight:400; margin-bottom:var(--space-4)"` (h2 inside sage) | `.section-heading` |
| `style="margin-inline:auto"` on img | `.center-img` |
| `style="border-bottom:1px solid currentColor; padding-bottom:2px"` on link | `.link-underline` |

There are roughly 15 distinct inline patterns — consolidating them would shave ~80 lines across the four pages.

### 🟠 ~70 lines of header/footer/JSON-LD duplicated 4× per page
Pure-static HTML can't `@include` partials, but options exist:
- **Build step**: a 30-line Node script that reads `partials/header.html`, `partials/footer.html`, `partials/jsonld.html` and assembles each page. Run on commit. Outputs identical files; source is DRY.
- **Server-side includes**: not available on GitHub Pages.
- **Live with it**: 4 pages, manageable for now. But change-cost grows linearly with pages — adding a fifth page or changing the footer is a 4-place edit.

I'd recommend the build step the first time you change something footer-wide.

### 🟡 Dead CSS variables
`--c-rose-soft`, `--space-1`, `--f-sans` are declared but never referenced. Remove or use them.

### 🟡 Honeypot relies on `position:absolute` from a non-positioned ancestor
`.form .honey { position: absolute; left: -10000px; }` works *because* the form's ancestor `<body>` is positioned (in this case, just the document). If you ever wrap the form in a positioned container, the honeypot moves with it. Safer:

```css
.form { position: relative; }
.form .honey { position: absolute; left: -10000px; opacity: 0; }
```

### 🟡 `e.target.tagName === 'A'` is fragile
If you ever wrap the menu link text in an icon or `<span>`, clicks on the inner element won't close the menu. Use `e.target.closest('a')` instead.

### 🟡 README.md still describes the old workflow
References mirror.js, clean.js, Squarespace stripping — none of which exist anymore. Either rewrite to "static site, edit HTML/CSS, deploy via GitHub Pages" or delete entirely.

### 🟢 The CSS button hover trick relies on subtle `currentColor` evaluation
The pattern `.btn:hover { background: currentColor; color: var(--c-cream); }` works because both rules apply simultaneously and `currentColor` resolves before the new `color` is committed for `background`. It's correct but reads as if it should be invisible. A clearer pattern would set explicit per-section hover values without relying on the `currentColor` quirk.

### 🟢 Two adjacent `.btn:hover` rules
```css
.btn:hover { background: currentColor; }
.btn:hover { color: var(--c-cream); }
```

These could be a single block.

---

## 5. Performance

### 🟠 Hero image is oversized
`hero-wave.jpg` is 1500×2247 (287 KB). It's used as a `background-image` covering at most ~1440×900 on a desktop. Rough wins:
- Crop to 1600×1000 ≈ 100 KB
- Convert to WebP / AVIF with JPEG fallback ≈ 60 KB
- Add `<link rel="preload" as="image" href="...">` since this is the LCP candidate

### 🟠 Illustration PNGs are massively over-resolution
Rendered widths in the page vs. asset widths:

| Image | Rendered | Source | Wasted |
|---|---|---|---|
| `illus-figure-sage.png` | ~220 px | 1188 px | 5.4× over |
| `lgbtq-bubble.png` | ~224 px | 1080 px | 4.8× over |
| `illus-flowers-head.png` | ~320 px | 563 px | 1.8× over |
| `illus-book.png` | ~320 px | 500 px | 1.6× over |

Two strategies, ranked by effort vs. reward:
1. **SVG redraw** (best) — these are line drawings. Re-export as SVG and they become 5–10 KB each, scale infinitely, and stay crisp on retina screens. ~1 hr of designer time to redraw any 4 of them.
2. **Resize PNGs** to 600×600 max and run through a compressor (squoosh.app). Easy, ~10 minutes, ~80% file-size reduction.

### 🟡 No `width`/`height` on header/footer logo `<img>`
The `<img src="/assets/img/logo.png" alt="...">` in the header has no dimensions. Browser doesn't reserve space until the image loads, so the page reflows after first paint (Cumulative Layout Shift). Add `width="180" height="180"` or whatever the rendered size is.

### 🟡 Google Fonts loaded externally with 4 weights/styles
Cormorant Garamond is fetched in `400 italic`, `400 regular`, `500 italic`, `500 regular`. Audit which weights are actually used — likely only 2 of the 4. Self-hosting also saves a DNS+TLS round trip.

### 🟡 No favicon set generated
`<link rel="icon" href="/assets/img/logo.png">` uses a 500×500 PNG (46 KB). Browsers downscale for the 16×16 favicon spot. Generate proper sizes:
- `favicon.ico` (16×16, 32×32, 48×48 multi-res)
- `apple-touch-icon.png` (180×180)
- `favicon-32.png` (32×32)
- Optional `manifest.json` with maskable icons for PWA

### 🟢 No `<meta name="theme-color">`
One-line addition that tints the mobile Chrome address bar to match your palette:

```html
<meta name="theme-color" content="#fefdf8">
```

### 🟢 Font-display strategy
Currently `display=swap` — readable text appears immediately in fallback font, then swaps to Cormorant. The "swap" can be jarring on slow networks (FOUT). Consider `display=optional` for the script font specifically (decorative, layout doesn't depend on it) and `swap` for the body serif.

---

## 6. Forms & integrations

### 🟠 Form submission redirects to Formspree's domain after success
After clicking Send, the visitor lands on `formspree.io/thanks` rather than a friendly success message on franamar.co.za. Two options:
1. Add a `_next` hidden field: `<input type="hidden" name="_next" value="https://franamar.co.za/thanks/">`, then create `/thanks/index.html` with a "thank you, Fran will be in touch within 2 working days" message.
2. Submit via fetch and show an inline success state without leaving the page (~30 lines of JS).

Option 1 is simpler and doesn't require JS. I'd start there.

### 🟡 No client-side validation messaging
Browser default validation pops a tooltip in browser-native styling. Acceptable, but a designed "this field is required" inline message reads more polished.

### 🟡 No spam mitigation beyond honeypot
If the contact form starts getting spam, Formspree's reCAPTCHA integration is a one-flag fix. No need to act now — just know where to look.

### 🟢 Map iframe has no fallback
If Google's embed service is blocked (corporate networks, some VPNs), the section shows a blank rectangle. A fallback link "View on Google Maps" + the practice address as alternate text would be graceful.

---

## 7. Visual & UX (overlap with `DESIGN_NOTES.md`)

These were already noted in `DESIGN_NOTES.md` and remain unactioned per your instruction:

- Rust/orange band saturation
- Areas-of-interest list reads clinical
- Quote section needs more vertical breathing room
- Available services chair → consider 3-column offerings grid
- Therapeutic Approach paragraphs benefit from a one-line ethos
- LGBTQIA+ bubble feels bolted on
- Marquee removed (good!)
- Practitioner credentials above the fold
- Fees / booking specifics
- Sliding scale / medical aid statement
- Languages

No need to repeat — `DESIGN_NOTES.md` is the canonical list for those.

### 🟡 New visual notes I noticed during code review
- The hero `min-height: 70vh` plus sticky header means on short laptops the hero crowds the viewport. Try `min-height: clamp(420px, 60vh, 720px)`.
- The home Available Services section is just a centered chair illustration + one line + button. Visually thin. Either add the offering bullets (per design notes) or merge into the previous sage section with a sub-grid.
- The footer logo (small) and the header logo (larger) are the same PNG. Different visual roles deserve a different crop / treatment — header could use a horizontal "FRAN AMAR · Counselling Psychologist" inline lockup; footer keeps the full mark.
- On the contact page, the form takes up ~70% of the band's visual weight while the address text takes 30%. Consider equal columns or putting the address above and a wider form below.

---

## 8. Browser compatibility

### 🟢 `aspect-ratio` on `.map-frame` — Safari 15+
You're targeting modern browsers (per the original Squarespace site's audience). No action needed unless you support older iOS.

### 🟢 `clamp()` and `inset` — IE11 unsupported
You almost certainly don't care about IE11 in 2026. Mentioned for completeness.

### 🟢 No autoprefixer / build pipeline
You're hand-writing CSS without vendor prefixes. For modern features (grid, custom properties, clamp) prefixes aren't needed in 2026. If you ever use a feature with partial support, run through Autoprefixer once.

---

## 9. Testing & ops

### 🟢 No automated checks before deploy
For a 4-page static site this is fine, but a tiny CI step would help:
- HTML validation (`html5validator`)
- Broken-link check (`linkchecker` or `lychee`)
- Lighthouse score gate

GitHub Pages doesn't run CI on pushes by default, but a GitHub Action that runs these on PRs takes ~30 lines of YAML.

### 🟢 No analytics
Without analytics you have no idea if anyone reaches the site, how they got there, or which page converts. Privacy-respecting options:
- **Cloudflare Web Analytics** — free, no cookies, no banner needed under POPIA/GDPR
- **Plausible** — paid, simple
- **Umami** — self-hosted, free

One `<script>` tag in `<head>`. No consent banner needed because none use personal identifiers.

### 🟢 No backup of Formspree submissions
If Formspree disappears or rate-limits you, submissions vanish. Fran should configure Formspree to also forward to her email immediately (which she's doing via the notification email, but the dashboard is the only archive). Worth periodically exporting.

### 🟢 No uptime monitoring
GitHub Pages is highly reliable but not 100%. Free options like UptimeRobot ping the site every 5 min and email if down.

---

## 10. Quick wins — top-10 ordered

If you have **30 minutes**, do these in order:

1. **Fix mobile menu z-index** so it covers the header (one-line CSS). _2 min_
2. **Change `<span>` page titles to `<h1>`** on About and Services. _2 min_
3. **Fix cream-on-sage contrast** by darkening the sage background. _5 min_
4. **Cap header logo size** (`max-width: 7rem` + explicit width/height attrs). _3 min_
5. **Add Open Graph meta tags** + create one OG card image. _15 min_
6. **Add canonical link** to all four pages. _3 min_
7. **Remove `medicalSpecialty: "Psychiatric"`** from JSON-LD. _2 min_
8. **Verify the home-page map iframe renders** in a real browser. _2 min_
9. **Rewrite README.md** to reflect the static site. _5 min_

If you have **half a day**, also:

10. Add skip-to-content link + focus-visible styles + reduced-motion respect.
11. Resize/re-export images (PNGs to 600px max, hero to ≤1600×1000, optionally SVG line art).
12. Add a `/thanks/` page and Formspree `_next` redirect.
13. Add a privacy notice and update form copy to reference it.

If you have **a day**:

- Promote inline styles to CSS classes
- Build a simple include system for header/footer/JSON-LD partials
- Audit content per `DESIGN_NOTES.md` and decide what to act on
- Add Cloudflare Web Analytics
- Do a real Lighthouse / Wave / axe audit and act on findings
