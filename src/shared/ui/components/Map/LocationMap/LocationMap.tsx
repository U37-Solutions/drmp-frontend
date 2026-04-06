'use client';

import dynamic from 'next/dynamic';
import { memo } from 'react';
import type { MapRef } from 'react-map-gl/maplibre';

import { SupplierDTO } from '@/features/map/types';

export type LocationMapProps = {
  data: Array<SupplierDTO>;
  onMapReady?: (map: MapRef | null) => void;
};

const LocationMapClient = dynamic(() => import('./LocationMapClient'), { ssr: false });

const LocationMap = (props: LocationMapProps) => <LocationMapClient {...props} />;

export default memo(LocationMap);
