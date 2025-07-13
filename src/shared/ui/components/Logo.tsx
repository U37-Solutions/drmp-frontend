import classNames from 'classnames';
import Image from 'next/image';
import React from 'react';

import styles from './Logo.module.scss';

import LogoSvg from '@/../../public/media/logo.svg';

enum LogoSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

const logoSizeClasses = {
  [LogoSize.SMALL]: styles.logo_small,
  [LogoSize.MEDIUM]: styles.logo_medium,
  [LogoSize.LARGE]: styles.logo_large,
};

type LogoProps = {
  size?: LogoSize;
};

const Logo: React.FC<LogoProps> = ({ size = LogoSize.MEDIUM }) => (
  <Image className={classNames(styles.logo, logoSizeClasses[size])} src={LogoSvg} alt="Logo" />
);

export default Logo;
