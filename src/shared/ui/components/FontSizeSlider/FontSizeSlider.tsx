'use client';
import { FontSizeOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Popover, Slider, Tooltip } from 'antd';
import { SliderMarks } from 'antd/es/slider';
import { getCookie, setCookie } from 'cookies-next/client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './FontSizeSlider.module.scss';

const marks: SliderMarks = {
  12: { label: '12px' },
  14: { label: '14px' },
  16: { label: '16px' },
  18: { label: '18px' },
  20: { label: '20px' },
};

const FontSizeSlider = () => {
  const router = useRouter();
  const [fontSize, setFontSize] = useState<number>(14);

  useEffect(() => {
    const themeCookie = getCookie('fontSize') ? Number(getCookie('fontSize')) : 14;
    setFontSize(themeCookie);
  }, []);

  const handleFontSizeChange = useCallback(() => {
    if (fontSize === Number(getCookie('fontSize'))) return;

    setCookie('fontSize', fontSize);
    router.refresh();
  }, [fontSize, router]);

  const slider = useMemo(
    () => (
      <Flex vertical gap={8}>
        <Form layout="vertical" initialValues={{ fontSize }}>
          <Form.Item label="Розмір шрифта" name="fontSize" layout="vertical">
            <Slider
              marks={marks}
              min={12}
              max={20}
              step={2}
              value={fontSize}
              onChange={(value) => setFontSize(value)}
            />
          </Form.Item>
        </Form>

        <Button onClick={() => handleFontSizeChange()}>Застосувати</Button>
      </Flex>
    ),
    [fontSize, handleFontSizeChange],
  );

  return (
    <Popover
      placement="bottomLeft"
      destroyOnHidden
      classNames={{ body: styles.popover }}
      content={slider}
      trigger={['click']}
    >
      <Tooltip title="Змінити розмір шрифта" placement="left" trigger={['hover']}>
        <Button shape="circle" icon={<FontSizeOutlined />} />
      </Tooltip>
    </Popover>
  );
};

export default FontSizeSlider;
