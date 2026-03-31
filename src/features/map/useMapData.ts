'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { getMapPoints } from '@/features/map/api';
import { MapPointsRequestParams, SupplierDTO } from '@/features/map/types';
import { mapMarkersWOffset } from '@/features/map/utils';

const useMapData = (shouldFetchMapPoints = true) => {
  const [filters, setFilters] = useState<MapPointsRequestParams>({});

  const { data } = useQuery<Array<SupplierDTO>>({
    queryKey: ['mapPoints', filters, shouldFetchMapPoints],
    queryFn: ({ signal }) => getMapPoints(filters, signal),
    select: (data) => (data ? mapMarkersWOffset(data) : []),
    enabled: shouldFetchMapPoints,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  return { mapPoints: data || [], filters, setFilters };
};

export default useMapData;
