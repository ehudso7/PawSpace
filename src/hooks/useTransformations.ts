import { useState, useEffect } from 'react';
import { transformationsService, type Transformation } from '@/services/transformations';

export const useTransformations = (limit = 20) => {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [offset, setOffset] = useState(0);

  const fetchTransformations = async (resetOffset = false) => {
    setLoading(true);
    setError(null);
    const currentOffset = resetOffset ? 0 : offset;
    try {
      const { data, error: fetchError } = await transformationsService.getTransformations(limit, currentOffset);
      if (fetchError) throw fetchError;
      if (resetOffset) {
        setTransformations(data || []);
        setOffset(0);
      } else {
        setTransformations([...transformations, ...(data || [])]);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransformations(true);
  }, []);

  const loadMore = () => {
    setOffset(offset + limit);
    fetchTransformations();
  };

  const createTransformation = async (transformationData: Omit<Transformation, 'id' | 'created_at' | 'likes'>) => {
    setError(null);
    try {
      const { data, error: createError } = await transformationsService.createTransformation(transformationData);
      if (createError) throw createError;
      if (data) {
        setTransformations([data, ...transformations]);
      }
      return { data, error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { data: null, error };
    }
  };

  const likeTransformation = async (id: string) => {
    setError(null);
    try {
      const { data, error: likeError } = await transformationsService.likeTransformation(id);
      if (likeError) throw likeError;
      if (data) {
        setTransformations(transformations.map(t => t.id === id ? data : t));
      }
      return { data, error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { data: null, error };
    }
  };

  const deleteTransformation = async (id: string) => {
    setError(null);
    try {
      const { error: deleteError } = await transformationsService.deleteTransformation(id);
      if (deleteError) throw deleteError;
      setTransformations(transformations.filter(t => t.id !== id));
      return { error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { error };
    }
  };

  return {
    transformations,
    loading,
    error,
    refetch: () => fetchTransformations(true),
    loadMore,
    createTransformation,
    likeTransformation,
    deleteTransformation,
  };
};

export default useTransformations;
