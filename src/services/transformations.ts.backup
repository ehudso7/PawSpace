import { supabase } from './supabase';
<<<<<<< HEAD
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
=======
<<<<<<< HEAD

export interface Transformation {
  id: string;
  user_id: string;
  before_image: string;
  after_image: string;
  description?: string;
  likes: number;
  created_at: string;
}

export const transformationsService = {
  async createTransformation(transformationData: Omit<Transformation, 'id' | 'created_at' | 'likes'>): Promise<{ data: Transformation | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('transformations')
      .insert({
        ...transformationData,
        likes: 0,
      })
      .select()
      .single();

    return {
      data: data as Transformation | null,
      error: error as Error | null,
    };
  },

  async getTransformations(limit = 20, offset = 0): Promise<{ data: Transformation[] | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('transformations')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    return {
      data: data as Transformation[] | null,
      error: error as Error | null,
    };
  },

  async getTransformationById(id: string): Promise<{ data: Transformation | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('transformations')
      .select('*')
      .eq('id', id)
      .single();

    return {
      data: data as Transformation | null,
      error: error as Error | null,
    };
  },

  async likeTransformation(id: string): Promise<{ data: Transformation | null; error: Error | null }> {
    const { data: transformation, error: fetchError } = await this.getTransformationById(id);
    
    if (fetchError || !transformation) {
      return { data: null, error: fetchError };
    }

    const { data, error } = await supabase
      .from('transformations')
      .update({ likes: transformation.likes + 1 })
      .eq('id', id)
      .select()
      .single();

    return {
      data: data as Transformation | null,
      error: error as Error | null,
    };
  },

  async deleteTransformation(id: string): Promise<{ error: Error | null }> {
=======
import { Transformation } from '@/types/database';

export const transformationService = {
  async getTransformations(): Promise<Transformation[]> {
    const { data, error } = await supabase
      .from('transformations')
      .select(`
        *,
        provider:providers(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getTransformationById(id: string): Promise<Transformation | null> {
    const { data, error } = await supabase
      .from('transformations')
      .select(`
        *,
        provider:providers(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createTransformation(transformation: Omit<Transformation, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('transformations')
      .insert([transformation])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateTransformation(id: string, updates: Partial<Transformation>) {
    const { data, error } = await supabase
      .from('transformations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteTransformation(id: string) {
>>>>>>> origin/main
    const { error } = await supabase
      .from('transformations')
      .delete()
      .eq('id', id);
<<<<<<< HEAD

    return { error: error as Error | null };
  },
};

export default transformationsService;
=======
    
    if (error) throw error;
  },

  async likeTransformation(id: string, userId: string) {
    const { data, error } = await supabase
      .from('transformation_likes')
      .insert([{ transformation_id: id, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async unlikeTransformation(id: string, userId: string) {
    const { error } = await supabase
      .from('transformation_likes')
      .delete()
      .eq('transformation_id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
  },
};
>>>>>>> origin/main
>>>>>>> origin/main
