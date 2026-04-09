'use client';

import { Form, Input, Select } from 'antd';
import React, { useState } from 'react';
import type { MapRef } from 'react-map-gl/maplibre';

import { SearchBy } from '@/features/map/types';

import styles from '../Filters.module.scss';

const searchByOptions = [
  { label: 'За назвою', value: SearchBy.Name },
  { label: 'За адресою', value: SearchBy.Address },
];

type NominatimHit = {
  display_name: string;
  lat: string;
  lon: string;
};

const SearchBySelect = ({
  searchBy,
  onSearchByChange,
}: {
  searchBy?: SearchBy;
  onSearchByChange: (value: SearchBy) => void;
}) => (
  <Select<SearchBy>
    classNames={{
      popup: { root: styles.searchByPopup },
    }}
    aria-label="Пошук за"
    value={searchBy || SearchBy.Name}
    options={searchByOptions}
    onChange={onSearchByChange}
  />
);

type Props = {
  onSearchChange: (value: string, searchBy: SearchBy) => void;
  mapRef?: MapRef | null;
};

const SearchField = ({ onSearchChange, mapRef }: Props) => {
  const [searchBy, setSearchBy] = useState<SearchBy>(SearchBy.Name);

  const runSearch = async (raw: string) => {
    const value = raw.trim();
    if (!value) {
      onSearchChange('', searchBy);
      return;
    }

    if (searchBy === SearchBy.Name) {
      onSearchChange(value, SearchBy.Name);
      return;
    }

    try {
      const res = await fetch(`/api/nominatim/search?q=${encodeURIComponent(value)}`);
      const data: unknown = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const hit = data[0] as NominatimHit;
        if (hit.display_name && hit.lat != null && hit.lon != null) {
          onSearchChange(hit.display_name, SearchBy.Address);
          mapRef?.flyTo({
            center: [parseFloat(hit.lon), parseFloat(hit.lat)],
            zoom: 14,
            essential: true,
          });
          return;
        }
      }
    } catch {
      /* Nominatim недоступний — лишаємо текстовий пошук для API */
    }

    onSearchChange(value, SearchBy.Address);
  };

  return (
    <Form.Item label="Пошук" layout="vertical" name="search">
      <Input.Search
        allowClear
        className={styles.search}
        placeholder="Пошук"
        addonBefore={<SearchBySelect searchBy={searchBy} onSearchByChange={setSearchBy} />}
        onSearch={runSearch}
      />
    </Form.Item>
  );
};

export default SearchField;
