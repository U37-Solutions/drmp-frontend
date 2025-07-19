'use client';
import { ConfigProvider, ThemeConfig } from 'antd';
import { getCookie } from 'cookies-next/client';
import React from 'react';

import { DarkTheme, LightTheme } from '@/shared/ui/themes';

export enum ThemeType {
  LIGHT = 'light',
  DARK = 'dark',
}

const themeConfig: Record<ThemeType, ThemeConfig> = {
  [ThemeType.LIGHT]: LightTheme,
  [ThemeType.DARK]: DarkTheme,
};

const ThemeProvider = ({ theme, children }: { theme?: ThemeType; children: React.ReactNode }) => {
  const currentTheme: ThemeType = (getCookie('theme') as ThemeType) || ThemeType.LIGHT;

  return <ConfigProvider theme={themeConfig[theme ?? currentTheme]}>{children}</ConfigProvider>;
};

export default ThemeProvider;
