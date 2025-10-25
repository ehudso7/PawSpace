import { useMemo } from 'react';
import type { RootStackParamList } from '../types/navigation';

export type NavigationTarget = keyof RootStackParamList;

interface Navigation {
  navigate: <T extends NavigationTarget>(screen: T, params?: RootStackParamList[T]) => void;
  push: <T extends NavigationTarget>(screen: T, params?: RootStackParamList[T]) => void;
  goBack: () => void;
}

export function useNavigation(): Navigation {
  // No-op stub to avoid runtime deps in this workspace
  return useMemo(
    () => ({
      navigate: () => undefined,
      push: () => undefined,
      goBack: () => undefined,
    }),
    []
  );
}

export function useRoute<T extends NavigationTarget>(): { params: RootStackParamList[T] } {
  // Stub: returns empty params casted
  return { params: {} as RootStackParamList[T] };
}
