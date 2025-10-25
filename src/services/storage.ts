import { supabase } from './supabase';

export const storageService = {
  async uploadImage(file: File | Blob, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('images')
      .upload(path, file);
    
    if (error) throw error;
    return data.path;
  },

  async getImageUrl(path: string): Promise<string> {
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(path);
    
    return data.publicUrl;
  },

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