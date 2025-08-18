import { ThemeConfig, theme as antTheme } from 'antd';

import common from '@/shared/ui/themes/common';

const theme: ThemeConfig = {
  ...common,
  algorithm: antTheme.darkAlgorithm,
  token: {
    fontFamily: 'e-Ukraine, sans-serif',
    colorPrimary: '#5b5aff',
    colorInfo: '#5b5aff',
    colorSuccess: '#89db33',
    colorWarning: '#ffdb4d',
    colorError: '#ff3800',
  },
  components: {
    ...common.components,
    Layout: {
      headerPadding: '16px 50px',
      headerHeight: 80,
      headerBg: '#29295b',
      bodyBg: '#16162c',
    },
  },
};

export default theme;
