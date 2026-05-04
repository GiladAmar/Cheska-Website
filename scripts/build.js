// Inject shared partials into each page between marker comments.
// Run with: node scripts/build.js (or `npm run build`).
//
// Usage in source HTML:
//   <!-- include:header -->
//   <!-- /include -->
//
// Everything between markers is replaced with the named partial. Markers stay
// in place so re-runs are idempotent.
//
// Available partials: header, footer, jsonld, head-fonts.
// 404.html doesn't include jsonld; that's fine — its file just has no marker.
//
// As a small convenience, after injecting the header the script adds
// aria-current="page" to the nav link matching the page's path.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const PAGES = [
  { src: 'index.html',          currentPath: null },        // home — no nav highlight
  { src: 'about/index.html',    currentPath: '/about/' },
  { src: 'services/index.html', currentPath: '/services/' },
  { src: 'contact/index.html',  currentPath: '/contact/' },
  { src: '404.html',            currentPath: null },
  { src: 'thanks/index.html',   currentPath: null },        // optional, only if it exists
];

const PARTIALS = ['header', 'footer', 'jsonld', 'head-fonts'];

const partialContent = Object.fromEntries(
  PARTIALS.map((name) => {
    const file = path.join(ROOT, 'partials', `${name}.html`);
    return [name, fs.readFileSync(file, 'utf8').trimEnd()];
  })
);

function injectAriaCurrent(html, currentPath) {
  if (!currentPath) return html;
  // Add aria-current="page" to nav anchors pointing at currentPath that
  // don't already have it. Matches both desktop nav and mobile menu.
  return html.replace(
    new RegExp(`<a href="${currentPath}"(?![^>]*aria-current)`, 'g'),
    `<a href="${currentPath}" aria-current="page"`
  );
}

function buildOne(page) {
  const file = path.join(ROOT, page.src);
  if (!fs.existsSync(file)) return false;

  let html = fs.readFileSync(file, 'utf8');

  for (const name of PARTIALS) {
    const re = new RegExp(
      `(<!-- include:${name} -->)[\\s\\S]*?(<!-- /include -->)`,
      'g'
    );
    html = html.replace(re, `$1\n${partialContent[name]}\n$2`);
  }

  html = injectAriaCurrent(html, page.currentPath);

  fs.writeFileSync(file, html);
  return true;
}

let built = 0;
for (const p of PAGES) {
  if (buildOne(p)) built += 1;
}
console.log(`Built ${built} page${built === 1 ? '' : 's'}.`);
