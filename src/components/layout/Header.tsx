import { Flex } from 'antd';
import { Header as AntHeader } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
import React from 'react';

import ThemeSwitcher from '@/components/ThemeSwitcher';

import Logo from '@/shared/ui/components/Logo/Logo';

const Header = () => {
  return (
    <AntHeader>
      <Flex align="center" justify="space-between">
        <Flex align="center" justify="space-between" gap={8}>
          <Logo />
          <Title level={5} style={{ margin: 0, color: '#000' }}>
            DRM Platform
          </Title>
        </Flex>
        <ThemeSwitcher />
      </Flex>
    </AntHeader>
  );
};

export default Header;
