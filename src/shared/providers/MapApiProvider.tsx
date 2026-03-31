'use client';

import type { Map } from 'leaflet';
import React, { createContext, useContext, useMemo, useState } from 'react';

type MapContextValue = {
  map: Map | null;
  setMap: (map: Map | null) => void;
};
const MapContext = createContext<MapContextValue | null>(null);

type MapApiProviderProps = {
  children: React.ReactNode;
};

const MapApiProvider = ({ children }: MapApiProviderProps) => {
  const [map, setMap] = useState<Map | null>(null);
  const value = useMemo(() => ({ map, setMap }), [map]);

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within MapApiProvider');
  }

  return context;
};

export default MapApiProvider;
