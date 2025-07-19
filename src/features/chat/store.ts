import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ActiveCompanyChat, Chat } from './types';
import { SortOrder, getSortedChatsByDate } from './utils/getSortedChatsByDate';

type ChatsStore = {
  chats: Record<string, Chat>;
  saveChat: (companyId: number, chat: Chat) => void;
  revalidateChats: () => void;
};

const useChatsStore = create<ChatsStore>()(
  persist(
    (set, get) => ({
      chats: {},
      saveChat: (companyId, chat) => set((state) => ({ chats: { ...state.chats, [companyId]: chat } })),
      revalidateChats: () => {
        const chats = get().chats;
        const now = new Date();
        const filteredChats = Object.fromEntries(
          Object.entries(chats).filter(([, chat]) => {
            if (!chat.expiresAt) return true;
            return new Date(chat.expiresAt) > now;
          }),
        );
        set({ chats: filteredChats });
      },
    }),
    {
      name: 'chats',
    },
  ),
);

export const useChats = () => {
  return useChatsStore((state) => state.chats);
};

export const useSaveChat = () => {
  return useChatsStore((state) => state.saveChat);
};

export const useRevalidateChats = () => {
  return useChatsStore((state) => state.revalidateChats);
};

export const useGetSortedChats = () => {
  const chats = useChatsStore((state) => state.chats);

  const sortedChatList = useMemo(() => {
    return getSortedChatsByDate(Object.values(chats), SortOrder.ASC);
  }, [chats]);

  return sortedChatList;
};

export const useGetChatByCompanyId = (companyId: number): Chat | null => {
  const chats = useChatsStore((state) => state.chats);

  const chat = useMemo(() => {
    return chats[companyId] || null;
  }, [chats, companyId]);

  return chat;
};

type ActiveCompanyChatStore = {
  activeCompanyChat: ActiveCompanyChat | null;
  setActiveCompanyChat: (activeCompanyChat: ActiveCompanyChat) => void;
  removeActiveCompanyChat: () => void;
};

const useActiveCompanyChatStore = create<ActiveCompanyChatStore>((set) => ({
  activeCompanyChat: null,
  setActiveCompanyChat: (activeCompanyChat) => set(() => ({ activeCompanyChat })),
  removeActiveCompanyChat: () => set(() => ({ activeCompanyChat: null })),
}));

export const useActiveCompanyChat = () => {
  return useActiveCompanyChatStore((state) => state.activeCompanyChat);
};

export const useSetActiveCompanyChat = () => {
  return useActiveCompanyChatStore((state) => state.setActiveCompanyChat);
};

export const useRemoveActiveCompanyChat = () => {
  return useActiveCompanyChatStore((state) => state.removeActiveCompanyChat);
};

type ChatDialogStore = {
  isChatDialogOpen: boolean;
  openChatDialog: () => void;
  closeChatDialog: () => void;
};

const useChatDialogStore = create<ChatDialogStore>((set) => ({
  isChatDialogOpen: false,
  openChatDialog: () => set(() => ({ isChatDialogOpen: true })),
  closeChatDialog: () => set(() => ({ isChatDialogOpen: false })),
}));

export const useIsChatDialogOpen = () => {
  return useChatDialogStore((state) => state.isChatDialogOpen);
};

export const useOpenChatDialog = () => {
  return useChatDialogStore((state) => state.openChatDialog);
};

export const useCloseChatDialog = () => {
  return useChatDialogStore((state) => state.closeChatDialog);
};

export const useOpenChatDialogWithActiveCompanyChat = () => {
  const openChatDialog = useOpenChatDialog();
  const setActiveCompanyChat = useSetActiveCompanyChat();

  return (activeCompanyChat: ActiveCompanyChat) => {
    setActiveCompanyChat(activeCompanyChat);
    openChatDialog();
  };
};

export const useCloseChatDialogWithActiveCompanyChat = () => {
  const closeChatDialog = useCloseChatDialog();
  const removeActiveCompanyChat = useRemoveActiveCompanyChat();

  return () => {
    removeActiveCompanyChat();
    closeChatDialog();
  };
};

export const useIsShowChatFloatButton = () => {
  const chats = useChats();
  const activeCompanyChat = useActiveCompanyChat();

  return Object.keys(chats).length !== 0 || !!activeCompanyChat;
};
