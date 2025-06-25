import { ThemeConfig, theme as antTheme } from 'antd';

import common from '@/shared/ui/themes/common';

const theme: ThemeConfig = {
  ...common,
  algorithm: antTheme.defaultAlgorithm,
  components: {},
};

export default theme;
