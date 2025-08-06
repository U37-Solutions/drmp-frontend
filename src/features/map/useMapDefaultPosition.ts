'use client';
import { useMap } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';

import { LocationGeometry } from '@/shared/ui/components/Map/types';

const useMapDefaultPosition = () => {
  const map = useMap();
  const [defaultCoordinates, setDefaultCoordinates] = useState<LocationGeometry>({
    lat: 50.4501, // Kyiv latitude
    lng: 30.5234, // Kyiv longitude
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDefaultCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {},
      { enableHighAccuracy: true },
    );
  }, []);

  useEffect(() => {
    if (!map) return;

    map.panTo(defaultCoordinates);
    map.setZoom(13);
  }, [map, defaultCoordinates]);

  return defaultCoordinates;
};

export default useMapDefaultPosition;
