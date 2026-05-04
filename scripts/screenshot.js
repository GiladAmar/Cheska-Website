/**
 * screenshot.js — capture full-page screenshots of the live Squarespace site
 * at multiple viewport sizes, for use as design reference during the rebuild.
 *
 * Usage:
 *   node scripts/screenshot.js
 *
 * Output:
 *   ./reference/<viewport>/<page>.png
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.franamar.co.za';
const PAGES = [
  { slug: 'home', path: '/' },
  { slug: 'about', path: '/about' },
  { slug: 'services', path: '/services' },
  { slug: 'contact', path: '/contact' },
];
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];
const OUT_DIR = path.join(__dirname, '..', 'reference');

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  for (const vp of VIEWPORTS) {
    const dir = path.join(OUT_DIR, vp.name);
    fs.mkdirSync(dir, { recursive: true });
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });
    const page = await ctx.newPage();
    for (const p of PAGES) {
      const url = BASE_URL + p.path;
      console.log(`  ${vp.name}  ${url}`);
      await page.goto(url, { waitUntil: 'networkidle' });

      // Scroll through the page so Squarespace's intersection-observer
      // reveal animations fire for every section before we capture.
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          const step = window.innerHeight * 0.4;
          let y = 0;
          const max = document.body.scrollHeight;
          const tick = () => {
            window.scrollTo(0, y);
            y += step;
            if (y < max + step) setTimeout(tick, 150);
            else { window.scrollTo(0, 0); setTimeout(resolve, 400); }
          };
          tick();
        });
      });
      await page.waitForTimeout(1500);

      await page.screenshot({
        path: path.join(dir, `${p.slug}.png`),
        fullPage: true,
      });
    }
    await ctx.close();
  }
  await browser.close();
  console.log('\nDone. Screenshots in ./reference/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
