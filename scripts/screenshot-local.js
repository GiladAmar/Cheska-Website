// Snapshot the local rebuild for self-review.
// Usage: node scripts/screenshot-local.js  (server must be running on :8765)

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:8765';
const PAGES = [
  { slug: 'home', path: '/' },
  { slug: 'about', path: '/about/' },
  { slug: 'services', path: '/services/' },
  { slug: 'contact', path: '/contact/' },
  { slug: 'privacy', path: '/privacy/' },
  { slug: 'thanks', path: '/thanks/' },
  { slug: '404', path: '/404.html' },
];
const VPS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'mobile',  width: 390,  height: 844 },
];
const OUT = path.join(__dirname, '..', 'reference', 'rebuild');

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  for (const vp of VPS) {
    const dir = path.join(OUT, vp.name);
    fs.mkdirSync(dir, { recursive: true });
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    for (const p of PAGES) {
      await page.goto(BASE + p.path, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(dir, `${p.slug}.png`), fullPage: true });
      console.log(`  ${vp.name}  ${p.slug}`);
    }
    await ctx.close();
  }
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
