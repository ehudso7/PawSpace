import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

export const storageService = {
  async uploadImage(uri: string, path: string): Promise<{ url: string | null; error: string | null }> {
    try {
      // Read the file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to array buffer
      const arrayBuffer = decode(base64);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(path, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error) {
        return { url: null, error: error.message };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(data.path);

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading image:', error);
      return { url: null, error: 'Failed to upload image' };
    }
  },

  async deleteImage(path: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.storage
        .from('images')
        .remove([path]);

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Error deleting image:', error);
      return { error: 'Failed to delete image' };
    }
  },

  async uploadAvatar(uri: string, userId: string): Promise<{ url: string | null; error: string | null }> {
    const path = `avatars/${userId}-${Date.now()}.jpg`;
    return this.uploadImage(uri, path);
  },

  async uploadTransformationImage(uri: string, userId: string): Promise<{ url: string | null; error: string | null }> {
    const path = `transformations/${userId}-${Date.now()}.jpg`;
    return this.uploadImage(uri, path);
  },

  getImageUrl(path: string): string {
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(path);
    
    return data.publicUrl;
  },
};