import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

export const storageService = {
  async uploadImage(
    uri: string,
    path: string,
    bucket: string = 'images',
  ): Promise<{ url: string | null; error: string | null }> {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const arrayBuffer = decode(base64);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error || !data) {
        return { url: null, error: error?.message ?? 'Upload failed' };
      }

      const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return { url: publicData.publicUrl, error: null };
    } catch (_e) {
      return { url: null, error: 'Failed to upload image' };
    }
  },

  async deleteImage(path: string, bucket: string = 'images'): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);
      if (error) return { error: error.message };
      return { error: null };
    } catch (_e) {
      return { error: 'Failed to delete image' };
    }
  },

  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  async listImages(bucket: string, path = ''): Promise<{ data: any[] | null; error: string | null }> {
    const { data, error } = await supabase.storage.from(bucket).list(path);
    return { data: data ?? null, error: error?.message ?? null };
  },

  async uploadAvatar(uri: string, userId: string) {
    const path = `avatars/${userId}-${Date.now()}.jpg`;
    return this.uploadImage(uri, path, 'images');
  },

  async uploadTransformationImage(uri: string, userId: string) {
    const path = `transformations/${userId}-${Date.now()}.jpg`;
    return this.uploadImage(uri, path, 'images');
  },
};

export default storageService;
