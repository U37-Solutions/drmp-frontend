import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_PRIMARY_URL = 'https://photon.komoot.io/api';
const DEFAULT_FALLBACK_URL = 'https://photon.komoot.io/api';
const UKRAINE_BBOX = '22.09,44.38,40.23,52.38';
const MAX_LIMIT = 5;
const CACHE_TTL_MS = 60_000;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 60;

type PhotonFeature = {
  geometry?: { coordinates?: [number, number] };
  properties?: {
    osm_id?: number | string;
    name?: string;
    city?: string;
    state?: string;
    country?: string;
  };
};

const toResult = (features: Array<PhotonFeature>) =>
  features
    .map((feature) => {
      const coordinates = feature.geometry?.coordinates;
      if (!coordinates || coordinates.length < 2) return null;

      const [lng, lat] = coordinates;
      const name = feature.properties?.name;
      const city = feature.properties?.city;
      const state = feature.properties?.state;
      const country = feature.properties?.country;
      const label = [name, city, state, country].filter(Boolean).join(', ') || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

      return {
        id: String(feature.properties?.osm_id || `${lat}:${lng}`),
        label,
        lat,
        lng,
      };
    })
    .filter((item): item is { id: string; label: string; lat: number; lng: number } => item !== null);

const cache = new Map<string, { expiresAt: number; items: Array<{ id: string; label: string; lat: number; lng: number }> }>();
const rateLimiter = new Map<string, Array<number>>();

const getClientIp = (req: NextRequest) => {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const [ip] = forwarded.split(',');
    return ip.trim() || 'unknown';
  }

  return req.headers.get('x-real-ip') || 'unknown';
};

const isRateLimited = (ip: string) => {
  const now = Date.now();
  const timestamps = (rateLimiter.get(ip) || []).filter((timestamp) => now - timestamp <= RATE_WINDOW_MS);
  timestamps.push(now);
  rateLimiter.set(ip, timestamps);
  return timestamps.length > RATE_MAX_REQUESTS;
};

const cleanupCache = () => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (entry.expiresAt <= now) {
      cache.delete(key);
    }
  }
};

const requestPhoton = async (baseUrl: string, query: string, signal: AbortSignal) => {
  const params = new URLSearchParams({
    q: query,
    lang: 'uk',
    bbox: UKRAINE_BBOX,
    limit: String(MAX_LIMIT),
  });

  const response = await fetch(`${baseUrl}?${params.toString()}`, {
    method: 'GET',
    signal,
    headers: { 'User-Agent': 'drmp-frontend geocoder proxy' },
    next: { revalidate: 0 },
  });
  if (!response.ok) {
    throw new Error(`Geocoder request failed: ${response.status}`);
  }

  const json = (await response.json()) as { features?: Array<PhotonFeature> };
  return toResult(json.features || []);
};

export async function GET(req: NextRequest) {
  cleanupCache();
  const query = (req.nextUrl.searchParams.get('q') || '').trim();
  if (query.length < 3) {
    return NextResponse.json({ items: [] });
  }
  const normalizedQuery = query.toLocaleLowerCase('uk-UA');
  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    return NextResponse.json({ items: [], error: 'Too many requests' }, { status: 429 });
  }

  const cached = cache.get(normalizedQuery);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json({ items: cached.items });
  }

  const primaryUrl = process.env.GEOCODER_PRIMARY_URL || DEFAULT_PRIMARY_URL;
  const fallbackUrl = process.env.GEOCODER_FALLBACK_URL || DEFAULT_FALLBACK_URL;

  try {
    const primaryItems = await requestPhoton(primaryUrl, query, req.signal);
    if (primaryItems.length > 0 || primaryUrl === fallbackUrl) {
      cache.set(normalizedQuery, { items: primaryItems, expiresAt: Date.now() + CACHE_TTL_MS });
      return NextResponse.json({ items: primaryItems });
    }

    const fallbackItems = await requestPhoton(fallbackUrl, query, req.signal);
    cache.set(normalizedQuery, { items: fallbackItems, expiresAt: Date.now() + CACHE_TTL_MS });
    return NextResponse.json({ items: fallbackItems });
  } catch {
    try {
      const fallbackItems = await requestPhoton(fallbackUrl, query, req.signal);
      cache.set(normalizedQuery, { items: fallbackItems, expiresAt: Date.now() + CACHE_TTL_MS });
      return NextResponse.json({ items: fallbackItems });
    } catch {
      return NextResponse.json({ items: [] }, { status: 200 });
    }
  }
}
