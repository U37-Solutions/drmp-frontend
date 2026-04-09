'use client';

import { APIProvider } from '@vis.gl/react-google-maps';

import { environments } from '../configs/environments';

type MapApiProviderProps = {
  children: React.ReactNode;
};

const MapApiProvider = ({ children }: MapApiProviderProps) => {
  return (
    <APIProvider apiKey={environments.mapApiKey} language="uk" region="UA">
      {children}
    </APIProvider>
  );
};

export default MapApiProvider;
