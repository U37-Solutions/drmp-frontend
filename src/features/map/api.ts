import { DictionaryDTO, MapPointsRequestParams, SupplierDTO } from '@/features/map/types';

import apiClient from '@/shared/api/apiClient';

const formatRequestParams = (params: MapPointsRequestParams) => {
  if (params.boundaries) {
    return {
      boundaries: [
        params.boundaries.sw.lat,
        params.boundaries.sw.lng,
        params.boundaries.ne.lat,
        params.boundaries.ne.lng,
      ].join(','),
    };
  }

  return Object.fromEntries(
    Object.entries(params)
      .map(([key, value]) => [key, Array.isArray(value) ? value.join(',') : value])
      .filter(([, value]) => !!value),
  );
};

export const getMapPoints = async (
  params: MapPointsRequestParams,
  signal: AbortSignal,
): Promise<Array<SupplierDTO>> => {
  const queryParams = formatRequestParams(params);

  return await apiClient.get(`/public/map-points`, { params: queryParams, signal }).then((res) => res.data || []);
};

export const getServiceDictionary = async (): Promise<Array<DictionaryDTO>> =>
  await apiClient.get('/dictionary/services').then((res) => res.data);

export const getCategoryDictionary = async (): Promise<Array<DictionaryDTO>> =>
  await apiClient.get('/dictionary/categories').then((res) => res.data);
