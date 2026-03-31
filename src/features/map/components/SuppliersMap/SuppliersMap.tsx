'use client';
import { Card, Flex } from 'antd';
import React, { useMemo } from 'react';

import Filters from '@/features/map/components/Filters/Filters';
import SuppliersList from '@/features/map/components/SuppliersList/SuppliersList';
import ViewToggler from '@/features/map/components/ViewToggler/ViewToggler';
import { ViewMode } from '@/features/map/types';
import useMapData from '@/features/map/useMapData';

import LocationMap from '@/shared/ui/components/Map/LocationMap/LocationMap';

import styles from './SuppliersMap.module.scss';

const SuppliersMap = () => {
  const { mapPoints, filters, setFilters } = useMapData();
  const [viewMode, setViewMode] = React.useState<ViewMode>(ViewMode.Map);

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
