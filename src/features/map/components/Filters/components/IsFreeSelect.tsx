import { Form, Select } from 'antd';
import React from 'react';

import styles from '@/features/map/components/Filters/Filters.module.scss';

enum ServicePaymentType {
  Free = 'free',
  Paid = 'paid',
}

const OPTIONS = [
  { label: 'Безкоштовна', value: ServicePaymentType.Free },
  { label: 'Платна', value: ServicePaymentType.Paid },
];

type Props = {
  onChange: (value?: boolean) => void;
};

const IsFreeSelect = ({ onChange }: Props) => {
  const [value, setValue] = React.useState<Array<ServicePaymentType>>();

  const handleChange = (value: Array<ServicePaymentType>) => {
    setValue(value);

    if (value.length === 1) {
      onChange(value[0] === ServicePaymentType.Free);
    } else {
      onChange(undefined);
    }
  };

  return (
    <Form.Item label="Тип послуги" name="servicePaymentType" layout="vertical">
      <Select
        mode="multiple"
        placeholder="Безкоштовна / Платна"
        options={OPTIONS}
        classNames={{ root: styles.select, popup: { root: styles.popup } }}
        value={value}
        onChange={handleChange}
      />
    </Form.Item>
  );
};

export default IsFreeSelect;
