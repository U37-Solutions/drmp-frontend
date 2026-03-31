'use client';
import { Form, Select } from 'antd';
import React, { useEffect } from 'react';

import styles from '@/features/map/components/Filters/Filters.module.scss';

import { useMapInstance } from '@/shared/providers/MapApiProvider';
import { REGION_INFO, REGION_TITLE, Region } from '@/shared/utils/region';

const focusRegion = (map: NonNullable<ReturnType<typeof useMapInstance>['map']>, regionId: Region) => {
  const regionBounds = REGION_INFO[regionId];
  if (!regionBounds) return;

  map.fitBounds(
    [
      [regionBounds.west, regionBounds.south],
      [regionBounds.east, regionBounds.north],
    ],
    { padding: 24, duration: 350 },
  );
};

const RegionSelect = ({ value, onChange }: { value?: number; onChange(value?: number): void }) => {
  const { map } = useMapInstance();

  useEffect(() => {
    if (!map || value == null) return;
    focusRegion(map, Number(value) as Region);
  }, [map, value]);

  const handleRegionChange = (regionId?: Region) => {
    onChange(regionId);
    if (regionId == null) return;
    if (map) focusRegion(map, regionId);
  };

  return (
    <Form.Item label="Область" layout="vertical" name="region">
      <Select<Region>
        allowClear
        value={value}
        onChange={handleRegionChange}
        options={Object.entries(REGION_TITLE).map(([id, text]) => ({
          label: text,
          value: Number(id),
        }))}
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
        classNames={{ root: styles.select, popup: { root: styles.popup } }}
        placeholder="Область"
      />
    </Form.Item>
  );
};

export default RegionSelect;
