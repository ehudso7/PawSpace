import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getServiceById, getServices, searchServices } from '../services/bookings';
import { Service, ServiceFilters } from '../types/service';

export function useServiceById(id?: string) {
  return useQuery<Service, Error>({
    queryKey: ['service', id],
    queryFn: () => {
      if (!id) throw new Error('No service id');
      return getServiceById(id);
    },
    enabled: Boolean(id),
  });
}

export function useSearchServices(query: string) {
  return useQuery<Service[], Error>({
    queryKey: ['services', 'search', query],
    queryFn: () => searchServices(query),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });
}

export function useInfiniteServices(filters: ServiceFilters, pageSize = 12) {
  return useInfiniteQuery<Service[], Error, Service[], any, [string, ServiceFilters, number]>({
    queryKey: ['services', 'list', filters, pageSize],
    queryFn: async ({ pageParam = 0 }) => {
      const all = await getServices(filters);
      const start = pageParam * pageSize;
      const end = start + pageSize;
      return all.slice(start, end);
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < pageSize) return undefined;
      return allPages.length; // next page index
    },
    initialPageParam: 0,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 15,
  });
}
