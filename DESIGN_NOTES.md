# Design notes

Suggestions noted while rebuilding the site as static HTML. **Nothing here has been applied to content** — the rebuild matches the original site's content and section order. Use this as a punch list for a future content/UX pass when you're ready.

---

## Visual / UX

### "Areas of interest" rust block
- The rust/orange band (`#a64019`) is visually heavy and dominates the home page. Two cheaper alternatives that keep the warmth: (a) lower the saturation by ~20% for a terracotta tone, (b) keep the strong color but only as an accent (heading underline, callout card) rather than a full-bleed band.
- The list of conditions reads as a wall of clinical labels. Short framing copy above the list ("If any of these resonate, therapy can help — common reasons people start work with me include:") would soften it without losing SEO value.

### Hero typography
- The `FRAN AMAR` letterspaced caps over the wave is striking but the script tagline `Counselling Psychologist` overlays the wave at low contrast in places. A subtle dark gradient overlay at the bottom of the hero would lift legibility without needing to change the typography.

### Quote section
- The pull quote `"It is a joy to be hidden, and disaster not to be found"` (Winnicott) currently sits in a thin band between two heavier sections and gets visually squeezed. Either give it more vertical room (so it breathes), or fold it into the bottom of the About preview as a margin quote. Right now it reads like a transition, not a moment.

### Available services (chair illustration)
- The chair line drawing on its own with `Individual psychotherapy` underneath understates what's offered. Worth listing 3–4 anchor offerings as a small grid — short labels with icons — so a visitor can scan rather than have to scroll into the Services page.

### About page — therapeutic-approach section
- Currently three dense paragraphs. Consider pulling out a one-line ethos at the top (e.g. "Integrative, with roots in psychodynamic theory and attachment.") and letting the paragraphs explain. Skim-readers benefit; deep-readers lose nothing.
- The "LGBTQA+ affirming psychologist" speech bubble feels bolted on. Either elevate it to a clear "Who I work with" mini-section near the top of About, or remove it from the bottom and add it to a values strip on the home page.

### Services page — list of conditions
- Same as Areas of interest: long bulleted list reads clinical. A two-column layout breaks up the visual weight at desktop sizes.

### Contact page
- The `Reaching out for help can feel daunting…` marquee scrolls across the back of the form on the original. It's distracting against the form fields. A static reassurance line above the form ("Reaching out can feel daunting — a short message is enough to start") would do the same work without motion.

---

## Content / SEO / Trust

- **Practitioner credentials**: HPCSA number is in the footer/About copy but not visible above the fold on the home page. A small "HPCSA-registered Counselling Psychologist · PS0156051" line under the hero would build trust on first impression.
- **Fees & booking**: nothing on the site indicates session length, fee range, or how to book a first session. Even "60-minute sessions, fees on request" plus a clear booking pathway converts more of the contact form traffic.
- **Specialisations as anchored sections**: if SEO matters, each "area of interest" deserves a paragraph (anxiety, depression, etc.) for search, not just a list item. Optional — depends on whether organic traffic is a goal.
- **Sliding scale / medical aid**: South African visitors will look for this. One sentence on the Services page covers it.
- **Languages**: not stated — worth a one-liner if Fran works in more than English.

---

## Accessibility

- The rust/orange section uses light text on a saturated background — currently passes WCAG AA at body size but fails at smaller text. Worth a contrast audit if any captions or fine print sit on rust.
- The contact form's `required` indicator currently relies only on color. The rebuild adds a `*` and `aria-required` already; mentioning here so it's not lost in future redesigns.
- The script font for the tagline has poor legibility for low-vision users at small sizes — keep it decorative, never use it for primary navigation or body content.

---

## Technical (post-launch)

- **Open Graph / social cards**: the original has SQS-generated meta tags. The rebuild should add proper OG image, title, description so links shared on WhatsApp / Facebook render with a card.
- **Analytics**: if you want to know how the site performs after migration, drop in a privacy-respecting analytics script (Plausible, Umami, Cloudflare Web Analytics) — a single line, no cookies, no consent banner needed.
- ~~**Structured data**: a `Person` + `MedicalBusiness` JSON-LD block helps search engines understand the practice.~~ Done — `Person` + `Psychologist` graph in every page's `<head>`.
- ~~**Sitemap & robots.txt**: trivial to add at root, helps indexing.~~ Done — `/sitemap.xml` + `/robots.txt`.
