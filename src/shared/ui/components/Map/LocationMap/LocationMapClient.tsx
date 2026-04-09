'use client';

import 'maplibre-gl/dist/maplibre-gl.css';

import type { GeoJSONSource, MapLayerMouseEvent, Map as MapLibreMap } from 'maplibre-gl';
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
  longitude: 30.5234,
  latitude: 50.4501,
  zoom: 11,
};

const SUPPLIERS_SOURCE_ID = 'suppliers';
const LAYER_CLUSTERS = 'supplier-clusters';
const LAYER_CLUSTER_COUNT = 'supplier-cluster-count';
const LAYER_POINT = 'supplier-point';

/** Bank-style pin as SVG; loaded into the map style for symbol layers. */
const SUPPLIER_MARKER_ICON_ID = 'supplier-marker';

const supplierMarkerDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="28" fill="#1677ff" stroke="#ffffff" stroke-width="3"/>
    <rect x="18" y="18" width="28" height="5" rx="1" fill="#e6f4ff"/>
    <rect x="20" y="25" width="24" height="20" rx="2" fill="#e6f4ff"/>
    <rect x="24" y="29" width="3" height="12" fill="#1677ff"/>
    <rect x="30.5" y="29" width="3" height="12" fill="#1677ff"/>
    <rect x="37" y="29" width="3" height="12" fill="#1677ff"/>
  </svg>`,
)}`;

function ensureSupplierMarkerImage(map: MapLibreMap | null | undefined) {
  if (!map || map.hasImage(SUPPLIER_MARKER_ICON_ID)) return;
  const img = new Image(64, 64);
  img.onload = () => {
    if (!map.hasImage(SUPPLIER_MARKER_ICON_ID)) {
      map.addImage(SUPPLIER_MARKER_ICON_ID, img);
      map.triggerRepaint();
    }
  };
  img.src = supplierMarkerDataUrl;
}

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
        onLoad={() => {
          const mapInstance = mapRef.current?.getMap() ?? null;
          ensureSupplierMarkerImage(mapInstance);
          onMapReady?.(mapRef.current);
        }}
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
            type="symbol"
            filter={['!', ['has', 'point_count']]}
            layout={{
              'icon-image': SUPPLIER_MARKER_ICON_ID,
              'icon-size': 0.55,
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
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
            closeButton={false}
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
