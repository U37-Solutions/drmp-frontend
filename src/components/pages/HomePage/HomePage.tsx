'use client';

import { Button } from 'antd';

import { useOpenChatDialogWithActiveCompanyChat } from '@/features/chat/store';
import Feedback from '@/features/feedback/components/Feedback/Feedback';

import styles from './HomePage.module.scss';

// TODO: Remove this mock data when integrating with the actual backend
const companies = [
  {
    id: 6,
    name: 'Тестова організація 1',
    avatar: null,
  },
  {
    id: 7,
    name: 'Тестова організація 2',
    avatar: null,
  },
  {
    id: 8,
    name: 'Тестова організація 3',
    avatar: null,
  },
];

export const HomePage: React.FC = () => {
  const openChatDialog = useOpenChatDialogWithActiveCompanyChat();

  const handleOpenChat = (company: (typeof companies)[number]) => {
    openChatDialog({
      companyId: company.id,
      companyName: company.name,
      companyAvatar: company.avatar,
    });
  };

  return (
    <div className={styles.homepage}>
      {/* TODO: Remove this mock data when integrating with the actual backend */}
      {companies.map((company) => (
        <Button key={company.id} onClick={() => handleOpenChat(company)}>
          {company.name} - open chat
        </Button>
      ))}
      <Feedback />
    </div>
  );
};
