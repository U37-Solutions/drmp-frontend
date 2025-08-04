import { SupplierDTO } from '@/features/map/types';

export const panMapToOffset = (map: google.maps.Map, latLng: google.maps.LatLngLiteral, offsetY: number) => {
  const scale = Math.pow(2, map.getZoom() || 0);
  const projection = map.getProjection();
  if (!projection) return;

  const bounds = map.getBounds();
  if (!bounds) return;

  // Convert LatLng to Point
  const point = projection.fromLatLngToPoint(new google.maps.LatLng(latLng));
  if (!point) return;

  // Convert pixel offset to world coordinates
  const worldCoordinate = new google.maps.Point(point.x, point.y + offsetY / scale);

  // Convert back to LatLng
  const newLatLng = projection.fromPointToLatLng(worldCoordinate);

  if (newLatLng) {
    map.panTo(newLatLng);
  }
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
