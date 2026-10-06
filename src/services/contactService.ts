import { apiClient } from '../api/apiClient';

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactService = {
  sendMessage: async (payload: ContactMessagePayload) => {
    return apiClient.post<{ success: boolean; message?: string }>('/contact', payload);
  },
};
