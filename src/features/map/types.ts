import { LocationGeometry } from '@/shared/ui/components/Map/types';

export type GMapsBounds = { ne: LocationGeometry; sw: LocationGeometry };

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
