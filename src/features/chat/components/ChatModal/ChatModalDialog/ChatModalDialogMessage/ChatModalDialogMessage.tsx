'use client';
import classNames from 'classnames';
import React from 'react';

import { MessageType } from '@/features/chat/types';

import { getFormattedTime } from '@/shared/utils/date';

import styles from './ChatModalDialogMessage.module.scss';

const messageTypeStyles = {
  [MessageType.INCOMING]: styles.chatModalDialogMessage_incoming,
  [MessageType.OUTGOING]: styles.chatModalDialogMessage_outgoing,
};

type ChatModalDialogMessageProps = {
  type: MessageType;
  message: string;
  time: string;
};

const ChatModalDialogMessage: React.FC<ChatModalDialogMessageProps> = ({ type, message, time }) => {
  return (
    <div className={classNames(styles.chatModalDialogMessage, messageTypeStyles[type])}>
      <span className={styles.chatModalDialogMessage__text}>{message}</span>
      <span className={styles.chatModalDialogMessage__time}>{getFormattedTime(time)}</span>
    </div>
  );
};

export default ChatModalDialogMessage;
