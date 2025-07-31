'use client';
import { Card } from 'antd';
import React, { useEffect } from 'react';

import styles from '@/components/pages/HomePage/HomePage.module.scss';

import LocationMap from '@/shared/ui/components/Map/LocationMap/LocationMap';
import { LocationGeometry } from '@/shared/ui/components/Map/types';

const SuppliersMap = () => {
  const [defaultCoordinates, setDefaultCoordinates] = React.useState<LocationGeometry>({
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

  return (
    <Card className={styles.mapCard}>
      <LocationMap markers={[]} selectedPosition={defaultCoordinates} onPositionSelect={() => {}} />
    </Card>
  );
};

export default SuppliersMap;
