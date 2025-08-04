'use client';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useQuery } from '@tanstack/react-query';
import { Map as GoogleMap, useMap } from '@vis.gl/react-google-maps';
import { getCookie } from 'cookies-next/client';
import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { getMapPoints } from '@/features/map/api';
import { GMapsBounds, SupplierDTO } from '@/features/map/types';
import useMapBounds from '@/features/map/useMapBounds';
import { mapMarkersWOffset, panMapToOffset } from '@/features/map/utils';

import { environments } from '@/shared/configs/environments';
import { ThemeType } from '@/shared/providers/ThemeProvider';

import { UKRAINE_BOUNDS } from '../constants';
import MapMarker from '../MapMarker/MapMarker';
import type { LocationGeometry } from '../types';

import styles from './LocationMap.module.scss';

import AdvancedMarkerElement = google.maps.marker.AdvancedMarkerElement;

type LocationMapProps = {
  defaultBoundaries: LocationGeometry;
};

const LocationMap = ({ defaultBoundaries }: LocationMapProps) => {
  const map = useMap();
  const theme = getCookie('theme') as ThemeType;

  const [mapPoints, setMapPoints] = useState<Array<SupplierDTO>>([]);
  const [bounds, setBounds] = useState<GMapsBounds | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierDTO | null>(null);
  const [markers, setMarkers] = useState<{ [id: number]: AdvancedMarkerElement }>({});

  useQuery<Array<SupplierDTO>>({
    queryKey: ['mapPoints', bounds],
    queryFn: ({ signal }) => (bounds ? getMapPoints(bounds, signal) : []),
    enabled: !!bounds && !selectedSupplier,
    select: (data) => {
      if (!mapPoints || !isEqual(data, mapPoints)) {
        setMapPoints(mapMarkersWOffset(data));
        return data;
      }

      return data;
    },
  });

  const handleMarkerClick = useCallback(
    (item: SupplierDTO) => {
      if (!map) return;

      panMapToOffset(map, { lat: item.latitude, lng: item.longitude }, -250);
      setSelectedSupplier(item);
    },
    [map],
  );

  const clusterer = useMemo(() => {
    if (!map) return null;

    return new MarkerClusterer({ map });
  }, [map]);

  useEffect(() => {
    if (!clusterer) return;

    clusterer.clearMarkers();
    clusterer.addMarkers(Object.values(markers));
  }, [clusterer, markers]);

  const setMarkerRef = useCallback((marker: AdvancedMarkerElement | null, id: number) => {
    setMarkers((markers) => {
      if ((marker && markers[id]) || (!marker && !markers[id])) return markers;

      if (marker) {
        return { ...markers, [id]: marker };
      } else {
        delete markers[id];
        return markers;
      }
    });
  }, []);

  useMapBounds(map, setBounds, 600);

  useEffect(() => {
    if (!map || !defaultBoundaries) return;

    map.panTo(defaultBoundaries);
    map.setZoom(13);
  }, [map, defaultBoundaries]);

  return (
    <div className={styles.locationMap}>
      <GoogleMap
        defaultCenter={defaultBoundaries}
        defaultZoom={6}
        mapId={theme === ThemeType.DARK ? environments.darkMapId : environments.lightMapId}
        gestureHandling="greedy"
        streetViewControl={false}
        clickableIcons={false}
        disableDefaultUI
        reuseMaps
        restriction={{
          latLngBounds: UKRAINE_BOUNDS,
        }}
        onClick={() => setSelectedSupplier(null)}
      >
        {mapPoints.map((supplierItem) => (
          <MapMarker
            key={`marker-${supplierItem.id}`}
            item={supplierItem}
            handleClick={handleMarkerClick}
            handleClose={() => setSelectedSupplier(null)}
            isSelected={selectedSupplier?.id === supplierItem.id}
            setMarkerRef={setMarkerRef}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default React.memo(LocationMap);
