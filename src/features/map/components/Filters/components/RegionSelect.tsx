'use client';
import { Select } from 'antd';
import React from 'react';

import styles from '@/features/map/components/Filters/Filters.module.scss';

import { REGION_TITLE } from '@/shared/utils/region';

const RegionSelect = ({ value, onChange }: { value?: number; onChange(value: number): void }) => {
  return (
    <Select
      allowClear
      value={value}
      onChange={onChange}
      options={Object.entries(REGION_TITLE).map(([id, text]) => ({
        label: text,
        value: id,
      }))}
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      classNames={{ root: styles.select, popup: { root: styles.popup } }}
      placeholder="Області"
    />
  );
};

export default RegionSelect;
