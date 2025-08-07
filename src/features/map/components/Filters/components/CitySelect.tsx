import { Select } from 'antd';
import React from 'react';

import styles from '@/features/map/components/Filters/Filters.module.scss';

const CitySelect = ({ value, onChange }: { value?: string; onChange(value: string): void }) => {
  return (
    <Select
      classNames={{ root: styles.select, popup: { root: styles.popup } }}
      style={{ maxWidth: 110 }}
      placeholder="Місто"
      value={value}
      onChange={onChange}
    />
  );
};

export default CitySelect;
