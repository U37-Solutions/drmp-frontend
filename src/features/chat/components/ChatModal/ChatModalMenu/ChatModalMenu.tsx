'use client';
import { CloseOutlined } from '@ant-design/icons';
import { Avatar, Button, List, Typography } from 'antd';
import React from 'react';

import { useGetSortedChats, useOpenChatDialog, useSetActiveCompanyChat } from '@/features/chat/store';
import { Chat } from '@/features/chat/types';

import { getFormattedRelativeDateTime } from '@/shared/utils/date';
import { getInitials } from '@/shared/utils/getInitials';

import styles from './ChatModalMenu.module.scss';

type ChatModalMenuProps = {
  onClose: () => void;
};

const ChatModalMenu: React.FC<ChatModalMenuProps> = ({ onClose }) => {
  const chats = useGetSortedChats();
  const setActiveCompanyChat = useSetActiveCompanyChat();
  const openChatDialog = useOpenChatDialog();

  const handleOpenDialog = (chat: Chat) => {
    openChatDialog();
    setActiveCompanyChat({
      companyId: chat.companyId,
      companyName: chat.name,
      companyAvatar: chat.avatar,
    });
  };

  return (
    <div className={styles.chatModalMenu} aria-label="Список чатів">
      <header className={styles.chatModalMenu__header}>
        <Typography.Title level={5} style={{ margin: 0, color: '#fff' }}>
          Чати
        </Typography.Title>
        <Button
          className={styles.chatModalMenu__headerCloseButton}
          shape="circle"
          size="small"
          icon={<CloseOutlined />}
          onClick={onClose}
          aria-label="Закрити"
        />
      </header>
      <nav className={styles.chatModalMenu__nav}>
        <List
          className={styles.chatModalMenu__navList}
          dataSource={chats}
          renderItem={(chat) => (
            <List.Item key={chat.id} onClick={() => handleOpenDialog(chat)} role="listitem">
              <List.Item.Meta
                avatar={<Avatar src={chat.avatar || null}>{getInitials(chat.name)}</Avatar>}
                title={<Typography.Text>{chat.name}</Typography.Text>}
                description={chat.lastMessage?.message}
              />
              {chat.lastMessage && (
                <div className={styles.chatModalMenu__navListItemTime}>
                  <Typography.Text type="secondary">
                    {getFormattedRelativeDateTime(chat.lastMessage.time)}
                  </Typography.Text>
                </div>
              )}
            </List.Item>
          )}
        />
      </nav>
    </div>
  );
};

export default ChatModalMenu;
