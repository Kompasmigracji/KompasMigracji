#!/usr/bin/env node
/**
 * Generate intro videos: 4K screen capture + epic narration + orchestral mix.
 * Usage:
 *   node scripts/generate-intro-videos.mjs          # 1080p + audio
 *   node scripts/generate-intro-videos.mjs --4k     # 4K + audio
 */
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { execSync, spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'artifacts', 'videos');
const AUDIO_DIR = path.join(OUT_DIR, 'audio');

const IS_4K = process.argv.includes('--4k');
const BASE_W = 1920;
const BASE_H = 1080;
const OUT_W = IS_4K ? 3840 : 1920;
const OUT_H = IS_4K ? 2160 : 1080;
const SCALE = IS_4K ? 2 : 1;

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

function run(cmd) {
  execSync(cmd, { stdio: 'pipe' });
}

function ensureAudio() {
  const needed = VIDEOS.map((v) => path.join(AUDIO_DIR, `${v.name}-audio.mp3`));
  const missing = needed.filter((f) => !fs.existsSync(f));
  if (missing.length) {
    console.log('\n🎤 Generating epic narration + orchestral music...');
    run(`python3 "${path.join(ROOT, 'scripts/generate-narration.py')}"`);
  }
}

async function recordVideo({ name, html, title }) {
  const htmlPath = path.join(OUT_DIR, html);
  const fileUrl = `file://${htmlPath}`;
  const tmpDir = path.join(OUT_DIR, `.tmp-${name}`);
  const suffix = IS_4K ? '-4k' : '';
  const silentPath = path.join(OUT_DIR, `${name}${suffix}-silent.webm`);

  fs.mkdirSync(tmpDir, { recursive: true });

  console.log(`\n🎬 Recording: ${title} (${OUT_W}×${OUT_H})`);
  console.log(`   Source: ${htmlPath}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: OUT_W, height: OUT_H },
    deviceScaleFactor: 1,
    recordVideo: { dir: tmpDir, size: { width: OUT_W, height: OUT_H } },
  });

  const page = await context.newPage();

  if (IS_4K) {
    await page.addStyleTag({
      content: `
        html, body { width: ${OUT_W}px !important; height: ${OUT_H}px !important; overflow: hidden; }
        .deck {
          width: ${BASE_W}px !important; height: ${BASE_H}px !important;
          transform: scale(${SCALE}); transform-origin: top left;
        }
      `,
    });
  }

  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const durationMs = await page.evaluate(() => window.VIDEO_DONE_MS || 100000);
  console.log(`   Duration: ${(durationMs / 1000).toFixed(1)}s`);

  await page.waitForTimeout(durationMs + 1500);

  await context.close();
  await browser.close();

  const files = fs.readdirSync(tmpDir).filter((f) => f.endsWith('.webm'));
  if (!files.length) throw new Error(`No video file produced for ${name}`);

  fs.renameSync(path.join(tmpDir, files[0]), silentPath);
  fs.rmSync(tmpDir, { recursive: true, force: true });

  console.log(`   ✅ Silent capture: ${silentPath}`);
  return silentPath;
}

function muxVideoAudio(silentWebm, name) {
  const suffix = IS_4K ? '-4k' : '';
  const audioPath = path.join(AUDIO_DIR, `${name}-audio.mp3`);
  const mp4Path = path.join(OUT_DIR, `${name}${suffix}.mp4`);
  const tmpVideo = path.join(OUT_DIR, `${name}${suffix}-video.mp4`);

  if (!fs.existsSync(audioPath)) {
    throw new Error(`Audio not found: ${audioPath}`);
  }

  // Convert silent webm → h264
  run(
    `ffmpeg -y -i "${silentWebm}" -c:v libx264 -preset slow -crf ${IS_4K ? '18' : '20'} -pix_fmt yuv420p -movflags +faststart "${tmpVideo}"`
  );

  // Mux with audio (trim to shortest)
  run(
    `ffmpeg -y -i "${tmpVideo}" -i "${audioPath}" ` +
    `-map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -shortest ` +
    `-movflags +faststart "${mp4Path}"`
  );

  fs.unlinkSync(silentWebm);
  fs.unlinkSync(tmpVideo);

  console.log(`   🎞️  Final: ${mp4Path}`);
  return mp4Path;
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log(`  Kompas Migracji — Video Generator ${IS_4K ? '[4K]' : '[1080p]'}`);
  console.log('  + Epic Voiceover + Orchestral Score');
  console.log('═══════════════════════════════════════════');

  fs.mkdirSync(OUT_DIR, { recursive: true });
  ensureAudio();

  const results = [];
  for (const video of VIDEOS) {
    const silent = await recordVideo(video);
    const final = muxVideoAudio(silent, video.name);
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
