// scripts/addEarthbeat.js
// Append a daily Earthbeat entry to src/data/journalEntries.json
// v2: fetches a daily spectrogram image, analyzes brightness, and generates summary + tags.
//
// Requirements (add to your package.json and run `npm i`):
//   "node-fetch": "^3.3.2",
//   "canvas": "^2.11.2",
//   "fs-extra": "^11.2.0"
//
// On GitHub Actions, ensure native deps for canvas are installed (see workflow).

import fs from "fs";
import fse from "fs-extra";
import path from "path";
import fetch from "node-fetch";
import { createCanvas, loadImage } from "canvas";

const DATA_PATH = path.resolve(process.cwd(), "src/data/journalEntries.json");
const PUBLIC_EB_DIR = path.resolve(process.cwd(), "public", "earthbeat");

function pad(n){ return n.toString().padStart(2, "0"); }

function parseArgs() {
  const argv = process.argv.slice(2);
  const args = {};
  for (const a of argv) {
    const [k, v] = a.split("=");
    if (k && typeof v !== "undefined") args[k.replace(/^--/, "")] = v;
  }
  return args;
}

function getDateParts(d) {
  const year = d.getUTCFullYear();
  const month = pad(d.getUTCMonth() + 1);
  const day = pad(d.getUTCDate());
  return { year, month, day };
}

function makeBaseEntry(d) {
  const { year, month, day } = getDateParts(d);
  const iso = new Date(Date.UTC(year, month - 1, day, 9, 0, 0)).toISOString(); // 09:00 UTC
  const slug = `earthbeat-${year}-${month}-${day}`;
  const title = `Earthbeat — ${new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}`;

  return { slug, title, iso };
}

// ---- Phase 1: image-based ingestion (Cumiana as stable source) ----
async function fetchSpectrogram(dateObj) {
  const yyyy = dateObj.getUTCFullYear();
  const mm = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getUTCDate()).padStart(2, "0");

  // Cumiana "latest" image endpoint (good enough for daily snapshot).
  // If you find a date-specific endpoint later, swap it here.
  const url = "https://www.vlf.it/cumiana/latest.jpg";

  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to fetch spectrogram: ${resp.status}`);
  const buffer = Buffer.from(await resp.arrayBuffer());

  await fse.ensureDir(PUBLIC_EB_DIR);
  const filename = `${yyyy}-${mm}-${dd}.jpg`;
  const filePath = path.join(PUBLIC_EB_DIR, filename);
  await fse.writeFile(filePath, buffer);

  return { filePath, publicUrl: `/earthbeat/${filename}`, source: "cumiana" };
}

async function analyzeSpectrogramBrightness(filePath) {
  const img = await loadImage(filePath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  const width = img.width, height = img.height;
  const thirds = [
    { label: "morning", start: 0, end: Math.floor(width / 3) },
    { label: "midday",  start: Math.floor(width / 3), end: Math.floor((width / 3) * 2) },
    { label: "evening", start: Math.floor((width / 3) * 2), end: width }
  ];

  const results = {};
  for (const { label, start, end } of thirds) {
    let total = 0, count = 0;
    const strip = ctx.getImageData(start, 0, Math.max(1, end - start), height).data;
    // Average brightness using R channel as proxy (spectrograms are pseudo-colored; R works fine for coarse signal)
    for (let i = 0; i < strip.length; i += 4) {
      total += strip[i]; // R
      count++;
    }
    results[label] = count ? total / count : 0;
  }
  return results;
}

function mapBrightnessToTagsAndSummary(bands) {
  const tags = new Set();
  const parts = [];

  const phrase = (period, b) => {
    if (b < 60) { tags.add("stillness"); return `${cap(period)} field steady at low amplitude`; }
    if (b < 120){ tags.add("lift");      return `${cap(period)} saw a moderate lift`; }
    tags.add("surge");                    return `${cap(period)} carried a strong surge`;
  };

  parts.push(phrase("morning", bands.morning));
  parts.push(phrase("midday",  bands.midday));
  parts.push(phrase("evening", bands.evening));

  return { tags: Array.from(tags), summary: parts.join(". ") + "." };
}

function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

// ------------------------ main ------------------------
async function main() {
  const args = parseArgs();
  const targetDate = args.date ? new Date(args.date + "T00:00:00Z") : new Date();
  if (isNaN(targetDate)) {
    console.error("Invalid --date format. Use YYYY-MM-DD.");
    process.exit(1);
  }

  if (!fs.existsSync(DATA_PATH)) {
    console.error("Could not find", DATA_PATH);
    process.exit(1);
  }

  const raw = fs.readFileSync(DATA_PATH, "utf8");
  let entries;
  try { entries = JSON.parse(raw); }
  catch (e) {
    console.error("Failed to parse JSON:", e.message);
    process.exit(1);
  }

  const { slug, title, iso } = makeBaseEntry(targetDate);

  if (entries.some(e => e.slug === slug)) {
    console.log("Entry already exists for", slug);
    return;
  }

  // Try image-based ingestion
  let srData = {};
  try {
    const { filePath, publicUrl, source } = await fetchSpectrogram(targetDate);
    const bands = await analyzeSpectrogramBrightness(filePath);
    const { tags, summary } = mapBrightnessToTagsAndSummary(bands);
    srData = {
      sr_source: source,
      sr_image_url: publicUrl,
      sr_tags_auto: tags,
      sr_summary: summary,
      sr_signal_windows: bands
    };
  } catch (err) {
    console.error("Spectrogram fetch/analyze failed:", err.message);
  }

  const entry = {
    slug,
    title,
    summary: srData.sr_summary || "Daily resonance field note.",
    content: "<p>(Add your observation here.)</p>",
    category: "earthbeat",
    tags: Array.isArray(srData.sr_tags_auto) && srData.sr_tags_auto.length ? srData.sr_tags_auto : ["presence"],
    cover_image_url: srData.sr_image_url || "",
    published_at: iso,
    ...srData
  };

  entries.push(entry);
  entries.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

  fs.writeFileSync(DATA_PATH, JSON.stringify(entries, null, 2), "utf8");
  console.log("Added:", entry.slug);
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  // Run if called directly
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
