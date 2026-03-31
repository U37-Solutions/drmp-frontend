'use client';
import { getCookie } from 'cookies-next/client';
import L from 'leaflet';
import { memo, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, useMap as useLeafletMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

import CenterMapByLocation from '@/features/map/components/CenterMapByLocation/CenterMapByLocation';
import { SupplierDTO } from '@/features/map/types';
import useMapDefaultPosition from '@/features/map/useMapDefaultPosition';
import { panMapToOffset } from '@/features/map/utils';

import { environments } from '@/shared/configs/environments';
import { useMap } from '@/shared/providers/MapApiProvider';
import { ThemeType } from '@/shared/providers/ThemeProvider';

import { UKRAINE_BOUNDS } from '../constants';
import MapMarker from '../MapMarker/MapMarker';

import styles from './LocationMap.module.scss';

type LocationMapProps = {
  data: Array<SupplierDTO>;
};

const BoundsSync = () => {
  const { setMap } = useMap();
  const map = useLeafletMap();

  useEffect(() => {
    setMap(map);
    return () => setMap(null);
  }, [map, setMap]);

  return null;
};

const MapClickHandler = ({ onClick }: { onClick: () => void }) => {
  useMapEvents({
    click: () => onClick(),
  });

  return null;
};

const LocationMap = ({ data }: LocationMapProps) => {
  const theme = getCookie('theme') as ThemeType;
  const { map } = useMap();

  const [selectedSupplier, setSelectedSupplier] = useState<SupplierDTO | null>(null);
  const { defaultCoordinates, setDefaultCoordinates } = useMapDefaultPosition();

  const mapBounds = useMemo(
    () =>
      L.latLngBounds(
        [UKRAINE_BOUNDS.south, UKRAINE_BOUNDS.west],
        [UKRAINE_BOUNDS.north, UKRAINE_BOUNDS.east],
      ),
    [],
  );

  return (
    <div className={styles.locationMap}>
      <MapContainer
        center={defaultCoordinates}
        zoom={12}
        minZoom={6}
        maxZoom={19}
        zoomControl={false}
        maxBounds={mapBounds}
        maxBoundsViscosity={1}
        className={styles.locationMapContent}
      >
        <BoundsSync />
        <MapClickHandler onClick={() => setSelectedSupplier(null)} />
        <TileLayer
          url={theme === ThemeType.DARK ? environments.darkTileUrl : environments.lightTileUrl}
          attribution={
            theme === ThemeType.DARK
              ? environments.darkTileAttribution
              : environments.lightTileAttribution
          }
        />
        <MarkerClusterGroup chunkedLoading>
          {data.map((supplierItem) => (
            <MapMarker
              key={`marker-${supplierItem.id}`}
              item={supplierItem}
              handleClick={(item) => {
                if (!map) return;
                map.setZoom(17, { animate: true });
                panMapToOffset(map, [item.latitude, item.longitude], -250);
                setSelectedSupplier(item);
              }}
              handleClose={() => {
                setSelectedSupplier(null);
              }}
              isSelected={selectedSupplier?.id === supplierItem.id}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
      <div className={styles.controls}>
        <CenterMapByLocation onSubmit={setDefaultCoordinates} />
      </div>
      <div className={styles.licenseNotice}>
        Map data: OpenStreetMap contributors, geocoding: Photon (Komoot) / OpenStreetMap.
      </div>
    </div>
  );
};

export default memo(LocationMap);
