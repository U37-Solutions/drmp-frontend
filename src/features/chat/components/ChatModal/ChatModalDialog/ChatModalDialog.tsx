'use client';
import { CloseOutlined, LeftOutlined, SendOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Button, Empty, Input, Spin, Typography } from 'antd';
import classNames from 'classnames';
import { isSameDay, parseISO } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';

import { getChatHistory, startNewChat } from '@/features/chat/api';
import { useCloseChatDialog, useGetChatByCompanyId, useSaveChat } from '@/features/chat/store';
import { ActiveCompanyChat, ChatHistory, ChatHistoryResponse, MessageType, SenderType } from '@/features/chat/types';

import { useWebSocket } from '@/shared/api/useWebSocket';
import WebSocketStatusIndicator from '@/shared/ui/components/WebSocketStatusIndicator/WebSocketStatusIndicator';
import { getFormattedRelativeDate } from '@/shared/utils/date';
import { getInitials } from '@/shared/utils/getInitials';

import styles from './ChatModalDialog.module.scss';
import ChatModalDialogMessage from './ChatModalDialogMessage/ChatModalDialogMessage';

enum ContentState {
  LOADING = 'loading',
  EMPTY = 'empty',
  SUCCESS = 'success',
}

type ContentStatus = {
  isLoading: boolean;
  isEmpty: boolean;
};

type DialogContent = {
  contentStatus: ContentStatus;
  content: {
    [ContentState.LOADING]: React.ReactElement;
    [ContentState.EMPTY]: React.ReactElement;
    [ContentState.SUCCESS]: React.ReactElement;
  };
};

const getContentState = ({ isLoading, isEmpty }: ContentStatus): ContentState => {
  if (isLoading) return ContentState.LOADING;
  if (isEmpty) return ContentState.EMPTY;
  return ContentState.SUCCESS;
};

const getDialogContent = ({ contentStatus, content }: DialogContent) => {
  const contentState = getContentState(contentStatus);
  return content[contentState];
};

const mapSenderToMessageType = {
  [SenderType.CLIENT]: MessageType.OUTGOING,
  [SenderType.ADMIN]: MessageType.INCOMING,
};

const MAX_TEXTAREA_CHARS = 300;

type ChatModalDialogProps = {
  activeCompanyChat: ActiveCompanyChat;
  onClose: () => void;
};

const ChatModalDialog: React.FC<ChatModalDialogProps> = ({ activeCompanyChat, onClose }) => {
  const chat = useGetChatByCompanyId(activeCompanyChat.companyId);
  const saveChat = useSaveChat();
  const closeChatDialog = useCloseChatDialog();

  const [newMessage, setNewMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading: isChatHistoryLoading } = useQuery<ChatHistoryResponse[]>({
    queryKey: ['chat/history', chat?.accessToken],
    queryFn: async () => (chat ? await getChatHistory(chat.accessToken) : []),
    enabled: !!chat,
  });

  useEffect(() => {
    if (data) {
      setChatHistory(
        data.map((message) => ({
          chatId: message.chatId,
          content: message.content,
          type: mapSenderToMessageType[message.senderType],
          sentAt: message.sentAt,
        })),
      );
    }
  }, [data]);

  const { status, initiateConnection, sendJsonMessage, lastJsonMessage, closeWebSocket } = useWebSocket({
    url: `/chat?token=${chat?.accessToken}`,
    options: {
      connectOnSend: true,
    },
  });

  useEffect(() => {
    if (chat) {
      initiateConnection();
    }

    return () => {
      closeWebSocket();
    };
  }, [chat, closeWebSocket, initiateConnection]);

  useEffect(() => {
    if (lastJsonMessage) {
      const message = lastJsonMessage as ChatHistoryResponse;
      setChatHistory((prev) => [
        ...prev,
        {
          chatId: message.chatId,
          content: message.content,
          type: mapSenderToMessageType[message.senderType],
          sentAt: message.sentAt,
        },
      ]);
    }
  }, [lastJsonMessage]);

  const enterMessage = async (message: string) => {
    const newMessage = message.trim();

    if (newMessage === '') return;

    if (!chat) {
      const messageData = await startNewChat({
        company: { id: activeCompanyChat.companyId, name: activeCompanyChat.companyName },
        message: newMessage,
      });

      saveChat(activeCompanyChat.companyId, {
        id: messageData.chatId,
        companyId: activeCompanyChat.companyId,
        accessToken: messageData.accessToken,
        name: activeCompanyChat.companyName,
        avatar: activeCompanyChat.companyAvatar,
        lastMessage: {
          message: newMessage,
          time: new Date().toISOString(),
        },
        expiresAt: messageData.expiresAt,
      });

      initiateConnection();
    } else {
      sendJsonMessage({
        chatId: chat.id,
        content: newMessage,
        senderType: SenderType.CLIENT,
        accessToken: chat.accessToken,
      });
    }

    setNewMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const closeActiveChat = () => {
    closeChatDialog();
  };

  return (
    <div className={styles.chatModalDialog}>
      <header className={styles.chatModalDialog__header}>
        <Button
          className={styles.chatModalDialog__headerBackButton}
          size="small"
          shape="circle"
          icon={<LeftOutlined />}
          onClick={closeActiveChat}
        />
        <div className={styles.chatModalDialog__headerInfo}>
          <WebSocketStatusIndicator status={status} />
          <Avatar src={activeCompanyChat.companyAvatar || null}>{getInitials(activeCompanyChat.companyName)}</Avatar>
          <Typography.Title level={5} style={{ margin: 0, color: '#fff' }} ellipsis={{ rows: 1 }}>
            {activeCompanyChat.companyName}
          </Typography.Title>
        </div>
        <Button
          className={styles.chatModalDialog__headerCloseButton}
          size="small"
          shape="circle"
          icon={<CloseOutlined />}
          onClick={onClose}
        />
      </header>
      <div className={styles.chatModalDialog__chat}>
        <div className={styles.chatModalDialog__chatMessagesWrapper}>
          <div ref={messagesEndRef} />
          {getDialogContent({
            contentStatus: {
              isLoading: isChatHistoryLoading,
              isEmpty: chatHistory.length === 0 && !isChatHistoryLoading,
            },
            content: {
              [ContentState.LOADING]: (
                <div className={classNames(styles.dialogState, styles.dialogState_loader)}>
                  <Spin />
                </div>
              ),
              [ContentState.EMPTY]: (
                <div className={classNames(styles.dialogState, styles.dialogState_empty)}>
                  <Empty description="Поки що немає повідомлень" />
                </div>
              ),
              [ContentState.SUCCESS]: (
                <div className={styles.chatModalDialog__chatMessages}>
                  {chatHistory.map((message, index) => {
                    const currDate = parseISO(message.sentAt);
                    const prevDate = index > 0 ? parseISO(chatHistory[index - 1].sentAt) : null;
                    const showDateSeparator = !prevDate || !isSameDay(currDate, prevDate);

                    return (
                      <React.Fragment key={message.sentAt}>
                        {showDateSeparator && (
                          <span className={styles.chatModalDialog__chatMessagesSeparator}>
                            {getFormattedRelativeDate(message.sentAt)}
                          </span>
                        )}
                        <ChatModalDialogMessage type={message.type} message={message.content} time={message.sentAt} />
                      </React.Fragment>
                    );
                  })}
                </div>
              ),
            },
          })}
        </div>
        <div className={styles.chatModalDialog__chatFooter}>
          <div className={styles.chatModalDialog__chatFooterTextarea}>
            <Input.TextArea
              className={styles.chatModalDialog__chatFooterTextareaInput}
              id="message"
              name="message"
              placeholder="Введіть повідомлення..."
              variant="borderless"
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
              autoSize={{ minRows: 1, maxRows: 4 }}
              maxLength={MAX_TEXTAREA_CHARS}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  const trimmed = newMessage.trim();
                  if (trimmed) {
                    enterMessage(trimmed);
                  }
                }
              }}
            />
            <span
              className={classNames(styles.chatModalDialog__chatFooterTextareaCounter, {
                [styles.chatModalDialog__chatFooterTextareaCounter_warning]:
                  newMessage.length >= MAX_TEXTAREA_CHARS - 50,
                [styles.chatModalDialog__chatFooterTextareaCounter_error]: newMessage.length >= MAX_TEXTAREA_CHARS,
              })}
            >
              {newMessage.length}/{MAX_TEXTAREA_CHARS}
            </span>
          </div>
          <Button
            className={styles.chatModalDialog__chatFooterButton}
            color="blue"
            variant="solid"
            shape="circle"
            size="large"
            disabled={!newMessage.trim()}
            icon={<SendOutlined />}
            onClick={() => enterMessage(newMessage)}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatModalDialog;
