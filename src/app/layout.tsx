import '@/shared/ui/styles/global.scss';
import '@ant-design/v5-patch-for-react-19';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Layout } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import type { Metadata } from 'next';
import React from 'react';

import ThemeProvider from '@/shared/providers/ThemeProvider';

import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'DRM Platform',
  description: 'Digital referral mechanism platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ThemeProvider>
            <Layout>
              <Header />
              <Content>
                <main>{children}</main>
              </Content>
              <Footer>
                <span>DRMP - 2025</span>
              </Footer>
            </Layout>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
