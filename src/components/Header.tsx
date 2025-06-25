import { Flex } from 'antd';
import { Header as AntHeader } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
import React from 'react';

import ThemeSwitcher from '@/components/ThemeSwitcher';

const Header = async () => {
  return (
    <AntHeader>
      <Flex justify="space-between" align="center">
        <Title>DRM platform</Title>
        <ThemeSwitcher />
      </Flex>
    </AntHeader>
  );
};

export default Header;
