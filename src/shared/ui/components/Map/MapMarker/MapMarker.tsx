'use client';
import { BankOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';
import { DivIcon } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

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
  const markerIcon = useCallback(() => {
    return new DivIcon({
      html: renderToStaticMarkup(
        <div className={styles.marker}>
          <BankOutlined />
        </div>,
      ),
      className: '',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -18],
    });
  }, []);

  if (!item.latitude || !item.longitude) return null;

  return (
    <Marker
      zIndexOffset={isSelected ? 10000 : 0}
      eventHandlers={{
        click: () => handleClick(item),
      }}
      position={[item.latitude, item.longitude]}
      icon={markerIcon()}
    >
      {isSelected && (
        <Popup
          closeButton={false}
          closeOnEscapeKey
          autoPan={false}
          className={styles.leafletPopup}
          eventHandlers={{ remove: handleClose }}
        >
          <div className={styles.selectedMarkerWindow}>
            <SupplierDetails data={item} onClose={handleClose} />
          </div>
        </Popup>
      )}
    </Marker>
  );
};

export default React.memo(MapMarker);
