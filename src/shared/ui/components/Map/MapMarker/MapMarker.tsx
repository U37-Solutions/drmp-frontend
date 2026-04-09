'use client';
import { BankOutlined } from '@ant-design/icons';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import React, { useCallback } from 'react';

import { SupplierDTO } from '@/features/map/types';

import SupplierDetails from '@/shared/ui/components/Map/SupplierDetails/SupplierDetails';

import styles from './MapMarker.module.scss';

import AdvancedMarkerElement = google.maps.marker.AdvancedMarkerElement;

const SELECTED_MARKER_Z_INDEX = 10000000;

type Props = {
  item: SupplierDTO;
  handleClick: (item: SupplierDTO) => void;
  isSelected: boolean;
  handleClose(): void;
  setMarkerRef(marker: AdvancedMarkerElement | null, id: number): void;
};

const MapMarker = ({ item, handleClick, isSelected, handleClose, setMarkerRef }: Props) => {
  const renderCustomPin = useCallback(() => {
    return (
      <div className={styles.selectedMarker}>
        {isSelected && (
          <div
            className={styles.selectedMarkerWindow}
            onWheel={(e) => e.stopPropagation()}
            onScroll={(e) => e.stopPropagation()}
          >
            <SupplierDetails data={item} onClose={handleClose} />
          </div>
        )}

        <div className={styles.marker}>
          <BankOutlined />
        </div>
      </div>
    );
  }, [handleClose, isSelected, item]);

  const ref = useCallback(
    (marker: AdvancedMarkerElement) => {
      setMarkerRef(marker, item.id);
    },
    [item.id, setMarkerRef],
  );

  if (!item.latitude || !item.longitude) return null;

  return (
    <AdvancedMarker
      zIndex={isSelected ? SELECTED_MARKER_Z_INDEX : 0}
      ref={ref}
      onClick={() => handleClick(item)}
      position={{
        lat: item.latitude,
        lng: item.longitude,
      }}
    >
      {renderCustomPin()}
    </AdvancedMarker>
  );
};

export default React.memo(MapMarker);
