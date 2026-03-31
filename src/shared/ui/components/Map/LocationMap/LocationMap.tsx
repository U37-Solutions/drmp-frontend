'use client';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { getCookie } from 'cookies-next/client';
import { memo, useEffect, useMemo, useRef, useState } from 'react';

import CenterMapByLocation from '@/features/map/components/CenterMapByLocation/CenterMapByLocation';
import { SupplierDTO } from '@/features/map/types';
import useMapDefaultPosition from '@/features/map/useMapDefaultPosition';

import { environments } from '@/shared/configs/environments';
import { useMapInstance } from '@/shared/providers/MapApiProvider';
import { ThemeType } from '@/shared/providers/ThemeProvider';

import { UKRAINE_BOUNDS } from '../constants';
import MapMarker from '../MapMarker/MapMarker';

import styles from './LocationMap.module.scss';

type LocationMapProps = {
  data: Array<SupplierDTO>;
};

const buildMapStyleUrl = (mapStyleId: string, apiKey: string) =>
  `https://api.maptiler.com/maps/${mapStyleId}/style.json?key=${apiKey}`;
const DEFAULT_CENTER: [number, number] = [30.5234, 50.4501];

const LocationMap = ({ data }: LocationMapProps) => {
  const theme = getCookie('theme') as ThemeType;
  const { setMap, mapApiKey } = useMapInstance();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);

  const [selectedSupplier, setSelectedSupplier] = useState<SupplierDTO | null>(null);
  const [localMap, setLocalMap] = useState<maptilersdk.Map | null>(null);

  const { setDefaultCoordinates } = useMapDefaultPosition();
  const styleUrl = useMemo(() => {
    const lightStyle = environments.lightMapId || 'streets-v2';
    const darkStyle = environments.darkMapId || 'dataviz-dark';
    return buildMapStyleUrl(theme === ThemeType.DARK ? darkStyle : lightStyle, mapApiKey);
  }, [mapApiKey, theme]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || !mapApiKey) return;

    maptilersdk.config.apiKey = mapApiKey;
    const createdMap = new maptilersdk.Map({
      container: mapContainerRef.current,
      center: DEFAULT_CENTER,
      zoom: 12,
      style: buildMapStyleUrl('streets-v2', mapApiKey),
      language: maptilersdk.Language.UKRAINIAN,
      navigationControl: false,
      geolocateControl: false,
      dragRotate: false,
      touchPitch: false,
      attributionControl: true,
      maxBounds: [
        [UKRAINE_BOUNDS.west, UKRAINE_BOUNDS.south],
        [UKRAINE_BOUNDS.east, UKRAINE_BOUNDS.north],
      ],
    });

    createdMap.on('click', () => setSelectedSupplier(null));
    createdMap.addControl(
      new maptilersdk.NavigationControl({
        showCompass: false,
        showZoom: true,
        visualizePitch: false,
      }),
      'bottom-right',
    );
    mapRef.current = createdMap;
    setLocalMap(createdMap);
    setMap(createdMap);

    return () => {
      mapRef.current = null;
      setLocalMap(null);
      setMap(null);
      createdMap.remove();
    };
  }, [mapApiKey, setMap]);

  useEffect(() => {
    if (!localMap) return;
    localMap.setStyle(styleUrl);
    localMap.setLanguage(maptilersdk.Language.UKRAINIAN);
  }, [localMap, styleUrl]);

  useEffect(() => {
    if (!localMap) return;
    localMap.resize();
  }, [localMap, data.length]);

  return (
    <div className={styles.locationMap}>
      <div ref={mapContainerRef} className={styles.locationMapCanvas} />
      <div className={styles.locationMapControl}>
        <CenterMapByLocation onSubmit={setDefaultCoordinates} />
      </div>
      {localMap &&
        data.map((supplierItem) => (
          <MapMarker
            key={`marker-${supplierItem.id}`}
            map={localMap}
            item={supplierItem}
            handleClick={(item) => {
              localMap.flyTo({ center: [item.longitude, item.latitude], zoom: 17 });
              setSelectedSupplier(item);
            }}
            handleClose={() => {
              setSelectedSupplier(null);
            }}
            isSelected={selectedSupplier?.id === supplierItem.id}
          />
        ))}
    </div>
  );
};

export default memo(LocationMap);
