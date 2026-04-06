import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim();
  if (!q) {
    return NextResponse.json([]);
  }

  const base = process.env.NEXT_PUBLIC_NOMINATIM_URL;
  if (!base) {
    return NextResponse.json({ error: 'Nominatim is not configured' }, { status: 503 });
  }

  const baseUrl = base.replace(/\/$/, '');
  const params = new URLSearchParams({
    q,
    format: 'json',
    countrycodes: 'ua',
    'accept-language': 'uk',
    limit: '5',
  });

  const res = await fetch(`${baseUrl}/search?${params.toString()}`, {
    headers: { 'User-Agent': 'DRMP App/1.0' },
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json([], { status: 200 });
  }

  const data: unknown = await res.json();
  return NextResponse.json(Array.isArray(data) ? data : []);
}
