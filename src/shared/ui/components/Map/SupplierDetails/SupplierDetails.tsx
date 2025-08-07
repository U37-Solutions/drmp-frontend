import { CloseOutlined, CompassOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Divider, Flex, Tooltip, Typography } from 'antd';
import React from 'react';

import { useOpenChatDialogWithActiveCompanyChat } from '@/features/chat/store';
import { SupplierDTO } from '@/features/map/types';

import SocialMediaLink from '@/shared/ui/components/SocialMediaLink/SocialMediaLink';

import styles from './SupplierDetails.module.scss';

const SupplierDetails = ({ data, onClose }: { data: SupplierDTO; onClose?(): void }) => {
  const openChatDialog = useOpenChatDialogWithActiveCompanyChat();

  const handleOpenChat = (supplier: SupplierDTO) => {
    openChatDialog({
      companyId: supplier.companyId,
      companyName: supplier.companyName,
      companyAvatar: 'company.avatar',
    });
  };

  const services = data.services.join(', ');
  const categories = data.categories.join(', ');
  const conditions = data.conditions.join(', ');

  return (
    <Flex vertical gap={8} style={{ height: '100%' }}>
      <Flex style={{ width: '100%' }} justify="space-between" align="flex-start">
        <div className={styles.supplierDetailsHeader}>
          <Typography.Title level={4} style={{ marginBottom: 0 }}>
            {data.companyName}
          </Typography.Title>
          <Flex gap={8} align="center">
            <CompassOutlined />
            <Typography.Text ellipsis={{ tooltip: data.locationName }} type="secondary">
              {data.locationName}
            </Typography.Text>
          </Flex>
        </div>
        {onClose && (
          <Button
            className={styles.closeBtn}
            icon={<CloseOutlined />}
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
          />
        )}
      </Flex>
      <Divider style={{ margin: 0 }} />

      <Flex vertical gap={4}>
        <Typography.Text strong>Послуги</Typography.Text>
        <Typography.Paragraph type="secondary" className={styles.itemsListParagraph} ellipsis={{ tooltip: services }}>
          {services}
        </Typography.Paragraph>
      </Flex>
      <Flex vertical gap={4}>
        <Typography.Text strong>Категорії бенефіціарів</Typography.Text>
        <Typography.Paragraph type="secondary" className={styles.itemsListParagraph} ellipsis={{ tooltip: categories }}>
          {categories}
        </Typography.Paragraph>
      </Flex>
      <Flex vertical gap={4}>
        <Typography.Text strong>Умови надання допомоги</Typography.Text>
        <Typography.Paragraph type="secondary" className={styles.itemsListParagraph} ellipsis={{ tooltip: conditions }}>
          {conditions}
        </Typography.Paragraph>
      </Flex>
      <Flex vertical gap={4}>
        <Typography.Text strong>Графік роботи</Typography.Text>
        <Typography.Text type="secondary">{data.workSchedule}</Typography.Text>
      </Flex>
      <Flex vertical gap={4}>
        <Typography.Text strong>Додаткова інформація</Typography.Text>
        <Typography.Paragraph type="secondary" ellipsis={{ tooltip: data.additionalDescription }}>
          {data.additionalDescription}
        </Typography.Paragraph>
      </Flex>

      <Flex gap={8} justify="space-between" style={{ margin: 'auto 0 0' }} wrap="wrap">
        <Flex align="center" gap={8}>
          <UserOutlined />
          <Typography.Text strong>{data.contactName}</Typography.Text>
        </Flex>
        <Flex gap={8}>
          <SocialMediaLink data={{ type: 'phone', url: `tel:${data.phone}` }} />
          <SocialMediaLink data={{ type: 'mail', url: `mailto:${data.email}` }} />
          {data.socials.map((item, index) => (
            <SocialMediaLink data={item} key={`social-${index}`} />
          ))}
          <Tooltip title="Написати в чат організації">
            <Button
              color="default"
              variant="solid"
              shape="circle"
              icon={<MessageOutlined />}
              onClick={() => handleOpenChat(data)}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SupplierDetails;
