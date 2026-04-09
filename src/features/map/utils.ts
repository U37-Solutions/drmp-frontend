import type { Map as MapLibreMap } from 'maplibre-gl';

import { SupplierDTO } from '@/features/map/types';

export const panMapToOffset = (map: MapLibreMap, latLng: { lat: number; lng: number }, offsetY: number) => {
  const p = map.project([latLng.lng, latLng.lat]);
  const next = map.unproject([p.x, p.y + offsetY]);
  map.easeTo({ center: next, zoom: map.getZoom(), duration: 300 });
};

const MARKER_OFFSET = 0.00003; // Small offset to prevent marker overlap

export const mapMarkersWOffset = (mapPoints: Array<SupplierDTO>) =>
  mapPoints.reduce((acc, item) => {
    const existing = acc.find((el) => el.latitude === item.latitude && el.longitude === item.longitude);
    if (existing) {
      existing.latitude += MARKER_OFFSET;
    } else {
      acc.push(item);
    }
    return acc;
  }, [] as Array<SupplierDTO>);
