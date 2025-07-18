'use client';
import { Popover } from 'antd';
import React from 'react';

import styles from './ChatModal.module.scss';
import ChatModalContent from './ChatModalContent/ChatModalContent';

type ChatModalProps = {
  open: boolean;
  onClose: () => void;
  triggerButton: React.ReactElement;
};

const ChatModal: React.FC<ChatModalProps> = ({ open, triggerButton, onClose }) => {
  return (
    <Popover
      rootClassName={styles.chatModal}
      placement="leftBottom"
      open={open}
      content={<ChatModalContent onClose={onClose} />}
      styles={{ body: { padding: 0 } }}
    >
      {triggerButton}
    </Popover>
  );
};

export default ChatModal;
