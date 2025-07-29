import { AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import React, { useState } from 'react';

import { LocationGeometry, LocationMarker } from '../types';

import styles from './LocationMarkerWindow.module.scss';

type LocationMarkerWindowProps = LocationMarker & {
  onPositionSelect: (position: LocationGeometry | null) => void;
};

const LocationMarkerWindow = ({ position, content, onPositionSelect }: LocationMarkerWindowProps) => {
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  const handleMarkerClick = () => {
    setInfoWindowOpen(true);
    onPositionSelect(position);
  };

  const handleInfoWindowClose = () => {
    setInfoWindowOpen(false);
    onPositionSelect(null);
  };

  return (
    <div className={styles.locationMarkerWindow}>
      <AdvancedMarker position={position} clickable onClick={handleMarkerClick} />
      {infoWindowOpen && (
        <InfoWindow position={position} onCloseClick={handleInfoWindowClose}>
          <div className={styles.locationMarkerWindow__infoWindow}>{content}</div>
        </InfoWindow>
      )}
    </div>
  );
};

export default LocationMarkerWindow;
