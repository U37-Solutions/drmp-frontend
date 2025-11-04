import { Flex, Typography } from 'antd';
import { Footer as AntFooter } from 'antd/es/layout/layout';
import React from 'react';

import Logo, { LogoSize } from '@/shared/ui/components/Logo/Logo';

const Footer = () => {
  return (
    <AntFooter className="footer">
      <Flex align="center" justify="space-between" gap={8}>
        <Logo size={LogoSize.LARGE} />
        <Typography style={{ margin: 0, textAlign: 'right' }}>
          Інформаційний портал для свідків і потерпілих від воєнних та інших міжнародних злочинів
        </Typography>
      </Flex>
    </AntFooter>
  );
};

export default Footer;
