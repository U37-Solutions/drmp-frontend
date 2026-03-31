'use client';
import { Form, Select } from 'antd';
import React from 'react';

import styles from '@/features/map/components/Filters/Filters.module.scss';
import { useMap } from '@/shared/providers/MapApiProvider';

import { REGION_INFO, REGION_TITLE, Region } from '@/shared/utils/region';

const RegionSelect = ({ value, onChange }: { value?: number; onChange(value: number): void }) => {
  const { map } = useMap();

  const handleRegionChange = (regionId: Region) => {
    onChange(regionId);
    if (map) {
      const regionBounds = REGION_INFO[regionId];
      if (regionBounds) {
        map.fitBounds(
          [
            [regionBounds.south, regionBounds.west],
            [regionBounds.north, regionBounds.east],
          ],
          { animate: true },
        );
        map.setZoom(9, { animate: true });
      }
    }
  };

  return (
    <Form.Item label="Область" layout="vertical" name="region">
      <Select<Region>
        allowClear
        value={value}
        onChange={handleRegionChange}
        options={Object.entries(REGION_TITLE).map(([id, text]) => ({
          label: text,
          value: id,
        }))}
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
        classNames={{ root: styles.select, popup: { root: styles.popup } }}
        placeholder="Область"
      />
    </Form.Item>
  );
};

export default RegionSelect;
