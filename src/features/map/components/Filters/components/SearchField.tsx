'use client';
import { Form, Input, Select } from 'antd';
import React from 'react';

import { SearchBy } from '@/features/map/types';

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

  return (
    <Form.Item label="Пошук" layout="vertical" name="search">
      <Input.Search
        allowClear
        className={styles.search}
        placeholder="Пошук"
        addonBefore={<SearchBySelect searchBy={searchBy} onSearchByChange={setSearchBy} />}
        onSearch={(value) => onSearchChange(value, searchBy)}
      />
    </Form.Item>
  );
};

export default SearchField;
