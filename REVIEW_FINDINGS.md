# Review Findings

Date: 2026-05-04

This document records the current actionable findings from the latest site review. It is intentionally narrower than `REVIEW.md`: the goal here is to capture the concrete issues already identified, explain why they matter, and give clear recommendations for what to do next.

## Priority Order

1. Resolve the audience-scope inconsistency.
2. Add practical booking information to the services journey.
3. Reduce privacy-sensitive third-party dependencies.
4. Improve long-form text contrast on rose backgrounds.
5. Fix the stale `aria-describedby` cleanup in form validation.

---

## 1. [P1] Conflicting client age scope

Files involved:
- `about/index.html:142-145`
- `index.html:7`
- `index.html:133`
- `services/index.html:152`

### Issue

The About page says Fran works with adolescents and adults, while the home and services pages describe the offer as adult-only. A prospective client should not have to infer whether they are eligible for care. On a psychotherapy site, ambiguity at this stage is not a cosmetic issue; it weakens trust before the visitor reaches out.

### Why it matters

- A visitor seeking therapy for themselves, or for an older teen, may hesitate if the offer seems inconsistent.
- Inconsistency across pages makes the practice look less deliberate, even when the underlying service is sound.
- Search metadata and page copy can end up targeting different queries, which weakens message clarity.

### Recommendation

Choose one audience definition and apply it consistently everywhere the site describes who the practice is for.

There are two acceptable directions:

1. If the practice is adults-only:
- Change the About page so it no longer mentions adolescents.
- Keep the home and services copy focused on adults.
- Make the wording exact and stable, for example: "I offer individual psychotherapy for adults."

2. If the practice serves adults and adolescents:
- Update the home page metadata and services copy so they explicitly include adolescents.
- Add one plain-language line that clarifies what "adolescents" means in practice, for example whether this refers to older teens, and whether parents should make first contact.
- Keep that wording consistent in hero-adjacent copy, services copy, and contact-page context.

### Detailed implementation guidance

- Treat the audience definition as a content constant, not page-by-page phrasing.
- Update both visible copy and metadata. The visible copy affects trust; the metadata affects search results and link previews.
- Prefer one clear sentence used repeatedly over several slightly different variants.

### Suggested content pattern

If adults-only:

> I offer individual psychotherapy for adults navigating emotional difficulties, life transitions, and mental health concerns.

If adults and adolescents:

> I offer individual psychotherapy for adults and adolescents navigating emotional difficulties, life transitions, and mental health concerns.

Then follow with one clarifying line if needed:

> If you are enquiring for an adolescent, you are welcome to make initial contact to discuss fit and next steps.

### Completion check

This finding is resolved only when the same audience scope appears consistently in:
- page descriptions and titles where relevant
- home-page about copy
- services-page overview copy
- about-page practitioner overview

---

## 2. [P1] Services page omits booking basics

Files involved:
- `services/index.html:150-175`

### Issue

The Services page explains psychotherapy conceptually, but it does not answer the practical questions a high-intent visitor usually asks before making contact. The result is avoidable friction: someone may feel positively about Fran's approach but still leave because the next step remains vague.

### Why it matters

- A brochure site for a private practice should reduce uncertainty, not just describe credentials and philosophy.
- Visitors who are ready to book are often looking for practical reassurance, not another general explanation of why therapy matters.
- Missing basics increase form drop-off because the user has to ask for information that could have been provided upfront.

### Recommendation

Add a compact, plainly written "Before you get in touch" or "Booking information" section on the Services page, positioned close to the CTA.

This section should answer the minimum practical questions:

- Session length
- In-person vs online format
- Online platform used
- Fee range or "fees on request" if exact pricing should not be published
- Medical aid / reimbursement position, if relevant
- Sliding-scale availability, if relevant
- Languages offered
- What the first session is for
- Typical response time after enquiry

### Detailed implementation guidance

Do not bury this information in long paragraphs. Present it in a structure that is fast to scan.

A good format for this site would be:

- one short introductory sentence
- a 5-8 item key-details list or card grid
- then the booking CTA

Example structure:

#### Before you get started

- Sessions are 50 minutes.
- Appointments are available in person in Camps Bay and online.
- Online sessions take place via a secure video platform.
- Fees: [insert actual policy].
- Medical aid / reimbursement: [insert actual policy].
- Initial contact can be brief; the first session helps us explore what support you are looking for.
- Enquiries are usually answered within [insert actual timeframe].

### Content strategy note

Not every detail has to be published if the practice prefers discretion, but the page should still remove the biggest unknowns. If exact fees should stay private, say so explicitly instead of omitting the topic entirely.

Bad:

> Book a session

Good:

> Sessions are 50 minutes. Fees are available on request. Enquiries are usually answered within 2-3 working days.

### Recommended placement

Place the practical details after the main service explanation and before the final CTA. That preserves the warm tone of the page while ensuring the call to action lands after the user has the information needed to act.

### Completion check

This finding is resolved when a ready-to-book visitor can answer the question "What happens if I contact this practice?" without leaving the Services page.

---

## 3. [P2] Third-party embeds weaken privacy posture

Files involved:
- `partials/head-fonts.html:1-3`
- `index.html:197-207`

### Issue

The site loads Google Fonts on every page and embeds Google Maps on the home page. For many sites this is an ordinary tradeoff. For a psychotherapy practice, it is more sensitive because visitors may be seeking help for private, emotionally charged reasons. The current setup sends request metadata to Google before the visitor has chosen to interact with a third party.

### Why it matters

- Trust-sensitive services benefit from minimizing passive third-party disclosure.
- A privacy-conscious visitor may notice the external dependencies and interpret them as a mismatch with the tone of care and discretion.
- The map embed is also operationally brittle: embedded third-party UI is harder to control visually and can fail in automation or stricter browsing environments.

### Recommendation

Reduce third-party exposure on first load.

Recommended approach:

1. Self-host the fonts used by the site.
2. Replace the embedded Google Map with a static map image or location card plus an external "Open in Google Maps" link.
3. Add a short privacy note near the contact form explaining how enquiry data is used and who receives it.

### Detailed implementation guidance

#### Fonts

- Export the required font files as `.woff2`.
- Serve them from `assets/fonts/`.
- Replace the Google Fonts include with local `@font-face` declarations in `site.css`.
- Keep fallback fonts in place so the site remains resilient if custom fonts fail to load.

This is a particularly good fit for the current architecture because the site is already static and simple.

#### Map

Prefer one of these patterns:

1. Static image plus link
- Show a styled image or simplified map graphic.
- Link out to Google Maps only when the visitor chooses to click.

2. Address card without map
- Show the address and accessibility note.
- Provide a "Directions" or "Open in Maps" link.

This preserves the practical benefit while eliminating passive third-party loading.

#### Form privacy note

Add one short line beneath the form or submit button, for example:

> By submitting this form, you consent to being contacted about psychotherapy services. Your details will only be used for responding to your enquiry.

This does not replace a full privacy policy, but it materially improves clarity.

### Design note

Privacy improvements should not make the site colder. The right goal is quiet restraint: fewer external dependencies, a little more clarity, and less invisible data sharing.

### Completion check

This finding is resolved when the default page load no longer depends on Google-hosted fonts or a live map embed, and the form gives visitors a clear privacy cue.

---

## 4. [P2] Rose body text is below AA contrast

Files involved:
- `assets/css/site.css:13-15`

### Issue

The current rose-section body text uses `--c-rust-deep` on `--c-rose`. That pairing is visually aligned with the palette, but it falls slightly below WCAG AA for normal text at roughly `4.34:1`. This is most relevant in sections where users need to read paragraphs, contact information, or instructions rather than just admire the aesthetic.

### Why it matters

- Slight contrast misses are easy to dismiss in design review and still meaningfully affect readability.
- Therapy sites often attract users who are stressed, tired, or overwhelmed; readability should be biased toward ease, not delicacy.
- Contact and location information are operational content. Those sections should be especially easy to read.

### Recommendation

Use a stronger text color for long-form copy on rose backgrounds, while keeping the current warmer tone for large headings if desired.

The best solution is to separate accent color from reading color.

### Detailed implementation guidance

Recommended pattern:

- Keep `--c-rust-deep` or a similar warm tone for rose-section headings.
- Introduce a darker variable for rose-section body copy.
- Apply the darker variable to paragraph text, list items, and contact details inside rose sections.

A candidate body-text color that clears AA against `#dfb5a3` is:

- `#7f2f11` at roughly `4.87:1`

Stronger alternatives are also acceptable if you want more cushion:

- `#782b10`
- `#70260d`

### Suggested CSS direction

Instead of treating the entire rose section as one text color, split it:

- display text color
- body copy color

That gives more control and avoids sacrificing the overall look.

Conceptually:

```css
:root {
  --c-rose: #dfb5a3;
  --c-rose-heading: #8a3514;
  --c-rose-body: #7f2f11;
}
```

Then use the heading tone for `.section--rose h1, h2, h3` and the darker body tone for paragraph text and links.

### Design note

The goal is not to make the site harsher. It is to make the elegant palette work harder for reading tasks. If a section contains long-form copy, contact details, or instructions, readability should win over subtlety.

### Completion check

This finding is resolved when long-form text on rose backgrounds clears AA and still feels visually consistent with the site's brand palette.

---

## 5. [P3] Cleared field errors leave stale descriptions

Files involved:
- `assets/js/site.js:79-82`

### Issue

When a field becomes valid again, the script removes the visible error node but does not clear the associated `aria-describedby`. That leaves the field referencing an element that no longer exists.

### Why it matters

- Screen readers rely on these relationships to announce context accurately.
- Broken ARIA references create avoidable noise in the accessibility tree.
- This is a small bug, but it affects the one component on the site where accessibility clarity matters most: the contact form.

### Recommendation

Update the error-clearing logic so it removes the ARIA reference associated with the deleted error message.

### Detailed implementation guidance

The minimal safe fix for the current code is:

- remove the error node
- remove `aria-describedby` when that node was the only described element

Because the current implementation only sets `aria-describedby` for the generated error message, removing the attribute entirely is safe today.

If the form later gains persistent helper text, then the implementation should become slightly more robust:

- split the `aria-describedby` value into IDs
- remove only the error ID
- preserve any unrelated helper-text IDs

### Suggested implementation approach

Current-safe version:

```js
field.removeAttribute('aria-describedby');
```

Future-proof version:

```js
const ids = (field.getAttribute('aria-describedby') || '')
  .split(/\s+/)
  .filter(Boolean)
  .filter((id) => id !== err.id);

if (ids.length) field.setAttribute('aria-describedby', ids.join(' '));
else field.removeAttribute('aria-describedby');
```

### Completion check

This finding is resolved when clearing an error removes both the rendered message and the stale accessibility reference.

---

## Recommended Follow-Up

After the five findings above are addressed, the next most valuable pass should focus on conversion clarity rather than more technical polish.

Recommended next pass:

1. Tighten the home-page hero so it states the offer and the next step more explicitly.
2. Add one practical trust block covering session format, response time, and first-contact expectations.
3. Review whether the quote and sparse services band are earning their space on the home page.

The current site already has a good baseline: it is lightweight, distinctive, and structurally simple. The biggest gains now are in message precision, trust signaling, and reducing friction at the point of contact.
