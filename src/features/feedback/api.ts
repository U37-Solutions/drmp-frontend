import { Feedback } from '@/features/feedback/types';

import apiClient from '@/shared/api/apiClient';

export const sendFeedback = async (feedback: Feedback) =>
  await apiClient.post('/feedback', feedback).catch((error) => {
    // TODO: Remove this comment when implementing error handling
    // eslint-disable-next-line no-console
    console.error('Error sending feedback:', error);
    throw error;
  });
