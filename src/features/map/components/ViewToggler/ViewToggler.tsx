import { CompassOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Segmented } from 'antd';
import React from 'react';

import { ViewMode } from '@/features/map/types';

import styles from './ViewToggler.module.scss';

const ViewToggler = ({ viewMode, onChange }: { viewMode: ViewMode; onChange(mode: ViewMode): void }) => {
  return (
    <Segmented<ViewMode>
      value={viewMode}
      rootClassName={styles.segmented}
      onChange={onChange}
      options={[
        {
          value: ViewMode.Map,
          label: 'Карта',
          icon: <CompassOutlined />,
        },
        {
          value: ViewMode.List,
          label: 'Список',
          icon: <UnorderedListOutlined />,
        },
      ]}
    />
  );
};

export default ViewToggler;
