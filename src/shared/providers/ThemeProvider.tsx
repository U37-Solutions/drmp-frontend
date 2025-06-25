'use client';
import { ConfigProvider, ThemeConfig } from 'antd';
import { getCookie } from 'cookies-next/client';
import React from 'react';

import { DarkTheme, LightTheme } from '@/shared/ui/themes';

const themeConfig: Record<string, ThemeConfig> = {
  light: LightTheme,
  dark: DarkTheme,
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const currentTheme: keyof typeof themeConfig = getCookie('theme') || 'light';

  return <ConfigProvider theme={themeConfig[currentTheme]}>{children}</ConfigProvider>;
};

export default ThemeProvider;
