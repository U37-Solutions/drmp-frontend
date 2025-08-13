import { LocationGeometry } from '@/shared/ui/components/Map/types';

export type GMapsBounds = { ne: LocationGeometry; sw: LocationGeometry };

export enum SearchBy {
  Name = 'name',
  Address = 'address',
}

export enum ViewMode {
  Map = 'map',
  List = 'list',
}

export interface MapPointsRequestParams {
  isFree?: boolean;
  regionId?: number;
  city?: string;
  serviceIds?: Array<string>;
  categoryIds?: Array<string>;
  boundaries?: GMapsBounds;
  search?: string;
  searchBy?: SearchBy;
}

export interface DictionaryDTO {
  id: number;
  name: string;
}

export interface CityDTO {
  community: string;
  object_category: string;
  object_name: string;
}

export interface SocialMediaDTO {
  type: 'facebook' | 'instagram' | 'website';
  url: string;
}

export interface SupplierDTO {
  id: number;
  locationName: string;
  workSchedule: string;
  additionalDescription: string;
  latitude: number;
  longitude: number;
  companyId: number;
  regionName: string;
  services: string[];
  categories: string[];
  conditions: string[];
  customFields: Array<{
    structureId: number;
    value: string;
  }>;
  city: string;
  isFree: boolean;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  socials: Array<SocialMediaDTO>;
}
