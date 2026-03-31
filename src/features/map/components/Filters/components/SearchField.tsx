'use client';
import { Form, Input, Select } from 'antd';
import React from 'react';

import { searchPhotonLocations } from '@/features/map/api';
import { SearchBy } from '@/features/map/types';
import { useMap } from '@/shared/providers/MapApiProvider';

import styles from '../Filters.module.scss';

const searchByOptions = [
  { label: 'За назвою', value: SearchBy.Name },
  { label: 'За адресою', value: SearchBy.Address },
];

const SearchBySelect = ({
  searchBy,
  onSearchByChange,
}: {
  searchBy?: SearchBy;
  onSearchByChange: (value: SearchBy) => void;
}) => {
  return (
    <Select
      classNames={{
        popup: { root: styles.searchByPopup },
      }}
      aria-label="Пошук за"
      value={searchBy || SearchBy.Name}
      options={searchByOptions}
      onChange={onSearchByChange}
    />
  );
};

type Props = {
  onSearchChange: (value: string, searchBy: SearchBy) => void;
};

const SearchField = ({ onSearchChange }: Props) => {
  const [searchBy, setSearchBy] = React.useState<SearchBy>(SearchBy.Name);
  const [isLoading, setIsLoading] = React.useState(false);
  const { map } = useMap();

  const handleSearch = async (value: string) => {
    const nextValue = value.trim();
    onSearchChange(nextValue, searchBy);

    if (!nextValue || searchBy !== SearchBy.Address) return;

    setIsLoading(true);
    try {
      const results = await searchPhotonLocations(nextValue);
      const firstResult = results[0];
      if (firstResult && map) {
        map.setView([firstResult.lat, firstResult.lng], 14, { animate: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form.Item label="Пошук" layout="vertical" name="search">
      <Input.Search
        allowClear
        className={styles.search}
        placeholder="Пошук"
        loading={isLoading}
        addonBefore={<SearchBySelect searchBy={searchBy} onSearchByChange={setSearchBy} />}
        onSearch={handleSearch}
      />
    </Form.Item>
  );
};

export default SearchField;
