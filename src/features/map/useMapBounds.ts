import { useEffect, useRef } from 'react';

import { LocationGeometry } from '@/shared/ui/components/Map/types';

type BoundsCallback = (bounds: { topRight: LocationGeometry; bottomLeft: LocationGeometry }) => void;

const useMapBounds = (map: google.maps.Map | null, onBoundsChange: BoundsCallback, debounceMs = 500) => {
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
          topRight: { lat: ne.lat(), lng: ne.lng() },
          bottomLeft: { lat: sw.lat(), lng: sw.lng() },
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
