import { supabase } from './supabase';

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
>>>>>>> origin/main
