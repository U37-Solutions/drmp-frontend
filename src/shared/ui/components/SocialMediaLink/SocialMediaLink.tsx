import { FacebookOutlined, GlobalOutlined, InstagramOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, ButtonProps, Tooltip } from 'antd';
import React, { ReactNode } from 'react';

import { SocialMediaDTO } from '@/features/map/types';

type ContactType = 'phone' | 'mail' | SocialMediaDTO['type'];

const SOCIAL_MEDIA_ICONS: Record<ContactType, { icon: ReactNode; color: ButtonProps['color']; tip: string }> = {
  phone: {
    tip: 'Телефон',
    icon: <PhoneOutlined />,
    color: 'green',
  },
  mail: {
    tip: 'Електронна пошта',
    icon: <MailOutlined />,
    color: 'red',
  },
  facebook: {
    tip: 'Facebook',
    icon: <FacebookOutlined />,
    color: 'blue',
  },
  instagram: {
    tip: 'Instagram',
    icon: <InstagramOutlined />,
    color: 'volcano',
  },
  website: {
    tip: 'Сайт організації',
    icon: <GlobalOutlined />,
    color: 'default',
  },
};

const SocialMediaLink = ({ data }: { data: { type: ContactType; url: string } }) => {
  const { icon, color, tip } = SOCIAL_MEDIA_ICONS[data.type];

  return (
    <Tooltip title={tip}>
      <Button
        variant="outlined"
        shape="circle"
        color={color}
        icon={icon}
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
      />
    </Tooltip>
  );
};

export default SocialMediaLink;
