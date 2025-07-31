import { useEffect, useRef } from 'react';

import { GMapsBounds } from '@/features/map/types';

type BoundsCallback = (bounds: GMapsBounds) => void;

const useMapBounds = (map: google.maps.Map | null, onBoundsChange: BoundsCallback, debounceMs = 300) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!map) return;

    const handleIdle = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const bounds = map.getBounds();
        if (!bounds) return;

        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        onBoundsChange({
          ne: { lat: ne.lat(), lng: ne.lng() },
          sw: { lat: sw.lat(), lng: sw.lng() },
        });
      }, debounceMs);
    };

    const listener = google.maps.event.addListener(map, 'idle', handleIdle);

    return () => {
      google.maps.event.removeListener(listener);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [map, onBoundsChange, debounceMs]);
};

export default useMapBounds;
