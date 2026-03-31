'use client';

import type { Map } from '@maptiler/sdk';
import React, { createContext, useContext, useMemo, useState } from 'react';

import { environments } from '../configs/environments';

type MapApiProviderProps = {
  children: React.ReactNode;
};

type MapContextValue = {
  map: Map | null;
  setMap: (map: Map | null) => void;
  mapApiKey: string;
};

const MapContext = createContext<MapContextValue | null>(null);

const MapApiProvider = ({ children }: MapApiProviderProps) => {
  const [map, setMap] = useState<Map | null>(null);
  const mapApiKey = environments.mtMapApiKey;

  const value = useMemo(
    () => ({
      map,
      setMap,
      mapApiKey,
    }),
    [map, mapApiKey],
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const useMapInstance = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapInstance must be used within MapApiProvider');
  }

  return context;
};

export default MapApiProvider;
