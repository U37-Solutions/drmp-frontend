'use client';

import { Card, Flex } from 'antd';
import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import type { MapRef } from 'react-map-gl/maplibre';

import Filters from '@/features/map/components/Filters/Filters';
import SuppliersList from '@/features/map/components/SuppliersList/SuppliersList';
import ViewToggler from '@/features/map/components/ViewToggler/ViewToggler';
import { ViewMode } from '@/features/map/types';
import useMapData from '@/features/map/useMapData';

import LocationMap from '@/shared/ui/components/Map/LocationMap/LocationMap';

import styles from './SuppliersMap.module.scss';

const SuppliersMap = () => {
  const [mapRef, setMapRef] = useState<MapRef | null>(null);
  const { mapPoints, filters, setFilters } = useMapData();
  const [viewMode, setViewMode] = React.useState<ViewMode>(ViewMode.Map);

  const handleMapReady = useCallback((ref: MapRef | null) => {
    setMapRef(ref);
  }, []);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const renderedMap = useMemo(
    () => <LocationMap onMapReady={handleMapReady} data={mapPoints} />,
    [mapPoints, handleMapReady],
  );
  const renderedList = useMemo(() => <SuppliersList data={mapPoints} />, [mapPoints]);

  return (
    <Flex vertical gap={8} className={styles.wrapper}>
      <Flex justify="space-between">
        <Filters filters={filters} setFilters={setFilters} mapRef={mapRef} />
      </Flex>
      <Card className={styles.mapCard}>
        <ViewToggler viewMode={viewMode} onChange={handleViewModeChange} />
        <div
          className={classNames(styles.cardContent, {
            [styles.cardContentScrollable]: viewMode === ViewMode.List,
          })}
        >
          {viewMode === ViewMode.Map ? renderedMap : renderedList}
        </div>
      </Card>
    </Flex>
  );
};

export default SuppliersMap;
