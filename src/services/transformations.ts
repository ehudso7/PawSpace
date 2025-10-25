import { supabase } from './supabase';

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
    const { error } = await supabase
      .from('transformations')
      .delete()
      .eq('id', id);

    return { error: error as Error | null };
  },
};

export default transformationsService;
