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
      return { url: null, error: 'Failed to upload image' };
    }
  },

  async uploadAvatar(uri: string, userId: string): Promise<{ url: string | null; error: string | null }> {
    const path = `avatars/${userId}-${Date.now()}.jpg`;
    return this.uploadImage(uri, path);
  },

  async uploadTransformation(uri: string, userId: string): Promise<{ url: string | null; error: string | null }> {
    const path = `transformations/${userId}-${Date.now()}.jpg`;
    return this.uploadImage(uri, path);
  },

  async uploadServiceImage(uri: string, serviceId: string): Promise<{ url: string | null; error: string | null }> {
    const path = `services/${serviceId}-${Date.now()}.jpg`;
    return this.uploadImage(uri, path);
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
      return { error: 'Failed to delete image' };
    }
  },

  async getImageUrl(path: string): string | null {
    try {
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(path);

      return publicUrl;
    } catch (error) {
      return null;
    }
  },
};