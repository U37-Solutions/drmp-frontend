'use client';
import { Form, Select } from 'antd';
import React from 'react';
import type { MapRef } from 'react-map-gl/maplibre';

import styles from '@/features/map/components/Filters/Filters.module.scss';

import { REGION_INFO, REGION_TITLE, Region } from '@/shared/utils/region';

const RegionSelect = ({
  value,
  onChange,
  mapRef,
}: {
  value?: number;
  onChange(value: number): void;
  mapRef?: MapRef | null;
}) => {
  const handleRegionChange = (regionId: Region) => {
    onChange(regionId);
    if (mapRef) {
      const regionBounds = REGION_INFO[regionId];
      if (regionBounds) {
        mapRef.fitBounds(
          [
            [regionBounds.west, regionBounds.south],
            [regionBounds.east, regionBounds.north],
          ],
          { maxZoom: 9, padding: 24 },
        );
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
