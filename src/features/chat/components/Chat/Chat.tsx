'use client';
import React, { useEffect, useState } from 'react';

import ThemeProvider, { ThemeType } from '@/shared/providers/ThemeProvider';

import ChatFloatButton from '../ChatFloatButton/ChatFloatButton';
import ChatModal from '../ChatModal/ChatModal';

import { useActiveCompanyChat, useCloseChatDialogWithActiveCompanyChat } from '../../store';

const Chat = () => {
  const [open, setOpen] = useState(false);
  const activeChat = useActiveCompanyChat();
  const closeChatDialogWithActiveCompanyChat = useCloseChatDialogWithActiveCompanyChat();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    closeChatDialogWithActiveCompanyChat();
  };

  useEffect(() => {
    if (!open && activeChat) {
      handleOpen();
    }
  }, [activeChat, open]);

  return (
    <ThemeProvider theme={ThemeType.LIGHT}>
      <ChatModal
        open={open}
        onClose={handleClose}
        triggerButton={<ChatFloatButton open={open} onOpen={handleOpen} onClose={handleClose} />}
      />
    </ThemeProvider>
  );
};

export default Chat;
