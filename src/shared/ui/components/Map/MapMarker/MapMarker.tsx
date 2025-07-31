import { BankOutlined } from '@ant-design/icons';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import React from 'react';

import { SupplierDTO } from '@/features/map/types';

import styles from './MapMarker.module.scss';

type Props = {
  item: SupplierDTO;
  handleClick: (item: SupplierDTO) => void;
};

const MapMarker = ({ item, handleClick }: Props) => {
  const renderCustomPin = () => {
    return (
      <div className={styles.marker}>
        <BankOutlined />
      </div>
    );
  };

  return (
    <AdvancedMarker
      onClick={() => handleClick(item)}
      position={{
        lat: item.latitude,
        lng: item.longitude,
      }}
      title={item.locationName}
      className={styles.marker}
    >
      {renderCustomPin()}
    </AdvancedMarker>
  );
};

export default MapMarker;
