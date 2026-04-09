import { Flex } from 'antd';
import { Header as AntHeader } from 'antd/es/layout/layout';
import Link from 'next/link';

import FontSizeSlider from '@/shared/ui/components/FontSizeSlider/FontSizeSlider';
import Logo, { LogoSize } from '@/shared/ui/components/Logo/Logo';
import ThemeSwitcher from '@/shared/ui/components/ThemeSwitcher';

const Header = () => {
  return (
    <AntHeader>
      <Flex align="center" justify="space-between">
        <Flex align="center" justify="space-between" gap={8}>
          <Link href="/" style={{ display: 'flex' }}>
            <Logo size={LogoSize.LARGE} />
          </Link>
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
