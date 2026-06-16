#!/usr/bin/env node
/**
 * Generate intro videos from HTML slide decks using Playwright screen recording.
 * Usage: node scripts/generate-intro-videos.mjs
 */
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'artifacts', 'videos');

const VIDEOS = [
  {
    name: 'kompas-migracji-intro',
    html: 'project-intro.html',
    title: 'Kompas Migracji — Ознайомчий відеоролик',
  },
  {
    name: 'kompascrm-intro',
    html: 'crm-intro.html',
    title: 'KompasCRM — Ознайомчий відеоролик',
  },
];

async function recordVideo({ name, html, title }) {
  const htmlPath = path.join(OUT_DIR, html);
  const fileUrl = `file://${htmlPath}`;
  const tmpDir = path.join(OUT_DIR, `.tmp-${name}`);
  const outputPath = path.join(OUT_DIR, `${name}.webm`);

  fs.mkdirSync(tmpDir, { recursive: true });

  console.log(`\n🎬 Recording: ${title}`);
  console.log(`   Source: ${htmlPath}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: tmpDir,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500); // fonts & initial animations

  const durationMs = await page.evaluate(() => window.VIDEO_DONE_MS || 77000);
  console.log(`   Duration: ${(durationMs / 1000).toFixed(1)}s`);

  // Wait for full presentation + small buffer for last slide
  await page.waitForTimeout(durationMs + 1500);

  await context.close();
  await browser.close();

  // Playwright saves video on context close — find the webm file
  const files = fs.readdirSync(tmpDir).filter((f) => f.endsWith('.webm'));
  if (!files.length) throw new Error(`No video file produced for ${name}`);

  const rawWebm = path.join(tmpDir, files[0]);
  fs.renameSync(rawWebm, outputPath);
  fs.rmSync(tmpDir, { recursive: true, force: true });

  console.log(`   ✅ Saved: ${outputPath}`);
  return outputPath;
}

async function convertToMp4(webmPath) {
  const mp4Path = webmPath.replace('.webm', '.mp4');
  const { execSync } = await import('child_process');

  try {
    execSync(
      `ffmpeg -y -i "${webmPath}" -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p -movflags +faststart "${mp4Path}"`,
      { stdio: 'pipe' }
    );
    fs.unlinkSync(webmPath);
    console.log(`   🎞️  MP4: ${mp4Path}`);
    return mp4Path;
  } catch (e) {
    console.warn(`   ⚠️  ffmpeg conversion failed, keeping webm`);
    return webmPath;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  Kompas Migracji — Video Generator');
  console.log('═══════════════════════════════════════════');

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const results = [];
  for (const video of VIDEOS) {
    const webm = await recordVideo(video);
    const final = await convertToMp4(webm);
    results.push({ ...video, path: final });
  }

  console.log('\n═══════════════════════════════════════════');
  console.log('  Done! Generated videos:');
  for (const r of results) {
    const stat = fs.statSync(r.path);
    const mb = (stat.size / 1024 / 1024).toFixed(1);
    console.log(`  • ${r.title}`);
    console.log(`    ${r.path} (${mb} MB)`);
  }
  console.log('═══════════════════════════════════════════\n');
}

main().catch((err) => {
  console.error('Video generation failed:', err);
  process.exit(1);
});
