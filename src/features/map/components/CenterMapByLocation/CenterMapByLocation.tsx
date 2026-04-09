'use client';
import { CompassOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React from 'react';

import { LocationGeometry } from '@/shared/ui/components/Map/types';

import styles from './CenterMapByLocation.module.scss';

interface Props {
  onSubmit: (location: LocationGeometry) => void;
}

const CenterMapByLocation = ({ onSubmit }: Props) => {
  const handleClick = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onSubmit({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {},
      { enableHighAccuracy: true },
    );
  };

  return (
    <>
      <Tooltip title="Відцентрувати карту по локації. Ваша локація не зберігається та не передається нікуди. Вона використовується лише для відцентрування карти.">
        <Button
          className={styles.button}
          onClick={handleClick}
          color="primary"
          variant="solid"
          icon={<CompassOutlined />}
        />
      </Tooltip>
    </>
  );
};

export default CenterMapByLocation;
