'use client';
import { useQuery } from '@tanstack/react-query';
import { Select } from 'antd';
import React, { useMemo } from 'react';

import { getServiceDictionary } from '@/features/map/api';
import { DictionaryDTO } from '@/features/map/types';

import styles from '../Filters.module.scss';

type Props = {
  value?: Array<string>;
  onChange: (value: Array<string>) => void;
};

const ServiceSelect = ({ value, onChange }: Props) => {
  const { data } = useQuery<Array<DictionaryDTO>>({
    queryKey: ['services'],
    queryFn: getServiceDictionary,
  });

  const options = useMemo(
    () =>
      (data || []).map((item) => ({
        label: item.name,
        value: item.id,
      })),
    [data],
  );

  return (
    <Select
      mode="multiple"
      allowClear
      maxTagCount={1}
      optionFilterProp="label"
      classNames={{ root: styles.select, popup: { root: styles.popup } }}
      placeholder="Категорії допомоги"
      value={value}
      onChange={onChange}
      options={options}
    />
  );
};

export default ServiceSelect;
