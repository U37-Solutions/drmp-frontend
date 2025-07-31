'use client';
import { useQuery } from '@tanstack/react-query';
import { Map as GoogleMap, useMap } from '@vis.gl/react-google-maps';
import { getCookie } from 'cookies-next/client';
import { useEffect, useState } from 'react';

import { getMapPoints } from '@/features/map/api';
import { GMapsBounds, SupplierDTO } from '@/features/map/types';
import useMapBounds from '@/features/map/useMapBounds';

import { environments } from '@/shared/configs/environments';
import { ThemeType } from '@/shared/providers/ThemeProvider';

import { UKRAINE_BOUNDS } from '../constants';
import MapMarker from '../MapMarker/MapMarker';
import type { LocationGeometry } from '../types';

import styles from './LocationMap.module.scss';

type LocationMapProps = {
  defaultBoundaries: LocationGeometry;
};

const LocationMap = ({ defaultBoundaries }: LocationMapProps) => {
  const map = useMap();
  const theme = getCookie('theme') as ThemeType;
  const [bounds, setBounds] = useState<GMapsBounds | null>(null);

  const { data: mapPoints = [] } = useQuery({
    queryKey: ['mapPoints', bounds],
    queryFn: ({ signal }) => (bounds ? getMapPoints(bounds, signal) : []),
    enabled: !!bounds,
  });

  useMapBounds(map, setBounds, 600);

  const handleItemClick = (item: SupplierDTO) => {
    map?.panTo({
      lat: item.latitude,
      lng: item.longitude,
    });
  };

  useEffect(() => {
    if (!map || !defaultBoundaries) return;

    map.panTo(defaultBoundaries);
    map.setZoom(13);
  }, [map, defaultBoundaries]);

  useEffect(() => {
    if (!map) return;
    map.setOptions({
      restriction: { latLngBounds: UKRAINE_BOUNDS },
    });
  }, [map]);

  return (
    <div className={styles.locationMap}>
      <GoogleMap
        defaultCenter={defaultBoundaries}
        defaultZoom={6}
        mapId={theme === ThemeType.DARK ? environments.darkMapId : environments.lightMapId}
        gestureHandling="greedy"
        streetViewControl={false}
        clickableIcons={false}
        reuseMaps
      >
        {mapPoints.map((supplierItem) => (
          <MapMarker key={`marker-${supplierItem.id}`} item={supplierItem} handleClick={handleItemClick} />
        ))}
      </GoogleMap>
    </div>
  );
};

export default LocationMap;
