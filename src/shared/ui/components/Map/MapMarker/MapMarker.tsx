'use client';
import { BankOutlined } from '@ant-design/icons';
import type { Map } from '@maptiler/sdk';
import * as maptilersdk from '@maptiler/sdk';
import React, { useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

import { SupplierDTO } from '@/features/map/types';

import SupplierDetails from '@/shared/ui/components/Map/SupplierDetails/SupplierDetails';

import styles from './MapMarker.module.scss';

type Props = {
  map: Map;
  item: SupplierDTO;
  handleClick: (item: SupplierDTO) => void;
  isSelected: boolean;
  handleClose(): void;
};

const MapMarker = ({ map, item, handleClick, isSelected, handleClose }: Props) => {
  const markerElement = useMemo(() => document.createElement('div'), []);
  const markerRoot = useMemo(() => createRoot(markerElement), [markerElement]);

  useEffect(() => {
    const marker = new maptilersdk.Marker({ element: markerElement, anchor: 'bottom' })
      .setLngLat([item.longitude, item.latitude])
      .addTo(map);

    markerElement.onclick = (event) => {
      event.stopPropagation();
      handleClick(item);
    };

    return () => {
      marker.remove();
      markerRoot.unmount();
    };
  }, [handleClick, item, map, markerElement, markerRoot]);

  useEffect(() => {
    markerRoot.render(
      <div className={styles.selectedMarker}>
        {isSelected && (
          <div
            className={styles.selectedMarkerWindow}
            onClick={(event) => event.stopPropagation()}
            onWheel={(event) => event.stopPropagation()}
            onScroll={(event) => event.stopPropagation()}
          >
            <SupplierDetails data={item} onClose={handleClose} />
          </div>
        )}
        <div className={styles.marker}>
          <BankOutlined />
        </div>
      </div>,
    );
  }, [handleClose, isSelected, item, markerRoot]);

  if (!item.latitude || !item.longitude) return null;

  return null;
};

export default React.memo(MapMarker);
