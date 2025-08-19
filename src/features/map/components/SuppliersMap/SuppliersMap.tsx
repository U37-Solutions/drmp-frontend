'use client';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useMap } from '@vis.gl/react-google-maps';
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
  const map = useMap();
  const { mapPoints, filters, setFilters } = useMapData();
  const [viewMode, setViewMode] = React.useState<ViewMode>(ViewMode.Map);

  const markerClusterer = useMemo(() => {
    if (!map) return null;

    return new MarkerClusterer({ map });
  }, [map]);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    markerClusterer?.clearMarkers();
  };

  const renderedMap = useMemo(
    () => <LocationMap mapInstance={map} markerClusterer={markerClusterer} data={mapPoints} />,
    [map, mapPoints, markerClusterer],
  );
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
