'use client';
import { BankOutlined } from '@ant-design/icons';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import React, { useCallback } from 'react';

import { SupplierDTO } from '@/features/map/types';

import SupplierDetails from '@/shared/ui/components/Map/SupplierDetails/SupplierDetails';

import styles from './MapMarker.module.scss';

type Props = {
  item: SupplierDTO;
  handleClick: (item: SupplierDTO) => void;
  isSelected: boolean;
  handleClose(): void;
};

const MapMarker = ({ item, handleClick, isSelected, handleClose }: Props) => {
  const renderCustomPin = useCallback(() => {
    return (
      <div className={styles.selectedMarker}>
        {isSelected && (
          <div className={styles.selectedMarkerWindow}>
            <SupplierDetails data={item} onClose={handleClose} />
          </div>
        )}

        <div className={styles.marker}>
          <BankOutlined />
        </div>
      </div>
    );
  }, [handleClose, isSelected, item]);

  return (
    <AdvancedMarker
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
