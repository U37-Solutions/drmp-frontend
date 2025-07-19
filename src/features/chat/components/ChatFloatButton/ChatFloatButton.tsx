'use client';
import { CloseOutlined, MessageOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import React, { useEffect } from 'react';

import styles from './ChatFloatButton.module.scss';

import { useIsShowChatFloatButton, useRevalidateChats } from '../../store';

type ChatFloatButtonProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const ChatFloatButton: React.FC<ChatFloatButtonProps> = ({ open, onOpen, onClose, ...props }) => {
  const isShowChatFloatButton = useIsShowChatFloatButton();
  const revalidateChats = useRevalidateChats();

  useEffect(() => {
    revalidateChats();
  }, [revalidateChats]);

  return (
    isShowChatFloatButton && (
      <FloatButton
        {...props}
        className={styles.chatFloatButton}
        type="primary"
        shape="circle"
        icon={open ? <CloseOutlined /> : <MessageOutlined />}
        onClick={() => (open ? onClose() : onOpen())}
      />
    )
  );
};

export default ChatFloatButton;
