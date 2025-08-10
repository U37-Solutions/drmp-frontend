'use client';
import { List } from 'antd';
import React from 'react';

import { SupplierDTO } from '@/features/map/types';

import SupplierDetails from '@/shared/ui/components/Map/SupplierDetails/SupplierDetails';

const SuppliersList = ({ data }: { data: Array<SupplierDTO> }) => {
  return (
    <List
      size="large"
      itemLayout="vertical"
      dataSource={data}
      renderItem={(item) => (
        <List.Item key={`list-item-${item.id}`}>
          <SupplierDetails data={item} />
        </List.Item>
      )}
    ></List>
  );
};

export default SuppliersList;
