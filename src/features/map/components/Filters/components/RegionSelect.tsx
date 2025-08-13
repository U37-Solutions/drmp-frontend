'use client';
import { useMap } from '@vis.gl/react-google-maps';
import { Select } from 'antd';
import React from 'react';

import styles from '@/features/map/components/Filters/Filters.module.scss';

import { REGION_INFO, REGION_TITLE, Region } from '@/shared/utils/region';

const RegionSelect = ({ value, onChange }: { value?: number; onChange(value: number): void }) => {
  const map = useMap();

  const handleRegionChange = (regionId: Region) => {
    onChange(regionId);
    if (map) {
      const regionBounds = REGION_INFO[regionId];
      if (regionBounds) {
        map.fitBounds(regionBounds);
        map.setZoom(9);
      }
    }
  };

  return (
    <Select<Region>
      allowClear
      value={value}
      onChange={handleRegionChange}
      style={{ maxWidth: 110 }}
      options={Object.entries(REGION_TITLE).map(([id, text]) => ({
        label: text,
        value: id,
      }))}
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      classNames={{ root: styles.select, popup: { root: styles.popup } }}
      placeholder="Область"
    />
  );
};

export default RegionSelect;
