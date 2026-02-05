import apiClient from '@/features/api/client';
import { env } from '@/utils/env';
import { mockCouncils, mockEvents, mockProfile, mockReports, mockSeats } from '@/features/mock/data';
import type { Council, EventItem, Seat, UserProfile } from '@/types/domain';

export const apiService = {
  getEvents: async (): Promise<EventItem[]> =>
    env.enableMockApi ? mockEvents : (await apiClient.get('/events')).data,
  getEventById: async (id: number): Promise<EventItem | undefined> =>
    env.enableMockApi
      ? mockEvents.find((event) => event.id === id)
      : (await apiClient.get(`/events/${id}`)).data,
  getCouncils: async (): Promise<Council[]> =>
    env.enableMockApi ? mockCouncils : (await apiClient.get('/councils')).data,
  getProfile: async (): Promise<UserProfile> =>
    env.enableMockApi ? mockProfile : (await apiClient.get('/auth/me')).data,
  getSeats: async (): Promise<Seat[]> =>
    env.enableMockApi ? mockSeats : (await apiClient.get('/events/1/seats')).data,
  getReports: async (): Promise<Array<{ name: string; total: number; registrations: number }>> =>
    env.enableMockApi ? mockReports : (await apiClient.get('/admin/reports')).data,
};
