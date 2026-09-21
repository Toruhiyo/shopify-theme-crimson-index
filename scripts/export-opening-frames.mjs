#!/usr/bin/env node

import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

async function loadPlaywright() {
  if (process.env.PLAYWRIGHT_MODULE) return import(process.env.PLAYWRIGHT_MODULE);
  try {
    return await import('playwright');
  } catch {
    const require = createRequire(import.meta.url);
    return import(pathToFileURL(require.resolve('playwright')).href);
  }
}

const OUT_DIR = process.env.PROMO_FRAMES_DIR
  || path.join(os.homedir(), 'Projects/Bizmis/videos/promo-1');
const BASE_URL = process.env.PROMO_FRAMES_URL
  || 'https://meridian-consumer-electronics.myshopify.com/';
const VIEWPORT = {
  width: Number(process.env.PROMO_FRAMES_WIDTH || 1440),
  height: Number(process.env.PROMO_FRAMES_HEIGHT || 900),
};
const LIVE_LAYOUT_MARK = 'width: min(1100px, 100%)';
const LIVE_LAYOUT_TIMEOUT_MS = Number(process.env.PROMO_FRAMES_SYNC_MS || 180000);

const FRAMES = [
  ['01-toggle-rest', 'Store at rest. Small Bizmis toggle, knob off.'],
  ['02-toggle-on', 'Knob on. Label goes orange: Agentic sales.'],
  ['03-orange-burst', 'Orange burst from the knob. Full-field takeover.'],
  ['04-logo-docked', 'White field. Orange Bizmis mark in the copy seat. Clerk on the right.'],
  ['05-logo-gone', 'Mark has left. Copy seat empty. Clerk stays on the right.'],
  ['06-your', 'First word: Your.'],
  ['07-your-store', 'Your store. Single normal space.'],
  ['08-salesperson', 'Your store salesperson. salesperson is one word. Period on this token.'],
  ['09-salesperson-struck', 'Orange strike through person only. Period is not struck.'],
  ['10-sales-agent', 'person rewritten as agent. Period stays.'],
  ['11-built', 'First line gone. Built at the same type size.'],
  ['12-to', 'Only to, same type size.'],
  ['13-sell', 'Only sell. in Bizmis orange, same type size.'],
  ['14-sell-wave', 'sell. hold. Clerk waves once after park, still on the right.'],
];

function openingUrl() {
  const url = new URL(BASE_URL);
  url.searchParams.set('promo_video', 'opening');
  url.searchParams.set('v', `frames-${Date.now()}`);
  return url.toString();
}

function emptyOutDir() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function stylesheetHasLayout(page) {
  const hrefs = await page.$$eval('link[rel="stylesheet"]', (links) => links.map((link) => link.href));
  for (const href of hrefs) {
    try {
      const response = await page.request.get(href);
      const text = await response.text();
      if (text.includes(LIVE_LAYOUT_MARK) && text.includes('.promo-opening__stage')) return true;
    } catch {
      // Keep polling. Shopify may still be swapping the asset.
    }
  }
  return false;
}

async function waitForLiveLayout(page) {
  const deadline = Date.now() + LIVE_LAYOUT_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (await stylesheetHasLayout(page)) return;
    process.stdout.write('waiting for Shopify theme sync...\n');
    await page.waitForTimeout(8000);
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  }
  throw new Error(`Shopify theme CSS has not synced "${LIVE_LAYOUT_MARK}" yet`);
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

async function waitForOpening(page) {
  await page.waitForFunction(() => {
    const api = window.__promoOpeningFrames;
    return !!(api && typeof api.showExportFrame === 'function');
  }, null, { timeout: 45000 });
  await page.waitForSelector('#bizmis-avatar-embed', { timeout: 45000 });
  await page.waitForTimeout(2500);
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
  const url = openingUrl();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await waitForLiveLayout(page);
  await waitForOpening(page);

  for (const [id] of FRAMES) {
    const waitMs = await page.evaluate((frameId) => {
      return window.__promoOpeningFrames.showExportFrame(frameId);
    }, id);
    await revealForcedFaces(page);
    await page.waitForTimeout(Math.max(120, Number(waitMs) || 180));
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
