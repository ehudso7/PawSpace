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
          likes:transformation_likes(count),
          comments:transformation_comments(
            *,
            user:users(*)
          )
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

  async createTransformation(transformationData: CreateTransformationData): Promise<{ transformation: Transformation | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { transformation: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('transformations')
        .insert({
          ...transformationData,
          userId: user.id,
        })
        .select()
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
      
      if (!user) {
        return { error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('transformation_likes')
        .upsert({
          transformationId,
          userId: user.id,
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
      
      if (!user) {
        return { error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('transformation_likes')
        .delete()
        .eq('transformationId', transformationId)
        .eq('userId', user.id);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error unliking transformation:', error);
      return { error: 'Failed to unlike transformation' };
    }
  },

  async getUserTransformations(userId?: string): Promise<Transformation[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) return [];

      const { data, error } = await supabase
        .from('transformations')
        .select(`
          *,
          user:users(*),
          likes:transformation_likes(count)
        `)
        .eq('userId', targetUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching user transformations:', error);
      return [];
    }
  },
};
    const { error } = await supabase
      .from('transformations')
      .delete()
      .eq('id', id);

    return { error: error as Error | null };
  },
};

export default transformationsService;
