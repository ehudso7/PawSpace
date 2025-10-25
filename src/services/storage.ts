import { supabase } from '@/services/supabase';

export async function uploadUriToStorage(options: {
  bucket: string;
  uri: string;
  path: string; // e.g., userId/filename.jpg
  contentType?: string;
}): Promise<string> {
  const response = await fetch(options.uri);
  const blob = await response.blob();
  const { data, error } = await supabase.storage
    .from(options.bucket)
    .upload(options.path, blob, {
      upsert: true,
      contentType: options.contentType ?? blob.type,
    });
  if (error) throw error;
  const { data: publicUrl } = supabase.storage.from(options.bucket).getPublicUrl(data.path);
  return publicUrl.publicUrl;
}
