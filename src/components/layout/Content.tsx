import { Content as AntContent } from 'antd/es/layout/layout';
import React from 'react';

type ContentProps = {
  children: React.ReactNode;
};

const Content = ({ children }: ContentProps) => {
  return (
    <AntContent style={{ padding: '20px 50px' }}>
      <main>{children}</main>
    </AntContent>
  );
};

export default Content;
