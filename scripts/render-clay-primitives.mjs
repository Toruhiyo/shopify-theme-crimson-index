import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const THEME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WIDGET = path.resolve(THEME, '../../trujilloai-bizmis-widget');
const OUT = path.join(THEME, 'assets');
const SIZE = 512;
const KINDS = ['sphere', 'cube', 'cylinder', 'cone', 'capsule'];

const playwright = await import('/Users/toruhiyo/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs');
const threeSrc = fs.readFileSync(path.join(WIDGET, 'node_modules/three/build/three.module.js'));

const browser = await playwright.chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 640, height: 640 } });
await page.route('https://clay.local/three.module.js', (route) => route.fulfill({
  status: 200,
  contentType: 'text/javascript',
  body: threeSrc,
}));
await page.setContent(`<!doctype html><canvas id="c" width="${SIZE}" height="${SIZE}"></canvas><script type="module">
import * as THREE from 'https://clay.local/three.module.js';

const SIZE = ${SIZE};
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setSize(SIZE, SIZE, false);
renderer.setPixelRatio(1);
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
const scene = new THREE.Scene();
scene.add(new THREE.AmbientLight(0xffffff, 0.58));
scene.add(new THREE.HemisphereLight(0xffffff, 0xf9a353, 0.24));

const key = new THREE.DirectionalLight(0xffffff, 1.32);
key.position.set(-4.5, 6, 5.5);
scene.add(key);

const fill = new THREE.DirectionalLight(0xffffff, 0.12);
fill.position.set(5.5, 2, 4);
scene.add(fill);

const rim = new THREE.DirectionalLight(0xc5d2f4, 0.18);
rim.position.set(1.4, 3.2, -6);
scene.add(rim);


const clay = new THREE.MeshStandardMaterial({
  color: 0xE4E0DA,
  roughness: 0.94,
  metalness: 0,
});

function geometry(kind) {
  if (kind === 'sphere') return new THREE.SphereGeometry(1, 64, 48);
  if (kind === 'cube') return new THREE.BoxGeometry(1, 1, 1);
  if (kind === 'cylinder') return new THREE.CylinderGeometry(0.72, 0.72, 1.35, 48);
  if (kind === 'cone') return new THREE.ConeGeometry(0.86, 1.55, 48);
  return new THREE.CapsuleGeometry(0.46, 0.85, 16, 32);
}

function sit(mesh) {
  mesh.scale.setScalar(1);
  mesh.position.set(0, 0, 0);
  mesh.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(mesh);
  const size = new THREE.Vector3();
  box.getSize(size);
  const span = Math.max(size.x, size.y, size.z);
  mesh.scale.setScalar(1.85 / span);
  mesh.updateMatrixWorld(true);
  const seated = new THREE.Box3().setFromObject(mesh);
  mesh.position.y -= seated.min.y;
}

const camera = new THREE.PerspectiveCamera(18, 1, 0.1, 40);
const elevation = THREE.MathUtils.degToRad(15);
const azimuth = THREE.MathUtils.degToRad(38);
const distance = 9.5;
const look = new THREE.Vector3(0, 0.78, 0);
camera.position.set(
  look.x + Math.sin(azimuth) * Math.cos(elevation) * distance,
  look.y + Math.sin(elevation) * distance,
  look.z + Math.cos(azimuth) * Math.cos(elevation) * distance,
);
camera.lookAt(look);

async function bakeContact(url) {
  const img = new Image();
  img.src = url;
  await img.decode();
  const src = document.createElement('canvas');
  src.width = SIZE;
  src.height = SIZE;
  const read = src.getContext('2d', { willReadFrequently: true });
  read.drawImage(img, 0, 0);
  const pixels = read.getImageData(0, 0, SIZE, SIZE).data;
  let minX = SIZE;
  let maxX = 0;
  let minY = SIZE;
  let maxY = 0;
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (pixels[(y * SIZE + x) * 4 + 3] < 24) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (minX < 8 || maxX > SIZE - 9 || minY < 8 || maxY > SIZE - 9) {
    throw new Error('clay clipped ' + [minX, minY, maxX, maxY].join(','));
  }
  const blob = document.createElement('canvas');
  blob.width = 128;
  blob.height = 64;
  const blobDraw = blob.getContext('2d');
  const blobShade = blobDraw.createRadialGradient(64, 32, 0, 64, 32, 60);
  blobShade.addColorStop(0, 'rgba(28,25,23,0.34)');
  blobShade.addColorStop(0.5, 'rgba(28,25,23,0.1)');
  blobShade.addColorStop(1, 'rgba(28,25,23,0)');
  blobDraw.fillStyle = blobShade;
  blobDraw.fillRect(0, 0, 128, 64);
  const out = document.createElement('canvas');
  out.width = SIZE;
  out.height = SIZE;
  const ctx = out.getContext('2d');
  const radiusX = (maxX - minX) * 0.42;
  const radiusY = Math.max(14, radiusX * 0.18);
  const centerX = (minX + maxX) / 2;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(blob, centerX - radiusX, maxY - radiusY, radiusX * 2, radiusY * 2);
  ctx.globalAlpha = 1;
  ctx.drawImage(img, 0, 0);
  return out.toDataURL('image/png');
}

const shots = {};
for (const kind of ${JSON.stringify(KINDS)}) {
  const mesh = new THREE.Mesh(geometry(kind), clay);
  sit(mesh);
  scene.add(mesh);
  renderer.render(scene, camera);
  const probe = new THREE.Vector3(0, 0.9, 0).project(camera);
  if (Math.abs(probe.x) > 0.08 || Math.abs(probe.y) > 0.2) {
    throw new Error(kind + ' off center ' + probe.x.toFixed(3) + ' ' + probe.y.toFixed(3));
  }
  shots[kind] = await bakeContact(canvas.toDataURL('image/png'));
  scene.remove(mesh);
  mesh.geometry.dispose();
}
window.__clay = shots;
</script>`, { waitUntil: 'load' });

await page.waitForFunction(() => window.__clay?.sphere, null, { timeout: 20000 });
const shots = await page.evaluate(() => window.__clay);
for (const kind of KINDS) {
  const file = path.join(OUT, `promo-clay-${kind}.png`);
  fs.writeFileSync(file, Buffer.from(shots[kind].split(',')[1], 'base64'));
  console.log(kind, fs.statSync(file).size);
}

const filters = {
  sand: 'sepia(0.42) hue-rotate(12deg) saturate(0.3)',
  blush: 'sepia(0.38) hue-rotate(336deg) saturate(0.34)',
  sage: 'sepia(0.2) hue-rotate(78deg) saturate(0.28)',
  stone: 'sepia(0.1) hue-rotate(18deg) saturate(0.16)',
};
const sheet = await page.evaluate(async ({ sphereUrl, filters: tintFilters }) => {
  const img = new Image();
  img.src = sphereUrl;
  await img.decode();
  const shelves = ['#F4EFE7', '#F5ECE8', '#EEF1EA', '#EFEEEA'];
  const names = Object.keys(tintFilters);
  const canvas = document.createElement('canvas');
  const cell = 180;
  canvas.width = cell * names.length;
  canvas.height = cell;
  const ctx = canvas.getContext('2d');
  names.forEach((name, index) => {
    ctx.filter = 'none';
    ctx.fillStyle = shelves[index];
    ctx.fillRect(index * cell, 0, cell, cell);
    ctx.filter = tintFilters[name];
    const size = cell * 0.6;
    ctx.drawImage(img, index * cell + (cell - size) / 2, (cell - size) / 2, size, size);
  });
  return canvas.toDataURL('image/png');
}, { sphereUrl: shots.sphere, filters });
fs.writeFileSync('/tmp/clay-tints.png', Buffer.from(sheet.split(',')[1], 'base64'));
console.log(filters);
await browser.close();
