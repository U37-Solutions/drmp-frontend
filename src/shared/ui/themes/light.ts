import { ThemeConfig, theme as antTheme } from 'antd';

import common from '@/shared/ui/themes/common';

const theme: ThemeConfig = {
  ...common,
  algorithm: antTheme.defaultAlgorithm,
  token: {
    fontFamily: 'e-Ukraine, sans-serif',
    colorPrimary: '#5b5aff',
    colorInfo: '#5b5aff',
    colorSuccess: '#89db33',
    colorWarning: '#ffdb4d',
    colorError: '#ff3800',
  },
  components: {
    Layout: {
      headerPadding: '16px 50px',
      headerHeight: 80,
      headerBg: '#d4d8ff',
      bodyBg: '#f0f2ff',
      footerBg: '#f0f2ff',
    },
  },
};

export default theme;
