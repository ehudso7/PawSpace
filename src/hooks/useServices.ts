import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getServices, getServiceById, searchServices } from '../services/bookings';
import { ServiceFilters, UserLocation } from '../types/booking';

const SERVICES_QUERY_KEY = 'services';
const SERVICE_QUERY_KEY = 'service';
const SEARCH_QUERY_KEY = 'search';

/**
 * Hook for fetching services with infinite scroll pagination
 */
export function useServices(
  filters: ServiceFilters = {},
  userLocation?: UserLocation,
  enabled: boolean = true
) {
  return useInfiniteQuery({
    queryKey: [SERVICES_QUERY_KEY, filters, userLocation],
    queryFn: ({ pageParam = 1 }) =>
      getServices(filters, userLocation, pageParam, 10),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_more ? lastPage.pagination.page + 1 : undefined,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching a single service by ID
 */
export function useService(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: [SERVICE_QUERY_KEY, id],
    queryFn: () => getServiceById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook for searching services with debouncing
 */
export function useSearchServices(
  query: string,
  userLocation?: UserLocation,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: [SEARCH_QUERY_KEY, query, userLocation],
    queryFn: () => searchServices(query, userLocation),
    enabled: enabled && query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
}