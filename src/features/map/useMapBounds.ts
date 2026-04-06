'use client';

import type { Map as MapLibreMap } from 'maplibre-gl';
import { useEffect, useRef } from 'react';

import { GMapsBounds } from '@/features/map/types';

type BoundsCallback = (bounds: GMapsBounds) => void;

const useMapBounds = (map: MapLibreMap | null, onBoundsChange: BoundsCallback, debounceMs = 300) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!map) return;

    const scheduleReport = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const bounds = map.getBounds();
        if (!bounds) return;

        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        onBoundsChange({
          ne: { lat: ne.lat, lng: ne.lng },
          sw: { lat: sw.lat, lng: sw.lng },
        });
      }, debounceMs);
    };

    map.on('moveend', scheduleReport);
    map.on('zoomend', scheduleReport);
    scheduleReport();

    return () => {
      map.off('moveend', scheduleReport);
      map.off('zoomend', scheduleReport);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, debounceMs]);
};

export default useMapBounds;
