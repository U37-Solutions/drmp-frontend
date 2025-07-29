'use client';

import { useQuery } from '@tanstack/react-query';
import { Button, Card } from 'antd';

import { getCompanies } from '@/features/chat/api';
import { useOpenChatDialogWithActiveCompanyChat } from '@/features/chat/store';
import Feedback from '@/features/feedback/components/Feedback/Feedback';

import LocationMap from '@/shared/ui/components/Map/LocationMap/LocationMap';

import styles from './HomePage.module.scss';

export const HomePage: React.FC = () => {
  const openChatDialog = useOpenChatDialogWithActiveCompanyChat();
  const { data } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
  });

  const companies = (data || []).map((company) => ({
    id: company.id,
    name: company.name,
    avatar: null,
  }));

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
      <Card className={styles.mapCard}>
        <LocationMap markers={[]} selectedPosition={{ lat: 0, lng: 0 }} onPositionSelect={() => {}} />
      </Card>
      <Feedback />
    </div>
  );
};
