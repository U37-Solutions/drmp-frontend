import { CityDTO, DictionaryDTO, MapPointsRequestParams, SupplierDTO } from '@/features/map/types';

import apiClient from '@/shared/api/apiClient';
import { environments } from '@/shared/configs/environments';

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

export const getCitiesByRegion = async (regionId?: number): Promise<Array<CityDTO>> =>
  await apiClient.get(`/dictionary/cities/${regionId}`).then((res) => res.data || []);

export type PhotonLocationSuggestion = {
  id: string;
  label: string;
  lat: number;
  lng: number;
};

export const searchPhotonLocations = async (
  query: string,
  signal?: AbortSignal,
): Promise<Array<PhotonLocationSuggestion>> => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery || trimmedQuery.length < 3) return [];

  const params = new URLSearchParams({ q: trimmedQuery });
  const response = await fetch(`${environments.geocoderApiUrl}?${params.toString()}`, { signal, method: 'GET' });
  if (!response.ok) {
    throw new Error(`Geocoder request failed with status ${response.status}`);
  }

  const data = (await response.json()) as { items?: Array<PhotonLocationSuggestion> };
  return data.items || [];
};
