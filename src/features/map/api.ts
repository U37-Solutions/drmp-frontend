import { GMapsBounds, SupplierDTO } from '@/features/map/types';

import apiClient from '@/shared/api/apiClient';

export const getMapPoints = async (bounds: GMapsBounds, signal: AbortSignal): Promise<Array<SupplierDTO>> => {
  const { sw, ne } = bounds;
  const boundariesArrayAsString = [sw.lat, sw.lng, ne.lat, ne.lng].join(',');

  return await apiClient
    .get(`/public/map-points?boundaries=${boundariesArrayAsString}`, { signal })
    .then((res) => res.data);
};
