#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const OUT_DIR = process.env.PROMO_FRAMES_DIR
  || path.join(os.homedir(), 'Projects/Bizmis/promo-opening-frames');
const BASE_URL = process.env.PROMO_FRAMES_URL
  || 'https://meridian-consumer-electronics.myshopify.com/';
const VIEWPORT = {
  width: Number(process.env.PROMO_FRAMES_WIDTH || 1440),
  height: Number(process.env.PROMO_FRAMES_HEIGHT || 900),
};

const FRAMES = [
  ['01-toggle-rest', 'Store at rest. Small Bizmis toggle, knob off.'],
  ['02-toggle-on', 'Knob on. Label goes orange: Agentic sales.'],
  ['03-orange-burst', 'Orange burst from the knob. Full-field takeover.'],
  ['04-logo-docked', 'White field. Orange Bizmis mark in the text column. Clerk in the clerk column.'],
  ['05-logo-gone', 'Mark has left. Text column empty. Clerk stays in his column.'],
  ['06-your', 'First word: Your.'],
  ['07-your-store', 'Your store. Single normal space.'],
  ['08-salesperson', 'Your store salesperson. salesperson is one word. Period on this token.'],
  ['09-salesperson-struck', 'Orange strike through person only. Period is not struck.'],
  ['10-sales-agent', 'person rewritten as agent. Period stays.'],
  ['11-built', 'First line gone. Built at the same type size.'],
  ['12-to', 'Only to, same type size.'],
  ['13-sell', 'Only sell. in Bizmis orange, same type size.'],
  ['14-sell-wave', 'sell. hold. Clerk waves once after park, still in his column.'],
];

function openingUrl() {
  const url = new URL(BASE_URL);
  url.searchParams.set('promo_video', 'opening');
  url.searchParams.set('v', `frames-${Date.now()}`);
  return url.toString();
}

function writeCaptions() {
  const body = [
    '# Bizmis promo opening storyboard',
    '',
    'Forced keyframes from `?promo_video=opening`. Read the PNGs in filename order.',
    '',
    'Layout: text column 8%–52% of the viewport, clerk column 56%–92%. Clerk is centred in his column. Columns do not overlap.',
    '',
    'Type size is fitted so the longest first-build line (`Your store salesperson.`) fills the text column. Built / to / sell. use that same size.',
    '',
    '## Frames',
    '',
    ...FRAMES.map(([id, caption]) => `- \`${id}.png\` — ${caption}`),
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

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const file of fs.readdirSync(OUT_DIR)) {
    if (file.endsWith('.png')) fs.unlinkSync(path.join(OUT_DIR, file));
  }

  const url = openingUrl();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await waitForOpening(page);

  for (const [id] of FRAMES) {
    const waitMs = await page.evaluate((frameId) => {
      return window.__promoOpeningFrames.showExportFrame(frameId);
    }, id);
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
