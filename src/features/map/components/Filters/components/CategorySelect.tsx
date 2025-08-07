import { useQuery } from '@tanstack/react-query';
import { Select } from 'antd';
import React, { useMemo } from 'react';

import { getCategoryDictionary } from '@/features/map/api';
import styles from '@/features/map/components/Filters/Filters.module.scss';
import { DictionaryDTO } from '@/features/map/types';

type Props = {
  value?: Array<string>;
  onChange: (value: Array<string>) => void;
};

const CategorySelect = ({ value, onChange }: Props) => {
  const { data } = useQuery<Array<DictionaryDTO>>({
    queryKey: ['categories'],
    queryFn: getCategoryDictionary,
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
      placeholder="Категорії постраждалих"
      value={value}
      onChange={onChange}
      options={options}
    />
  );
};

export default CategorySelect;
