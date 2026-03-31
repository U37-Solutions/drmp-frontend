'use client';
import { CompassOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React, { useState } from 'react';

import { LocationGeometry } from '@/shared/ui/components/Map/types';

import styles from './CenterMapByLocation.module.scss';

interface Props {
  onSubmit: (location: LocationGeometry) => void;
}

const CenterMapByLocation = ({ onSubmit }: Props) => {
  const [isLocating, setIsLocating] = useState(false);

  const handleClick = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onSubmit({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 7000,
        maximumAge: 60000,
      },
    );
  };

  return (
    <>
      <Tooltip title="Відцентрувати карту по локації. Ваша локація не зберігається та не передається нікуди. Вона використовується лише для відцентрування карти.">
        <Button
          className={styles.button}
          loading={isLocating}
          disabled={isLocating}
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
