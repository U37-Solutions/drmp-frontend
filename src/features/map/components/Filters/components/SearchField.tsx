'use client';
import { Form, Input, Select } from 'antd';
import React from 'react';

import { SearchBy } from '@/features/map/types';

import { environments } from '@/shared/configs/environments';

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

  const handleSearch = async (searchValue: string) => {
    const normalizedValue = searchValue.trim();
    if (!normalizedValue) {
      onSearchChange('', searchBy);
      return;
    }

    if (searchBy !== SearchBy.Address || !environments.mtMapApiKey) {
      onSearchChange(normalizedValue, searchBy);
      return;
    }

    const searchParams = new URLSearchParams({
      key: environments.mtMapApiKey,
      language: 'uk',
      country: 'ua',
      limit: '1',
      autocomplete: 'true',
    });

    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(normalizedValue)}.json?${searchParams.toString()}`,
      );
      if (!response.ok) {
        onSearchChange(normalizedValue, searchBy);
        return;
      }

      const data = (await response.json()) as { features?: Array<{ place_name?: string }> };
      const firstMatch = data.features?.[0]?.place_name;
      onSearchChange(firstMatch || normalizedValue, searchBy);
    } catch {
      onSearchChange(normalizedValue, searchBy);
    }
  };

  return (
    <Form.Item label="Пошук" layout="vertical" name="search">
      <Input.Search
        allowClear
        className={styles.search}
        placeholder="Пошук"
        addonBefore={<SearchBySelect searchBy={searchBy} onSearchByChange={setSearchBy} />}
        onSearch={handleSearch}
      />
    </Form.Item>
  );
};

export default SearchField;
