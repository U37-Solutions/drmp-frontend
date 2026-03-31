import type { LatLngExpression, Map } from 'leaflet';

import { SupplierDTO } from '@/features/map/types';

export const panMapToOffset = (map: Map, latLng: LatLngExpression, offsetY: number) => {
  const containerPoint = map.latLngToContainerPoint(latLng);
  const targetPoint = containerPoint.subtract([0, offsetY]);
  map.panTo(map.containerPointToLatLng(targetPoint), { animate: true });
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
