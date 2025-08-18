'use client';
import { ConfigProvider, ThemeConfig } from 'antd';
import { getCookie } from 'cookies-next/client';
import React, { useMemo } from 'react';

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
  const fontSize = parseInt(getCookie('fontSize') as string, 10) || 14;

  const themeConfigWithFontSize = useMemo(
    () => ({
      ...themeConfig[theme ?? currentTheme],
      token: {
        ...themeConfig[theme ?? currentTheme].token,
        fontSize,
      },
    }),
    [theme, currentTheme, fontSize],
  );

  return <ConfigProvider theme={themeConfigWithFontSize}>{children}</ConfigProvider>;
};

export default ThemeProvider;
