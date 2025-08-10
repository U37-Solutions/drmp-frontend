import { Flex, Typography } from 'antd';
import { Footer as AntFooter } from 'antd/es/layout/layout';
import React from 'react';

import Logo from '@/shared/ui/components/Logo/Logo';

const Footer = () => {
  return (
    <AntFooter className="footer">
      <Flex align="center" gap={8}>
        <Logo />
        <Typography style={{ margin: 0 }}>DRM Platform - 2025</Typography>
      </Flex>
    </AntFooter>
  );
};

export default Footer;
