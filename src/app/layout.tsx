import '@/shared/ui/styles/global.scss';
import '@ant-design/v5-patch-for-react-19';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Layout } from 'antd';
import type { Metadata } from 'next';
import React from 'react';

import Chat from '@/features/chat/components/Chat/Chat';

import Content from '@/components/layout/Content';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

import QueryClientProvider from '@/shared/providers/QueryClientProvider';
import ThemeProvider from '@/shared/providers/ThemeProvider';

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
      <head>
        <meta name="apple-mobile-web-app-title" content="DRM Platform" />
      </head>
      <body>
        <QueryClientProvider>
          <AntdRegistry>
            <ThemeProvider>
              <Layout>
                <Header />
                <Content>{children}</Content>
                <Chat />
                <Footer />
              </Layout>
            </ThemeProvider>
          </AntdRegistry>
        </QueryClientProvider>
      </body>
    </html>
  );
}
