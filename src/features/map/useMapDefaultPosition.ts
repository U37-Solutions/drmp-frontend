'use client';
import { useEffect, useState } from 'react';

import { useMapInstance } from '@/shared/providers/MapApiProvider';
import { LocationGeometry } from '@/shared/ui/components/Map/types';

const useMapDefaultPosition = () => {
  const { map } = useMapInstance();
  const [defaultCoordinates, setDefaultCoordinates] = useState<LocationGeometry>({
    lat: 50.4501, // Kyiv latitude
    lng: 30.5234, // Kyiv longitude
  });

  useEffect(() => {
    if (!map) return;

    map.flyTo({
      center: [defaultCoordinates.lng, defaultCoordinates.lat],
      zoom: 13,
      duration: 450,
      essential: true,
    });
  }, [map, defaultCoordinates]);

  return { defaultCoordinates, setDefaultCoordinates };
};

export default useMapDefaultPosition;
