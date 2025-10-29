import { supabase } from './supabase';
import { Transformation, CreateTransformationData } from '@/types';

export const transformationsService = {
  async getFeed(page = 0, limit = 20): Promise<Transformation[]> {
    try {
      const { data, error } = await supabase
        .from('transformations')
        .select(`
          *,
          user:users(*),
          likes:transformation_likes(count)
        `)
        .order('created_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching feed:', error);
      return [];
    }
  },

  async getTransformationById(id: string): Promise<Transformation | null> {
    try {
      const { data, error } = await supabase
        .from('transformations')
        .select(`
          *,
          user:users(*),
          likes:transformation_likes(count)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching transformation:', error);
      return null;
    }
  },

  async getUserTransformations(userId: string): Promise<Transformation[]> {
    try {
      const { data, error } = await supabase
        .from('transformations')
        .select(`
          *,
          user:users(*),
          likes:transformation_likes(count)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching user transformations:', error);
      return [];
    }
  },

  async createTransformation(transformationData: CreateTransformationData): Promise<{ transformation: Transformation | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('transformations')
        .insert({
          user_id: user.id,
          image_url: transformationData.imageUrl,
          caption: transformationData.caption,
          category: transformationData.category,
        })
        .select(`
          *,
          user:users(*),
          likes:transformation_likes(count)
        `)
        .single();

      if (error) throw error;

      return { transformation: data, error: null };
    } catch (error) {
      console.error('Error creating transformation:', error);
      return { transformation: null, error: 'Failed to create transformation' };
    }
  },

  async likeTransformation(transformationId: string): Promise<{ error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('transformation_likes')
        .insert({
          transformation_id: transformationId,
          user_id: user.id,
        });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error liking transformation:', error);
      return { error: 'Failed to like transformation' };
    }
  },

  async unlikeTransformation(transformationId: string): Promise<{ error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('transformation_likes')
        .delete()
        .eq('transformation_id', transformationId)
        .eq('user_id', user.id);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error unliking transformation:', error);
      return { error: 'Failed to unlike transformation' };
    }
  },

  async deleteTransformation(transformationId: string): Promise<{ error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('transformations')
        .delete()
        .eq('id', transformationId)
        .eq('user_id', user.id);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error deleting transformation:', error);
      return { error: 'Failed to delete transformation' };
    }
  },
};