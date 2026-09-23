#!/usr/bin/env node

import { createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const THEME_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = process.env.PROMO_FRAMES_DIR
  || path.join(os.homedir(), 'Projects/Bizmis/videos/promo-1');
const BASE_URL = process.env.PROMO_FRAMES_URL
  || 'https://meridian-consumer-electronics.myshopify.com/';
const VIEWPORT = {
  width: Number(process.env.PROMO_FRAMES_WIDTH || 1440),
  height: Number(process.env.PROMO_FRAMES_HEIGHT || 900),
};

const REST_PAD_MS = 100;

const FRAMES = [
  ['01-toggle-rest', 'Store at rest. Small Bizmis toggle, knob off.', 40],
  ['02-toggle-on', 'Knob on. Label goes orange: Agentic sales.', 40],
  ['02b-toggle-gone', 'Typical chatbot and the toggle are gone. Agentic sales is centered at its original size. It has not started scaling.', 40],
  ['02c-agentic-scaled', 'Agentic sales stays centered and has scaled up in Bizmis orange. Burst has not fired.', 40],
  ['03-orange-burst', 'Orange field just after the burst. Agentic sales is still expanding, now white.', 160],
  ['04-logo-docked', 'Orange Bizmis mark has slid into the left seat. Clerk is in on the right.', 1800],
  ['05-logo-gone', 'Mark has left the left seat. Clerk stays on the right.', 1200],
  ['06-your', 'First word: Your.', 40],
  ['07-your-store', 'Your store. Single normal space.', 40],
  ['08-salesperson', 'Your store salesperson. salesperson is one word. Period on this token.', 40],
  ['09-salesperson-struck', 'Orange strike through person only. Period is not struck.', 40],
  ['10-sales-agent', 'person rewritten as agent. salesagent, including the period, is Bizmis orange.', 40],
  ['11-built', 'First line gone. Built at the same type size.', 40],
  ['12-to', 'Only to, same type size.', 40],
  ['13-sell', 'Only sell. in Bizmis orange, same type size.', 40],
  ['14-sell-wave', 'sell. hold. Clerk is already in on the right.', 180],
  ['14b1-moments-grid', 'Beat 1, before the clerk narrows. Full 12-tile catalog, settled.', 0],
  ['14b2-moments-collapse', 'Beat 1, mid-collapse. Chosen tiles are traveling into the row. The other nine are fading.', 0],
  ['14b3-moments-row', 'Beat 1, settled. Triangle, circle, and square remain. Circle is in the middle.', 0],
  ['14c0-moments-choice-vo', 'Beat 2, before the clerk starts. The three tiles hold while the line plays.', 0],
  ['14c1-moments-choice-before-ticks', 'Beat 2. Side cards are out and the spec rows are up, before the ticks land.', 0],
  ['14c2-moments-choice', 'Beat 2, settled. Rows are ticked and the selected circle is lifted.', 0],
  ['14d0-moments-doubt-vo', 'Beat 3, before the clerk starts. Choice layout holds while the line plays.', 0],
  ['14d1-moments-doubt', 'Beat 3. Question bubbles orbit the chosen card.', 0],
  ['14d2-moments-vapor', 'Beat 3. Question bubbles are vaporizing. The cart has not counted an item yet.', 0],
  ['14d3-moments-close', 'Beat 3, settled. Card has a check. Cart count is 1.', 0],
  ['14e0-moments-extra-vo', 'Beat 4, before the clerk starts. Closed card and cart count 1 hold while the line plays.', 0],
  ['14e1-moments-addon', 'Beat 4. Plus sits between the main card and the arriving pentagon.', 0],
  ['14e2-moments-bundle', 'Beat 4, settled. Pentagon is docked with its outline. Cart count is 2.', 0],
  ['14f1-moments-contract', 'Wrap-up. The store is fading and the dot is forming where the products were.', 0],
  ['14f2-moments-dot', 'Wrap-up. The dot is reaching the clerk.', 0],
  ['14f3-moments-nod', 'Wrap-up, settled. Stage is empty. Clerk nods.', 0],
  ['15-see-yourself', 'sell. is gone. See for yourself. has settled in the same seat, about 60% of sell. size.', 0],
  ['16-see-stores', 'See for yourself. has left. Three store cards are fully on screen. Clerk stays in the moments seat, clear of the cards.', 2500],
  ['17-see-roulette', 'Carousel on a mid-list store. Side cards are fully visible. Clerk has morphed and has not moved seats.', 2500],
  ['18-see-meridian', 'Landed on Meridian. Name, sector, and both side cards are fully visible. Clerk stays clear of them.', 2500],
];

async function loadPlaywright() {
  if (process.env.PLAYWRIGHT_MODULE) return import(process.env.PLAYWRIGHT_MODULE);
  try {
    return await import('playwright');
  } catch {
    const require = createRequire(import.meta.url);
    return import(pathToFileURL(require.resolve('playwright')).href);
  }
}

function openingUrl() {
  const url = new URL(BASE_URL);
  url.searchParams.set('promo_video', 'opening');
  url.searchParams.set('v', `frames-${Date.now()}`);
  return url.toString();
}

function emptyOutDir() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const file of fs.readdirSync(OUT_DIR)) {
    if (file.endsWith('.png') || file === 'CAPTIONS.md') {
      fs.rmSync(path.join(OUT_DIR, file), { recursive: true, force: true });
    }
  }
  const leftover = path.join(OUT_DIR, 'promo-opening-frames');
  if (fs.existsSync(leftover)) fs.rmSync(leftover, { recursive: true, force: true });
}

function writeCaptions() {
  const body = [
    '# Bizmis promo opening storyboard',
    '',
    'Forced keyframes from `?promo_video=opening`. Read the PNGs in filename order.',
    '',
    'Layout: one centered 1100px two-column stage. Copy left, clerk right. Overflow hidden so the columns do not overlap.',
    '',
    'Type size is `clamp(4.4rem, 8.4vw, 7.2rem)`. Built / to / sell. are 2em of that line.',
    '',
    '## Frames',
    '',
    ...FRAMES.map(([id, caption]) => `- \`${id}.png\`: ${caption}`),
    '',
  ].join('\n');
  fs.writeFileSync(path.join(OUT_DIR, 'CAPTIONS.md'), body);
}

async function injectLocalOpeningCss(page) {
  await page.addStyleTag({ path: path.join(THEME_ROOT, 'assets/base.css') });
}

async function unlockStorefront(page) {
  if (!page.url().includes('/password')) return;
  const password = process.env.PROMO_STORE_PASSWORD || 'bizmis';
  const input = page.locator('input[name="password"]');
  await input.waitFor({ timeout: 5000 });
  await input.fill(password);
  await Promise.all([
    page.waitForURL((url) => !url.pathname.includes('/password'), {
      timeout: 10000,
      waitUntil: 'domcontentloaded',
    }),
    input.press('Enter'),
  ]);
}

async function waitForOpening(page) {
  await page.waitForFunction(() => {
    const api = window.__promoOpeningFrames;
    return !!(api && typeof api.showExportFrame === 'function');
  }, null, { timeout: 15000 });
}

async function revealForcedFaces(page) {
  await page.evaluate(() => {
    const fromFace = document.querySelector('[data-promo-face-from]');
    const toFace = document.querySelector('[data-promo-face-to]');
    if (fromFace && getComputedStyle(fromFace).visibility === 'visible') fromFace.style.opacity = '1';
    if (toFace && getComputedStyle(toFace).visibility === 'visible') toFace.style.opacity = '1';
  });
}

async function main() {
  emptyOutDir();

  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.PROMO_FRAMES_CHANNEL || 'chrome',
  });
  const page = await browser.newPage({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(openingUrl(), { waitUntil: 'domcontentloaded', timeout: 20000 });
  await unlockStorefront(page);
  if (!page.url().includes('promo_video=opening')) {
    await page.goto(openingUrl(), { waitUntil: 'domcontentloaded', timeout: 20000 });
  }
  await waitForOpening(page);
  await injectLocalOpeningCss(page);
  await page.waitForFunction(
    () => document.documentElement.classList.contains('is-promo-ready'),
    null,
    { timeout: 60000 },
  );

  for (const [id, , waitMs] of FRAMES) {
    const mode = await Promise.race([
      page.evaluate(async (frameId) => {
        const result = window.__promoOpeningFrames.showExportFrame(frameId);
        if (result && typeof result.then === 'function') {
          await result;
          return 'rest';
        }
        if (frameId === '02b-toggle-gone' || frameId === '02c-agentic-scaled') {
          document.querySelectorAll('.promo-opening__choice--left, .promo-opening__switch').forEach((node) => {
            node.style.transition = 'none';
            node.style.opacity = '0';
          });
        }
        if (frameId === '10-sales-agent') {
          const word = document.querySelector('.promo-opening__word--salesperson');
          const from = document.querySelector('.promo-opening__from');
          const to = document.querySelector('.promo-opening__to');
          [word, from, to].forEach((node) => {
            if (node) node.style.transition = 'none';
          });
          if (from) {
            from.style.width = '0px';
            from.style.opacity = '0';
          }
          if (to) {
            to.style.width = 'auto';
            to.style.opacity = '1';
          }
        }
        return 'timer';
      }, id),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Frame ${id} did not settle`)), 8000);
      }),
    ]);
    await revealForcedFaces(page);
    await page.waitForTimeout(mode === 'rest' ? REST_PAD_MS : waitMs);
    await page.screenshot({
      path: path.join(OUT_DIR, `${id}.png`),
      type: 'png',
    });
    process.stdout.write(`wrote ${id}.png\n`);
  }

  writeCaptions();
  await browser.close();
  process.stdout.write(`\n${FRAMES.length} frames + CAPTIONS.md -> ${OUT_DIR}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
