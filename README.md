This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Map Stack (OpenStreetMap + Leaflet + Photon)

This project uses:

- [Leaflet](https://leafletjs.com/) + [react-leaflet](https://react-leaflet.js.org/) for map rendering.
- OpenStreetMap tiles (default theme) and CARTO basemap tiles (dark theme).
- [Photon](https://photon.komoot.io/) API for address autocomplete/search via internal proxy endpoint.

### Usage, limits and license rules implemented in app

- OpenStreetMap attribution is shown directly on the map UI.
- Photon and OSM attribution is shown in the map UI (`Map data: OpenStreetMap contributors, geocoding: Photon (Komoot) / OpenStreetMap.`).
- Photon requests are throttled in UI (debounce `400ms`), limited to `5` results, and enabled only for queries with length `>= 3`.
- Photon search is bounded to Ukraine bbox to reduce unnecessary API load.
- Geocoder API endpoint uses short-term in-memory cache (TTL `60s`) and per-IP rate limiting.
- Do not remove map/geocoder attribution notices from the UI.
- Respect fair-use limits of public tile/geocoder providers; if traffic increases, migrate to dedicated/self-hosted providers.

### Map and geocoder env config

- `NEXT_PUBLIC_LIGHT_TILE_URL` - light map tiles URL template.
- `NEXT_PUBLIC_DARK_TILE_URL` - dark map tiles URL template.
- `NEXT_PUBLIC_LIGHT_TILE_ATTRIBUTION` - light map attribution HTML.
- `NEXT_PUBLIC_DARK_TILE_ATTRIBUTION` - dark map attribution HTML.
- `NEXT_PUBLIC_GEOCODER_API_URL` - client geocoder endpoint (default `/api/geocoder`).
- `GEOCODER_PRIMARY_URL` - primary upstream geocoder URL.
- `GEOCODER_FALLBACK_URL` - fallback upstream geocoder URL.
