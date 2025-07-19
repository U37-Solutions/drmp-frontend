import { Flex } from 'antd';
import { Footer as AntFooter } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
import React from 'react';

import Logo from '@/shared/ui/components/Logo/Logo';

const Footer = () => {
  return (
    <AntFooter>
      <Flex align="center" gap={8}>
        <Logo />
        <Title level={5} style={{ margin: 0, color: '#000' }}>
          <span>DRM Platform - 2025</span>
        </Title>
      </Flex>
    </AntFooter>
  );
};

export default Footer;
