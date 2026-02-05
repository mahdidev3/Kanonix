import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/features/api/service';

export const useEvents = () =>
  useQuery({
    queryKey: ['events'],
    queryFn: apiService.getEvents,
  });

export const useEvent = (id: number) =>
  useQuery({
    queryKey: ['event', id],
    queryFn: () => apiService.getEventById(id),
  });

export const useCouncils = () =>
  useQuery({
    queryKey: ['councils'],
    queryFn: apiService.getCouncils,
  });

export const useProfile = () =>
  useQuery({
    queryKey: ['profile'],
    queryFn: apiService.getProfile,
  });

export const useSeats = () =>
  useQuery({
    queryKey: ['seats'],
    queryFn: apiService.getSeats,
  });

export const useReports = () =>
  useQuery({
    queryKey: ['reports'],
    queryFn: apiService.getReports,
  });
