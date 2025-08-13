import { useQuery } from '@tanstack/react-query';
import { Select } from 'antd';
import React, { useMemo } from 'react';

import { getCitiesByRegion } from '@/features/map/api';
import styles from '@/features/map/components/Filters/Filters.module.scss';

type Props = {
  regionId?: number;
  value?: string;
  onChange(value: string): void;
};

const CitySelect = ({ regionId, value, onChange }: Props) => {
  const { data } = useQuery({
    queryKey: ['cities', regionId],
    queryFn: () => getCitiesByRegion(regionId),
    enabled: !!regionId,
  });

  const formattedOptions = useMemo(
    () =>
      data?.map((el) => ({
        value: el.object_name,
        label: (
          <span>
            {el.object_name} ({el.community})
          </span>
        ),
      })),
    [data],
  );

  return (
    <Select
      showSearch
      notFoundContent={!regionId ? 'Спочатку оберіть область' : 'Міст не знайдено'}
      options={formattedOptions}
      classNames={{ root: styles.select, popup: { root: styles.popup } }}
      style={{ maxWidth: 110 }}
      placeholder="Місто"
      value={value}
      onChange={onChange}
      allowClear
    />
  );
};

export default CitySelect;
