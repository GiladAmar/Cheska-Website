// One-off: capture the mobile-menu-open state so we can visually verify it.
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:8765/', { waitUntil: 'networkidle' });
  await page.click('.js-burger');
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(__dirname, '..', 'reference', 'rebuild', 'mobile', 'menu-open.png'),
    fullPage: false,
  });
  await browser.close();
})();
