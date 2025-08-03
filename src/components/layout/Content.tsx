import { Content as AntContent } from 'antd/es/layout/layout';
import React from 'react';

type ContentProps = {
  children: React.ReactNode;
};

const Content = ({ children }: ContentProps) => {
  return (
    <AntContent className="mainLayout">
      <main>{children}</main>
    </AntContent>
  );
};

export default Content;
