import { useState, useEffect } from 'react';
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
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const deleteTransformation = async (id: string) => {
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
    }
  };

  return {
    transformations,
    loading,
    error,
    fetchTransformations,
    fetchTransformationById,
    createTransformation,
    updateTransformation,
    deleteTransformation,
    likeTransformation,
    unlikeTransformation,
  };
};
