'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { getMapPoints } from '@/features/map/api';
import { MapPointsRequestParams, SupplierDTO } from '@/features/map/types';
import { mapMarkersWOffset } from '@/features/map/utils';

const useMapData = () => {
  const [filters, setFilters] = useState<MapPointsRequestParams>({});

  const { data } = useQuery<Array<SupplierDTO>>({
    queryKey: ['mapPoints', filters],
    queryFn: ({ signal }) => getMapPoints(filters, signal),
    select: (data) => (data ? mapMarkersWOffset(data) : []),
  });

  return { mapPoints: data || [], filters, setFilters };
};

export default useMapData;
