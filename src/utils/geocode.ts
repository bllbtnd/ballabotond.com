// Shared geocoder with file-based cache + rate limiting
// Uses Nominatim (free, no API key). Results are cached to .geocode-cache.json
// so repeated builds / HMR reloads don't re-hit the API.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const CACHE_FILE = join(process.cwd(), '.geocode-cache.json');

// Load cache from disk
let diskCache: Record<string, { lat: number; lng: number }> = {};
try {
  diskCache = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
} catch {
  // File doesn't exist yet — that's fine
}

// Queue to serialize requests (Nominatim allows max 1 req/sec)
let lastRequestTime = 0;

function saveCache() {
  try {
    writeFileSync(CACHE_FILE, JSON.stringify(diskCache, null, 2));
  } catch {
    // Non-critical
  }
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function geocode(query: string): Promise<{ lat: number; lng: number } | null> {
  const key = query.toLowerCase().trim();

  // Check cache first
  if (diskCache[key]) return diskCache[key];

  // Rate limit: wait until 1.1s after the last request
  const now = Date.now();
  const wait = Math.max(0, lastRequestTime + 1100 - now);
  if (wait > 0) await sleep(wait);
  lastRequestTime = Date.now();

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ballabotond.com/1.0 (personal-site build-time geocoding)' }
    });

    if (res.status === 429) {
      // Rate limited — wait and retry once
      console.warn(`[geocode] Rate limited, waiting 2s and retrying "${query}"...`);
      await sleep(2000);
      lastRequestTime = Date.now();
      const retry = await fetch(url, {
        headers: { 'User-Agent': 'ballabotond.com/1.0 (personal-site build-time geocoding)' }
      });
      if (!retry.ok) {
        console.warn(`[geocode] Retry failed for "${query}": HTTP ${retry.status}`);
        return null;
      }
      const data = await retry.json();
      if (data.length > 0) {
        const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        diskCache[key] = coords;
        saveCache();
        return coords;
      }
      return null;
    }

    if (!res.ok) {
      console.warn(`[geocode] HTTP ${res.status} for "${query}"`);
      return null;
    }

    const data = await res.json();
    if (data.length > 0) {
      const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      diskCache[key] = coords;
      saveCache();
      return coords;
    }

    console.warn(`[geocode] No results for "${query}"`);
  } catch (err) {
    console.warn(`[geocode] Failed for "${query}":`, err);
  }

  return null;
}
