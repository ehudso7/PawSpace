import { supabase } from './supabase';
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
    const { error } = await supabase
      .from('transformations')
      .delete()
      .eq('id', id);
    
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