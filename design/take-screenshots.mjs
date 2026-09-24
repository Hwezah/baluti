// Full-page screenshots of every page at every breakpoint.
// Usage:  npm i -D playwright && npx playwright install chromium
//         npx serve site -l 5173        (in another terminal)
//         node take-screenshots.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:5173/';
const pages = ['Home', 'About', 'People', 'AttorneyBio', 'PracticeAreas', 'PracticeAreaDetail', 'Insights', 'Article', 'Contact'];
const breakpoints = [
  { name: '1-mobile-portrait',  width: 390,  height: 844 },
  { name: '2-mobile-landscape', width: 844,  height: 390 },
  { name: '3-tablet',           width: 1024, height: 768 },
  { name: '4-desktop',          width: 1440, height: 900 },
];

const browser = await chromium.launch();
for (const bp of breakpoints) {
  mkdirSync('screenshots/' + bp.name, { recursive: true });
  const mobile = bp.width < 900;
  const ctx = await browser.newContext({ viewport: { width: bp.width, height: bp.height }, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto(`${BASE}${p}.dc.html`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `screenshots/${bp.name}/${p}.png`, fullPage: true });
    console.log(bp.name, p);
  }
  await ctx.close();
}
await browser.close();
