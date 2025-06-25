'use client';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Switch, Tooltip } from 'antd';
import { getCookie, setCookie } from 'cookies-next/client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const ThemeSwitcher = () => {
  const router = useRouter();
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);

  useEffect(() => {
    const themeCookie = getCookie('theme') || 'light';
    setCurrentTheme(themeCookie);
  }, []);

  const handleThemeSwitch = async () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCookie('theme', newTheme);
    setCurrentTheme(newTheme);
    router.refresh();
  };

  return (
    <Tooltip title="Перемкнути тему">
      <Switch
        loading={!currentTheme}
        unCheckedChildren={<MoonOutlined />}
        checkedChildren={<SunOutlined />}
        checked={currentTheme === 'dark'}
        onChange={handleThemeSwitch}
      />
    </Tooltip>
  );
};

export default ThemeSwitcher;
