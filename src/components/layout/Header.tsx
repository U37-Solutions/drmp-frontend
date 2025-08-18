import { Flex } from 'antd';
import { Header as AntHeader } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
import React from 'react';

import FontSizeSlider from '@/shared/ui/components/FontSizeSlider/FontSizeSlider';
import Logo from '@/shared/ui/components/Logo/Logo';
import ThemeSwitcher from '@/shared/ui/components/ThemeSwitcher';

const Header = () => {
  return (
    <AntHeader>
      <Flex align="center" justify="space-between">
        <Flex align="center" justify="space-between" gap={8}>
          <Logo />
          <Title level={5} style={{ margin: 0 }}>
            DRM Platform
          </Title>
        </Flex>
        <Flex align="center" gap={16}>
          <FontSizeSlider />
          <ThemeSwitcher />
        </Flex>
      </Flex>
    </AntHeader>
  );
};

export default Header;
