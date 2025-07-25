import apiClient from '@/shared/api/apiClient';

import { ChatHistoryResponse, StartNewChat, StartNewChatResponse } from './types';

export const startNewChat = async ({ company, message }: StartNewChat): Promise<StartNewChatResponse> => {
  try {
    const response = await apiClient.post<StartNewChatResponse>('/chat/start', {
      companyId: company.id,
      message,
    });

    return response.data;
  } catch (error) {
    // TODO: Remove this comment when implementing error handling
    // eslint-disable-next-line no-console
    console.error('Error starting new chat:', error);
    throw error;
  }
};

export const getChatHistory = async (accessToken: string): Promise<ChatHistoryResponse[]> => {
  try {
    const response = await apiClient.get<ChatHistoryResponse[]>('/chat/history', {
      headers: {
        'X-Chat-Token': accessToken,
      },
    });

    return response.data;
  } catch (error) {
    // TODO: Remove this comment when implementing error handling
    // eslint-disable-next-line no-console
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

// TODO: Remove this logic when proper companies fetch is implemented
interface CompanyDTO {
  id: number;
  name: string;
}

export const getCompanies = async (): Promise<Array<CompanyDTO>> =>
  await apiClient.get('/public/companies').then((res) => res.data);
