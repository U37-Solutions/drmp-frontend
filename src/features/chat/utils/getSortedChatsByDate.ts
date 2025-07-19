import { Chat } from '../types';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export const getSortedChatsByDate = (chats: Chat[], order: SortOrder): Chat[] => {
  return chats.sort((a, b) => {
    const dateA = a.lastMessage ? new Date(a.lastMessage.time).getTime() : 0;
    const dateB = b.lastMessage ? new Date(b.lastMessage.time).getTime() : 0;
    return order === SortOrder.DESC ? dateB - dateA : dateA - dateB;
  });
};
