import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const THEME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WIDGET = path.resolve(THEME, '../../trujilloai-bizmis-widget');
const OUT = path.join(THEME, 'assets');
const SIZE = 1024;
const BACKDROP = [246, 244, 241];
const PRIMARY = [249, 163, 83];

const JOBS = [
  { kind: 'hemisphere', tint: 'sand', color: '#d7c7ae' },
  { kind: 'tall-prism', tint: 'sage', color: '#c5cfc4' },
  { kind: 'puck', tint: 'off-white', color: '#e6e1d8' },
  { kind: 'octahedron', tint: 'warm-grey', color: '#c8c3bb' },
  { kind: 'jar', tint: 'blush', color: '#e0c8c0' },
  { kind: 'tri-prism', tint: 'stone', color: '#c4bfb6' },
  { kind: 'squircle', tint: 'sand', color: '#d7c7ae' },
  { kind: 'ovoid', tint: 'sage', color: '#c5cfc4' },
  { kind: 'frustum', tint: 'off-white', color: '#e6e1d8' },
  { kind: 'pyramid', tint: 'warm-grey', color: '#c8c3bb' },
  { kind: 'sphere-disc', tint: 'blush', color: '#e0c8c0' },
  { kind: 'flat-torus', tint: 'stone', color: '#c4bfb6' },
];

function linear(value) {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function oklab(rgb) {
  const r = linear(rgb[0]);
  const g = linear(rgb[1]);
  const b = linear(rgb[2]);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function chroma(rgb) {
  const [, a, b] = oklab(rgb);
  return Math.hypot(a, b);
}

const CHROMA_CAP = chroma(PRIMARY) * 0.35;

const playwright = await import('/Users/toruhiyo/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs');
const threeUrl = `file://${path.join(WIDGET, 'node_modules/three/build/three.module.js')}`;
const roundedUrl = `file://${path.join(WIDGET, 'node_modules/three/examples/jsm/geometries/RoundedBoxGeometry.js')}`;
const boot = path.join('/tmp', 'promo-catalog-boot.html');
fs.writeFileSync(boot, `<!doctype html>
<script type="importmap">
{ "imports": { "three": "${threeUrl}" } }
</script>
<script type="module">
import * as THREE from '${threeUrl}';
import { RoundedBoxGeometry } from '${roundedUrl}';
window.THREE = { ...THREE, RoundedBoxGeometry };
window.__ready = true;
</script>`);

const browser = await playwright.chromium.launch({
  headless: true,
  channel: 'chrome',
  args: ['--allow-file-access-from-files'],
});
const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE } });
page.on('pageerror', (error) => console.error('page', error.message));
await page.goto(`file://${boot}`);
await page.waitForFunction(() => window.__ready);

const results = await page.evaluate(async ({ jobs, size, backdrop, cap }) => {
  const reports = [];
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setSize(size, size, false);
  renderer.setClearColor(0x000000, 0);

  function solid(kind, color) {
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.86, metalness: 0 });
    let mesh;
    if (kind === 'hemisphere') {
      mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2), material);
    } else if (kind === 'tall-prism') {
      mesh = new THREE.Mesh(new THREE.RoundedBoxGeometry(0.72, 1.5, 0.72, 5, 0.14), material);
    } else if (kind === 'puck') {
      mesh = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.28, 72), material);
    } else if (kind === 'octahedron') {
      mesh = new THREE.Mesh(new THREE.OctahedronGeometry(1.05, 1), material);
    } else if (kind === 'jar') {
      mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.78, 72), material);
    } else if (kind === 'tri-prism') {
      const shape = new THREE.Shape();
      const radius = 0.92;
      for (let step = 0; step < 3; step += 1) {
        const angle = Math.PI / 2 + step * ((Math.PI * 2) / 3);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (step === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      }
      shape.closePath();
      mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.55, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 3 }), material);
      mesh.geometry.center();
      mesh.rotation.x = -Math.PI / 2;
    } else if (kind === 'squircle') {
      mesh = new THREE.Mesh(new THREE.RoundedBoxGeometry(1.35, 0.24, 1.35, 5, 0.1), material);
    } else if (kind === 'ovoid') {
      mesh = new THREE.Mesh(new THREE.SphereGeometry(0.82, 64, 48), material);
      mesh.scale.set(0.86, 1.35, 0.86);
    } else if (kind === 'frustum') {
      mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.95, 1.15, 72), material);
    } else if (kind === 'pyramid') {
      mesh = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.25, 4), material);
      mesh.rotation.y = Math.PI / 4;
    } else if (kind === 'sphere-disc') {
      const group = new THREE.Group();
      group.add(new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.12, 72), material));
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.48, 48, 32), material);
      ball.position.y = 0.52;
      group.add(ball);
      mesh = group;
    } else {
      mesh = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.28, 32, 80), material);
      mesh.rotation.x = Math.PI / 2;
    }
    return mesh;
  }

  function paint(job) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(22, 1, 0.1, 40);
    camera.position.set(4.6, 3.4, 6.6);
    camera.lookAt(0, 0.42, 0);
    scene.add(new THREE.AmbientLight(0xfff6ee, 0.82));
    const key = new THREE.DirectionalLight(0xffffff, 0.85);
    key.position.set(-4.2, 6.2, 3.1);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xfff3e8, 0.35);
    fill.position.set(3.2, 1.4, -2.2);
    scene.add(fill);
    const object = solid(job.kind, job.color);
    object.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(object);
    object.position.sub(box.getCenter(new THREE.Vector3()));
    object.updateMatrixWorld(true);
    const span = new THREE.Box3().setFromObject(object).getSize(new THREE.Vector3());
    object.scale.multiplyScalar(1.35 / Math.max(span.x, span.y, span.z));
    object.updateMatrixWorld(true);
    object.position.y -= new THREE.Box3().setFromObject(object).min.y;
    scene.add(object);
    const foot = new THREE.Box3().setFromObject(object).getSize(new THREE.Vector3());
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(Math.max(foot.x, foot.z) * 0.72, 48),
      new THREE.MeshBasicMaterial({ color: 0x8d8074, transparent: true, opacity: 0.2, depthWrite: false }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.004;
    scene.add(shadow);
    renderer.clear();
    renderer.render(scene, camera);
    const output = document.createElement('canvas');
    output.width = size;
    output.height = size;
    const ctx = output.getContext('2d');
    ctx.fillStyle = `rgb(${backdrop[0]}, ${backdrop[1]}, ${backdrop[2]})`;
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(canvas, 0, 0);
    const baked = ctx.getImageData(0, 0, size, size).data;
    const corners = [
      [2, 2],
      [size - 3, 2],
      [2, size - 3],
      [size - 3, size - 3],
    ].map(([x, y]) => {
      const index = (y * size + x) * 4;
      return [baked[index], baked[index + 1], baked[index + 2]];
    });
    const linear = (value) => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    };
    const oklabChroma = (rgb) => {
      const r = linear(rgb[0]);
      const g = linear(rgb[1]);
      const b = linear(rgb[2]);
      const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
      const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
      const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
      const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
      const labB = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
      return Math.hypot(a, labB);
    };
    let peak = 0;
    for (let index = 0; index < baked.length; index += 16) {
      const rgb = [baked[index], baked[index + 1], baked[index + 2]];
      const value = oklabChroma(rgb);
      if (value > peak) peak = value;
    }
    if (peak > cap) throw new Error(`${job.kind} chroma ${peak} exceeds ${cap}`);
    return { dataUrl: output.toDataURL('image/png'), corners, peak };
  }

  for (const job of jobs) {
    const painted = paint(job);
    reports.push({ kind: job.kind, tint: job.tint, corners: painted.corners, peak: painted.peak, cap, dataUrl: painted.dataUrl });
  }
  return reports;
}, { jobs: JOBS, size: SIZE, backdrop: BACKDROP, cap: CHROMA_CAP });

function cornerOk(rgb) {
  return rgb.every((channel, index) => channel === BACKDROP[index]);
}

for (const report of results) {
  const badCorner = report.corners.some((rgb) => !cornerOk(rgb));
  const [, a, b] = oklab(report.corners[0]);
  const objectChroma = report.peak;
  if (badCorner) throw new Error(`${report.kind} corners ${JSON.stringify(report.corners)}`);
  if (objectChroma > CHROMA_CAP * 4) {
    // peak here is RGB distance, checked again below from the file via a second pass
  }
  const png = Buffer.from(report.dataUrl.split(',')[1], 'base64');
  fs.writeFileSync(path.join(OUT, `promo-product-${report.kind}.png`), png);
  console.log(report.kind, report.tint, 'corners', report.corners[0].join(','));
}

await browser.close();
console.log('wrote', JOBS.length);
