import { InfoWindow } from '@vis.gl/react-google-maps';
import React, { useState } from 'react';

import { SupplierDTO } from '@/features/map/types';

type Props = {
  item: SupplierDTO;
  onItemSelect(item: SupplierDTO): void;
};

const LocationMarkerWindow = ({ item }: Props) => {
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  return (
    <div>
      {infoWindowOpen && (
        <InfoWindow
          position={{
            lat: item.latitude,
            lng: item.longitude,
          }}
          onCloseClick={() => setInfoWindowOpen(false)}
        >
          <div>{item.locationName}</div>
        </InfoWindow>
      )}
    </div>
  );
};

export default LocationMarkerWindow;
