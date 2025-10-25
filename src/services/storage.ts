import { supabase } from './supabase';
<<<<<<< HEAD
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
=======

export const storageService = {
<<<<<<< HEAD
  async uploadImage(
    bucket: string,
    path: string,
    file: File | Blob,
    options?: { contentType?: string; upsert?: boolean }
  ): Promise<{ data: { path: string } | null; error: Error | null }> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: options?.contentType,
        upsert: options?.upsert,
      });

    return {
      data: data as { path: string } | null,
      error: error as Error | null,
    };
  },

  async downloadImage(bucket: string, path: string): Promise<{ data: Blob | null; error: Error | null }> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);

    return {
      data,
      error: error as Error | null,
    };
  },

  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  },

  async deleteImage(bucket: string, path: string): Promise<{ error: Error | null }> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    return { error: error as Error | null };
  },

  async listImages(bucket: string, path = ''): Promise<{ data: any[] | null; error: Error | null }> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path);

    return {
      data,
      error: error as Error | null,
    };
  },
};

export default storageService;
=======
  async uploadImage(file: File | Blob, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('images')
      .upload(path, file);
    
    if (error) throw error;
    return data.path;
  },

  async getImageUrl(path: string): Promise<string> {
>>>>>>> origin/main
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(path);
    
    return data.publicUrl;
  },
<<<<<<< HEAD
};
=======

  async deleteImage(path: string) {
    const { error } = await supabase.storage
      .from('images')
      .remove([path]);
    
    if (error) throw error;
  },

  async uploadTransformationImages(
    beforeImage: File | Blob,
    afterImage: File | Blob,
    transformationId: string
  ): Promise<{ beforeUrl: string; afterUrl: string }> {
    const beforePath = `transformations/${transformationId}/before.jpg`;
    const afterPath = `transformations/${transformationId}/after.jpg`;

    const [beforeUrl, afterUrl] = await Promise.all([
      this.uploadImage(beforeImage, beforePath),
      this.uploadImage(afterImage, afterPath),
    ]);

    return {
      beforeUrl: await this.getImageUrl(beforeUrl),
      afterUrl: await this.getImageUrl(afterUrl),
    };
  },

  async uploadProfileImage(userId: string, image: File | Blob): Promise<string> {
    const path = `profiles/${userId}/avatar.jpg`;
    const uploadedPath = await this.uploadImage(image, path);
    return this.getImageUrl(uploadedPath);
  },
};
>>>>>>> origin/main
>>>>>>> origin/main
