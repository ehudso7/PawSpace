import { useState, useEffect } from 'react';
<<<<<<< HEAD
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
=======
import { transformationService } from '@/services/transformations';
import { Transformation } from '@/types/database';

export const useTransformations = () => {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransformations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await transformationService.getTransformations();
      setTransformations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transformations');
>>>>>>> origin/main
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
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
=======
  const fetchTransformationById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await transformationService.getTransformationById(id);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transformation';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createTransformation = async (transformationData: Omit<Transformation, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newTransformation = await transformationService.createTransformation(transformationData);
      setTransformations(prev => [newTransformation, ...prev]);
      return { data: newTransformation, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create transformation';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateTransformation = async (id: string, updates: Partial<Transformation>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTransformation = await transformationService.updateTransformation(id, updates);
      setTransformations(prev => 
        prev.map(transformation => 
          transformation.id === id ? updatedTransformation : transformation
        )
      );
      return { data: updatedTransformation, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update transformation';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
>>>>>>> origin/main
    }
  };

  const deleteTransformation = async (id: string) => {
<<<<<<< HEAD
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
=======
    setLoading(true);
    setError(null);
    try {
      await transformationService.deleteTransformation(id);
      setTransformations(prev => prev.filter(transformation => transformation.id !== id));
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete transformation';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const likeTransformation = async (id: string, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await transformationService.likeTransformation(id, userId);
      setTransformations(prev => 
        prev.map(transformation => 
          transformation.id === id 
            ? { ...transformation, likes: transformation.likes + 1 }
            : transformation
        )
      );
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to like transformation';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const unlikeTransformation = async (id: string, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await transformationService.unlikeTransformation(id, userId);
      setTransformations(prev => 
        prev.map(transformation => 
          transformation.id === id 
            ? { ...transformation, likes: Math.max(0, transformation.likes - 1) }
            : transformation
        )
      );
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unlike transformation';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
>>>>>>> origin/main
    }
  };

  return {
    transformations,
    loading,
    error,
<<<<<<< HEAD
    refetch: () => fetchTransformations(true),
    loadMore,
    createTransformation,
    likeTransformation,
    deleteTransformation,
  };
};

export default useTransformations;
=======
    fetchTransformations,
    fetchTransformationById,
    createTransformation,
    updateTransformation,
    deleteTransformation,
    likeTransformation,
    unlikeTransformation,
  };
};
>>>>>>> origin/main
