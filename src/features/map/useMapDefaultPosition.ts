'use client';

import { useEffect, useState } from 'react';
import { useMap } from 'react-map-gl/maplibre';

import { LocationGeometry } from '@/shared/ui/components/Map/types';

/**
 * Must be rendered as a descendant of react-map-gl Map.
 * flyTo is triggered only when the user explicitly requests geolocation
 * (i.e. setDefaultCoordinates is called), never on initial mount.
 */
const useMapDefaultPosition = () => {
  const { current: mapRef } = useMap();
  const [defaultCoordinates, setDefaultCoordinates] = useState<LocationGeometry | null>(null);

  useEffect(() => {
    if (!mapRef || !defaultCoordinates) return;
    mapRef.flyTo({ center: [defaultCoordinates.lng, defaultCoordinates.lat], zoom: 13, essential: true });
  }, [mapRef, defaultCoordinates]);

  return { defaultCoordinates, setDefaultCoordinates };
};

export default useMapDefaultPosition;
