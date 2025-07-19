'use client';
import classNames from 'classnames';
import React, { useRef } from 'react';

import { useActiveCompanyChat, useIsChatDialogOpen, useRemoveActiveCompanyChat } from '@/features/chat/store';

import ChatModalDialog from '../ChatModalDialog/ChatModalDialog';
import ChatModalMenu from '../ChatModalMenu/ChatModalMenu';

import styles from './ChatModalContent.module.scss';

type ChatModalContentProps = {
  onClose: () => void;
};

const ChatModalContent: React.FC<ChatModalContentProps> = ({ onClose }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const isDialogOpen = useIsChatDialogOpen();
  const activeCompanyChat = useActiveCompanyChat();
  const removeActiveChat = useRemoveActiveCompanyChat();

  return (
    <section className={styles.chatModalContent}>
      <ChatModalMenu onClose={onClose} />
      <div
        ref={dialogRef}
        className={classNames(styles.chatModalContent__dialog, {
          [styles.chatModalContent__dialog_open]: isDialogOpen,
        })}
        onTransitionEnd={() => {
          if (!isDialogOpen) {
            removeActiveChat();
          }
        }}
      >
        {activeCompanyChat && <ChatModalDialog activeCompanyChat={activeCompanyChat} onClose={onClose} />}
      </div>
    </section>
  );
};

export default ChatModalContent;
