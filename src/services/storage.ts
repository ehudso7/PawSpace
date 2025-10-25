import { supabase } from './supabase';

export const storageService = {
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
