'use client';
import { Card, Flex } from 'antd';
import React from 'react';

import Filters from '@/features/map/components/Filters/Filters';
import useMapData from '@/features/map/useMapData';

import styles from '@/components/pages/HomePage/HomePage.module.scss';

import LocationMap from '@/shared/ui/components/Map/LocationMap/LocationMap';

const SuppliersMap = () => {
  const { mapPoints, filters, setFilters } = useMapData();

  return (
    <Flex vertical gap={8} style={{ width: '100%' }}>
      <Filters filters={filters} setFilters={setFilters} />
      <Card className={styles.mapCard}>
        <LocationMap data={mapPoints} />
      </Card>
    </Flex>
  );
};

export default SuppliersMap;
