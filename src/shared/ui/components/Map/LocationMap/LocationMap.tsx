'use client';
import { Map as GoogleMap, useMap } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';

import useMapBounds from '@/features/map/useMapBounds';

import { environments } from '@/shared/configs/environments';

import { UKRAINE_BOUNDS } from '../constants';
import LocationMarkerWindow from '../LocationMarkerWindow/LocationMarkerWindow';
import { LocationMarker } from '../types';
import type { LocationGeometry } from '../types';

import styles from './LocationMap.module.scss';

type LocationMapProps = {
  markers: LocationMarker[];
  selectedPosition: LocationGeometry;
  onPositionSelect: (position: LocationGeometry | null) => void;
};

const LocationMap = ({ markers, selectedPosition, onPositionSelect }: LocationMapProps) => {
  const map = useMap();

  useMapBounds(map, (bounds) => {
    // TODO: Handle bounds change with a relevant request
    // eslint-disable-next-line no-console
    console.log('Map bounds changed:', bounds);
  });

  useEffect(() => {
    if (!map || !selectedPosition) return;

    map.panTo(selectedPosition);
    map.setZoom(13);
  }, [map, selectedPosition]);

  useEffect(() => {
    if (!map) return;
    map.setOptions({
      restriction: { latLngBounds: UKRAINE_BOUNDS },
    });
  }, [map]);

  return (
    <div className={styles.locationMap}>
      <GoogleMap
        defaultCenter={selectedPosition}
        defaultZoom={6}
        mapId={environments.mapId}
        gestureHandling="greedy"
        streetViewControl={false}
        clickableIcons={false}
      >
        {markers.map((marker) => (
          <LocationMarkerWindow
            key={`${marker.position.lat},${marker.position.lng}`}
            position={marker.position}
            content={marker.content}
            onPositionSelect={onPositionSelect}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default LocationMap;
