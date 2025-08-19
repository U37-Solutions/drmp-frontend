'use client';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { Map as GoogleMap } from '@vis.gl/react-google-maps';
import { getCookie } from 'cookies-next/client';
import { memo, useCallback, useEffect, useState } from 'react';

import { SupplierDTO } from '@/features/map/types';
import useMapDefaultPosition from '@/features/map/useMapDefaultPosition';
import { panMapToOffset } from '@/features/map/utils';

import { environments } from '@/shared/configs/environments';
import { ThemeType } from '@/shared/providers/ThemeProvider';

import { UKRAINE_BOUNDS } from '../constants';
import MapMarker from '../MapMarker/MapMarker';

import styles from './LocationMap.module.scss';

import AdvancedMarkerElement = google.maps.marker.AdvancedMarkerElement;

type LocationMapProps = {
  data: Array<SupplierDTO>;
  markerClusterer: MarkerClusterer | null;
  mapInstance?: google.maps.Map | null;
};

const LocationMap = ({ data, markerClusterer, mapInstance: map }: LocationMapProps) => {
  const theme = getCookie('theme') as ThemeType;

  const [selectedSupplier, setSelectedSupplier] = useState<SupplierDTO | null>(null);
  const [markers, setMarkers] = useState<{ [id: number]: AdvancedMarkerElement }>({});

  const defaultCenter = useMapDefaultPosition();

  const handleMarkerClick = useCallback(
    (item: SupplierDTO) => {
      if (!map) return;

      map.setZoom(17);
      panMapToOffset(map, { lat: item.latitude, lng: item.longitude }, -250);
      setSelectedSupplier(item);
    },
    [map],
  );

  useEffect(() => {
    if (!markerClusterer) return;

    markerClusterer.clearMarkers();
    markerClusterer.addMarkers(Object.values(markers));
  }, [markerClusterer, markers, data]);

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

  return (
    <div className={styles.locationMap}>
      <GoogleMap
        defaultCenter={defaultCenter}
        defaultZoom={12}
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
        {data.map((supplierItem) => (
          <MapMarker
            key={`marker-${supplierItem.id}`}
            item={supplierItem}
            handleClick={handleMarkerClick}
            handleClose={() => {
              setSelectedSupplier(null);
            }}
            isSelected={selectedSupplier?.id === supplierItem.id}
            setMarkerRef={setMarkerRef}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default memo(LocationMap);
