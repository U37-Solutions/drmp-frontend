'use client';

import 'maplibre-gl/dist/maplibre-gl.css';

import type { GeoJSONSource, MapLayerMouseEvent } from 'maplibre-gl';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, { Layer, Popup, Source } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';

import CenterMapByLocation from '@/features/map/components/CenterMapByLocation/CenterMapByLocation';
import { SupplierDTO } from '@/features/map/types';
import useMapDefaultPosition from '@/features/map/useMapDefaultPosition';
import { panMapToOffset } from '@/features/map/utils';

import SupplierDetails from '@/shared/ui/components/Map/SupplierDetails/SupplierDetails';

import styles from './LocationMap.module.scss';
import { createUkraineMapStyle } from './mapStyle';

const UKRAINE_BOUNDS: [number, number, number, number] = [22.0, 44.0, 40.5, 52.5];

const UKRAINE_CENTER = {
  longitude: 31.1656,
  latitude: 48.3794,
  zoom: 6,
};

const SUPPLIERS_SOURCE_ID = 'suppliers';
const LAYER_CLUSTERS = 'supplier-clusters';
const LAYER_CLUSTER_COUNT = 'supplier-cluster-count';
const LAYER_POINT = 'supplier-point';

function MapControls() {
  const { setDefaultCoordinates } = useMapDefaultPosition();
  return (
    <div className={styles.controls}>
      <CenterMapByLocation onSubmit={setDefaultCoordinates} />
    </div>
  );
}

export type LocationMapClientProps = {
  data: Array<SupplierDTO>;
  onMapReady?: (map: MapRef | null) => void;
};

const LocationMapClient = ({ data, onMapReady }: LocationMapClientProps) => {
  const mapRef = useRef<MapRef>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierDTO | null>(null);

  const mapStyle = useMemo(() => createUkraineMapStyle(), []);

  const suppliersGeoJson = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: data
        .filter((s) => s.latitude != null && s.longitude != null)
        .map((s) => ({
          type: 'Feature' as const,
          properties: { id: s.id },
          geometry: {
            type: 'Point' as const,
            coordinates: [s.longitude, s.latitude] as [number, number],
          },
        })),
    }),
    [data],
  );

  useEffect(() => {
    return () => onMapReady?.(null);
  }, [onMapReady]);

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const map = mapRef.current?.getMap();
      if (!map) return;

      const features = e.features;
      if (!features?.length) {
        setSelectedSupplier(null);
        return;
      }

      const feature = features[0];
      const props = feature.properties;

      if (props.cluster_id != null && props.point_count != null) {
        const source = map.getSource(SUPPLIERS_SOURCE_ID) as GeoJSONSource;
        const clusterId = Number(props.cluster_id);
        void source.getClusterExpansionZoom(clusterId).then((zoom) => {
          const geometry = feature.geometry;
          if (geometry.type === 'Point') {
            const coords = geometry.coordinates as [number, number];
            map.easeTo({ center: coords, zoom });
          }
        });
        return;
      }

      const rawId = props.id;
      if (rawId == null) return;

      const supplier = data.find((s) => s.id === Number(rawId));
      if (!supplier) return;

      map.jumpTo({ center: [supplier.longitude, supplier.latitude], zoom: 17 });
      requestAnimationFrame(() => {
        panMapToOffset(map, { lat: supplier.latitude, lng: supplier.longitude }, -250);
      });
      setSelectedSupplier(supplier);
    },
    [data],
  );

  if (!mapStyle) {
    return <div className={styles.locationMap}>Не налаштовано NEXT_PUBLIC_TILES_URL</div>;
  }

  return (
    <div className={styles.locationMap}>
      <Map
        ref={mapRef}
        mapStyle={mapStyle}
        initialViewState={UKRAINE_CENTER}
        minZoom={5}
        maxZoom={18}
        maxBounds={UKRAINE_BOUNDS}
        style={{ width: '100%', height: '100%', borderRadius: 12 }}
        interactiveLayerIds={[LAYER_CLUSTERS, LAYER_CLUSTER_COUNT, LAYER_POINT]}
        onLoad={() => onMapReady?.(mapRef.current)}
        onClick={handleMapClick}
      >
        <MapControls />
        <Source
          id={SUPPLIERS_SOURCE_ID}
          type="geojson"
          data={suppliersGeoJson}
          cluster
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer
            id={LAYER_CLUSTERS}
            type="circle"
            filter={['has', 'point_count']}
            paint={{
              'circle-color': '#1677ff',
              'circle-radius': ['step', ['get', 'point_count'], 18, 10, 22, 50, 28],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
            }}
          />
          <Layer
            id={LAYER_CLUSTER_COUNT}
            type="symbol"
            filter={['has', 'point_count']}
            layout={{
              'text-field': '{point_count_abbreviated}',
              'text-font': ['Noto-Sans-Regular'],
              'text-size': 12,
            }}
            paint={{
              'text-color': '#ffffff',
            }}
          />
          <Layer
            id={LAYER_POINT}
            type="circle"
            filter={['!', ['has', 'point_count']]}
            paint={{
              'circle-color': '#1677ff',
              'circle-radius': 15,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
            }}
          />
        </Source>
        {selectedSupplier && (
          <Popup
            longitude={selectedSupplier.longitude}
            latitude={selectedSupplier.latitude}
            anchor="bottom"
            offset={[0, -24]}
            onClose={() => setSelectedSupplier(null)}
            closeButton
            closeOnClick={false}
            maxWidth="560px"
          >
            <div
              className={styles.popupBody}
              onWheel={(ev) => ev.stopPropagation()}
              onScroll={(ev) => ev.stopPropagation()}
              role="presentation"
            >
              <SupplierDetails data={selectedSupplier} onClose={() => setSelectedSupplier(null)} />
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default memo(LocationMapClient);
