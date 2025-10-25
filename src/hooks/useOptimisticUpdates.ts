import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

interface OptimisticUpdateOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  showErrorAlert?: boolean;
}

export function useOptimisticUpdates<T>(
  initialData: T,
  updateFn: (data: T) => T,
  apiCall: () => Promise<any>,
  options: OptimisticUpdateOptions<T> = {}
) {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    const originalData = data;
    
    // Optimistic update
    setData(updateFn(data));
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      options.onSuccess?.(result);
    } catch (err) {
      // Revert on failure
      setData(originalData);
      setError(err as Error);
      
      if (options.showErrorAlert !== false) {
        Alert.alert('Error', 'Operation failed. Please try again.');
      }
      
      options.onError?.(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [data, updateFn, apiCall, options]);

  return {
    data,
    isLoading,
    error,
    execute,
    setData,
  };
}

export function useOptimisticLike(
  initialLiked: boolean,
  initialLikesCount: number,
  likeApiCall: () => Promise<void>,
  unlikeApiCall: () => Promise<void>
) {
  return useOptimisticUpdates(
    { isLiked: initialLiked, likesCount: initialLikesCount },
    (data) => ({
      isLiked: !data.isLiked,
      likesCount: data.isLiked ? data.likesCount - 1 : data.likesCount + 1,
    }),
    data => data.isLiked ? likeApiCall() : unlikeApiCall(),
    { showErrorAlert: true }
  );
}

export function useOptimisticSave(
  initialSaved: boolean,
  saveApiCall: () => Promise<void>,
  unsaveApiCall: () => Promise<void>
) {
  return useOptimisticUpdates(
    { isSaved: initialSaved },
    (data) => ({ isSaved: !data.isSaved }),
    data => data.isSaved ? saveApiCall() : unsaveApiCall(),
    { showErrorAlert: true }
  );
}

export function useOptimisticFollow(
  initialFollowing: boolean,
  followApiCall: () => Promise<void>,
  unfollowApiCall: () => Promise<void>
) {
  return useOptimisticUpdates(
    { isFollowing: initialFollowing },
    (data) => ({ isFollowing: !data.isFollowing }),
    data => data.isFollowing ? followApiCall() : unfollowApiCall(),
    { showErrorAlert: true }
  );
}