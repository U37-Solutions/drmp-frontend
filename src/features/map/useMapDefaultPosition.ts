'use client';

import { useMap } from 'react-map-gl/maplibre';
import { useEffect, useState } from 'react';

import { LocationGeometry } from '@/shared/ui/components/Map/types';

const DEFAULT_CENTER: LocationGeometry = {
  lat: 48.3794,
  lng: 31.1656,
};

/**
 * Must be rendered as a descendant of react-map-gl Map.
 */
const useMapDefaultPosition = () => {
  const { current: mapRef } = useMap();
  const [defaultCoordinates, setDefaultCoordinates] = useState<LocationGeometry>(DEFAULT_CENTER);

  useEffect(() => {
    if (!mapRef) return;
    mapRef.flyTo({ center: [defaultCoordinates.lng, defaultCoordinates.lat], zoom: 13, essential: true });
  }, [mapRef, defaultCoordinates]);

  return { defaultCoordinates, setDefaultCoordinates };
};

export default useMapDefaultPosition;
