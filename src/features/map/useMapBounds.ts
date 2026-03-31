'use client';
import type { Map } from '@maptiler/sdk';
import { useEffect, useRef } from 'react';

import { GMapsBounds } from '@/features/map/types';

type BoundsCallback = (bounds: GMapsBounds) => void;

const useMapBounds = (map: Map | null, onBoundsChange: BoundsCallback, debounceMs = 300) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!map) return;

    const handleMoveEnd = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const bounds = map.getBounds();
        if (!bounds) return;

        onBoundsChange({
          ne: { lat: bounds.getNorth(), lng: bounds.getEast() },
          sw: { lat: bounds.getSouth(), lng: bounds.getWest() },
        });
      }, debounceMs);
    };

    map.on('moveend', handleMoveEnd);

    return () => {
      map.off('moveend', handleMoveEnd);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, debounceMs]);
};

export default useMapBounds;
