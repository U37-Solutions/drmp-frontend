'use client';
import { Card, Flex } from 'antd';
import dynamic from 'next/dynamic';
import React, { useCallback, useMemo, useState } from 'react';

import Filters from '@/features/map/components/Filters/Filters';
import SuppliersList from '@/features/map/components/SuppliersList/SuppliersList';
import ViewToggler from '@/features/map/components/ViewToggler/ViewToggler';
import { GMapsBounds, ViewMode } from '@/features/map/types';
import useMapBounds from '@/features/map/useMapBounds';
import useMapData from '@/features/map/useMapData';
import { useMap } from '@/shared/providers/MapApiProvider';

import styles from './SuppliersMap.module.scss';

const LocationMap = dynamic(() => import('@/shared/ui/components/Map/LocationMap/LocationMap'), {
  ssr: false,
});
const MIN_DATA_ZOOM = 8;
const isSameBounds = (a?: GMapsBounds, b?: GMapsBounds) => {
  if (!a || !b) return false;
  const round = (value: number) => Number(value.toFixed(4));

  return (
    round(a.ne.lat) === round(b.ne.lat) &&
    round(a.ne.lng) === round(b.ne.lng) &&
    round(a.sw.lat) === round(b.sw.lat) &&
    round(a.sw.lng) === round(b.sw.lng)
  );
};

const SuppliersMap = () => {
  const { map } = useMap();
  const [shouldFetchMapPoints, setShouldFetchMapPoints] = useState(true);
  const { mapPoints, filters, setFilters } = useMapData(shouldFetchMapPoints);
  const [viewMode, setViewMode] = React.useState<ViewMode>(ViewMode.Map);

  const handleBoundsChange = useCallback(
    (boundaries: GMapsBounds) => {
      const zoom = map?.getZoom() || 0;
      const shouldFetch = zoom >= MIN_DATA_ZOOM;
      setShouldFetchMapPoints(shouldFetch);

      setFilters((prev) => {
        if (!shouldFetch) {
          if (!prev.boundaries) return prev;
          return { ...prev, boundaries: undefined };
        }

        if (isSameBounds(prev.boundaries, boundaries)) return prev;

        return { ...prev, boundaries };
      });
    },
    [map, setFilters],
  );

  useMapBounds(map, handleBoundsChange, 450);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const renderedMap = useMemo(() => <LocationMap data={mapPoints} />, [mapPoints]);
  const renderedList = useMemo(() => <SuppliersList data={mapPoints} />, [mapPoints]);

  return (
    <Flex vertical gap={8} className={styles.wrapper}>
      <Flex justify="space-between">
        <Filters filters={filters} setFilters={setFilters} />
      </Flex>
      <Card className={styles.mapCard}>
        <ViewToggler viewMode={viewMode} onChange={handleViewModeChange} />
        {viewMode === ViewMode.Map ? renderedMap : renderedList}
      </Card>
    </Flex>
  );
};

export default SuppliersMap;
