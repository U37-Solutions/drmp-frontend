'use client';
import { FilterOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Form, Popover } from 'antd';
import React, { useCallback, useMemo } from 'react';
import type { MapRef } from 'react-map-gl/maplibre';

import CategorySelect from '@/features/map/components/Filters/components/CategorySelect';
import CitySelect from '@/features/map/components/Filters/components/CitySelect';
import IsFreeSelect from '@/features/map/components/Filters/components/IsFreeSelect';
import RegionSelect from '@/features/map/components/Filters/components/RegionSelect';
import SearchField from '@/features/map/components/Filters/components/SearchField';
import ServiceSelect from '@/features/map/components/Filters/components/ServiceSelect';
import { MapPointsRequestParams, SearchBy } from '@/features/map/types';

import styles from './Filters.module.scss';

type Props = {
  filters: MapPointsRequestParams;
  setFilters: React.Dispatch<React.SetStateAction<MapPointsRequestParams>>;
  mapRef?: MapRef | null;
};

const Filters = ({ filters, setFilters, mapRef }: Props) => {
  const handleFieldChange = useCallback(
    <T extends keyof MapPointsRequestParams>(field: T, value: MapPointsRequestParams[T]) => {
      setFilters((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [setFilters],
  );

  const appliedFiltersCount = useMemo(() => {
    return Object.values(filters).filter((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== '';
    }).length;
  }, [filters]);

  const handleSearch = useCallback(
    (searchValue: string, searchBy: SearchBy) => {
      if (searchValue) {
        setFilters((prev) => ({ ...prev, search: searchValue, searchBy }));
        return;
      }

      setFilters((prev) => ({ ...prev, searchBy: undefined, search: undefined }));
    },
    [setFilters],
  );

  const filtersBody = useMemo(
    () => (
      <>
        <RegionSelect
          mapRef={mapRef}
          value={filters.regionId}
          onChange={(value) => {
            handleFieldChange('city', undefined);
            handleFieldChange('regionId', value);
          }}
        />
        <CitySelect
          regionId={filters.regionId}
          value={filters.city}
          onChange={(value) => handleFieldChange('city', value)}
        />
        <ServiceSelect value={filters.serviceIds} onChange={(value) => handleFieldChange('serviceIds', value)} />
        <CategorySelect value={filters.categoryIds} onChange={(value) => handleFieldChange('categoryIds', value)} />
        <IsFreeSelect onChange={(value) => handleFieldChange('isFree', value)} />
        <SearchField mapRef={mapRef} onSearchChange={handleSearch} />
      </>
    ),
    [
      filters.categoryIds,
      filters.city,
      filters.regionId,
      filters.serviceIds,
      handleSearch,
      handleFieldChange,
      mapRef,
    ],
  );

  return (
    <>
      <Card className={styles.filtersDesktop}>
        <Flex gap={8} className={styles.filtersWrapper}>
          <Form layout="inline">{filtersBody}</Form>
        </Flex>
      </Card>

      <Popover
        getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
        rootClassName={styles.filtersMobilePopover}
        trigger={['click']}
        content={
          <Form>
            <Flex gap={8} vertical className={styles.filtersWrapperMobile}>
              {filtersBody}
            </Flex>
          </Form>
        }
      >
        <Button icon={<FilterOutlined />} rootClassName={styles.filtersMobile}>
          Фільтри {appliedFiltersCount > 0 ? `: ${appliedFiltersCount}` : ''}
        </Button>
      </Popover>
    </>
  );
};

export default Filters;
