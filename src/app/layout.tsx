import '@/shared/ui/styles/global.scss';
import '@ant-design/v5-patch-for-react-19';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Layout } from 'antd';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import React from 'react';

import Chat from '@/features/chat/components/Chat/Chat';

import Content from '@/components/layout/Content/Content';
import Footer from '@/components/layout/Footer/Footer';
import Header from '@/components/layout/Header/Header';

import QueryClientProvider from '@/shared/providers/QueryClientProvider';
import ThemeProvider from '@/shared/providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'Інформаційний портал для свідків і потерпілих від воєнних та інших міжнародних злочинів',
  description: 'Інформаційний портал для свідків і потерпілих від воєнних та інших міжнародних злочинів',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value || 'light';

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <meta name="apple-mobile-web-app-title" content="DRM Platform" />
        <title>
          Механізм перенаправлення між Координаційним центром, надавачами послуг та постраждалими і свідками порушень
          прав людини про наявні послуги
        </title>
      </head>
      <body>
        <QueryClientProvider>
          <AntdRegistry>
            <ThemeProvider>
              <Layout style={{ minHeight: 'auto' }}>
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
