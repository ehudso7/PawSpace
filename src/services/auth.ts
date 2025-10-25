import { supabase } from './supabase';
import type { User as AppUser, UserProfile } from '../types';

export type UserType = 'pet_owner' | 'service_provider';

function mapToAppUser(authUser: { id: string; email?: string | null }, profileRow: any): AppUser {
  return {
    id: authUser.id,
    email: (authUser.email || profileRow?.email || '') as string,
    user_type: (profileRow?.user_type || 'pet_owner') as UserType,
    profile: {
      full_name: profileRow?.full_name || '',
      avatar_url: profileRow?.avatar_url || undefined,
      phone: profileRow?.phone || undefined,
      location: profileRow?.location || undefined,
      bio: profileRow?.bio || undefined,
    },
  };
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const authUser = userResult.user;
  if (!authUser) return null;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (profileError && profileError.code !== 'PGRST116') throw profileError;

  return mapToAppUser({ id: authUser.id, email: authUser.email }, profile || {});
}

export async function signUp(
  email: string,
  password: string,
  userType: UserType,
  profileData: Partial<UserProfile> & { full_name: string }
): Promise<AppUser> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  const authUser = data.user;
  if (!authUser) {
    throw new Error('Sign up succeeded, but verification is required before login.');
  }

  const insertPayload = {
    id: authUser.id,
    email: authUser.email,
    full_name: profileData.full_name || '',
    phone: profileData.phone ?? null,
    location: profileData.location ?? null,
    bio: profileData.bio ?? null,
    avatar_url: profileData.avatar_url ?? null,
    user_type: userType,
  };

  const { error: insertError } = await supabase.from('profiles').insert(insertPayload);
  if (insertError && insertError.code !== '23505') {
    // ignore duplicate key, otherwise throw
    throw insertError;
  }

  const user = await getCurrentUser();
  if (!user) {
    // In email confirmation mode, session is null. Return a lightweight user object.
    return mapToAppUser({ id: authUser.id, email: authUser.email }, insertPayload);
  }
  return user;
}

export async function signIn(email: string, password: string): Promise<AppUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const user = await getCurrentUser();
  if (!user) throw new Error('Unable to fetch user after sign in.');
  return user;
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function updateProfile(
  userData: Partial<UserProfile> & { user_type?: UserType }
): Promise<AppUser> {
  const { data: auth, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const authUser = auth.user;
  if (!authUser) throw new Error('Not authenticated');

  const payload: Record<string, any> = { ...userData, updated_at: new Date().toISOString() };

  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', authUser.id)
    .select('*')
    .single();

  if (error) throw error;

  return mapToAppUser({ id: authUser.id, email: authUser.email }, data);
}

function getFileExtFromUri(uri: string): string {
  const qIndex = uri.indexOf('?');
  const clean = qIndex >= 0 ? uri.substring(0, qIndex) : uri;
  const dotIndex = clean.lastIndexOf('.');
  if (dotIndex === -1) return 'jpg';
  return clean.substring(dotIndex + 1);
}

export async function uploadAvatar(imageUri: string): Promise<string> {
  const { data: auth, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const authUser = auth.user;
  if (!authUser) throw new Error('Not authenticated');

  const response = await fetch(imageUri);
  const blob = await response.blob();
  const fileExt = getFileExtFromUri(imageUri).toLowerCase();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${authUser.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, blob, {
      contentType: blob.type || (fileExt === 'png' ? 'image/png' : 'image/jpeg'),
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(filePath);

  await updateProfile({ avatar_url: publicUrl });
  return publicUrl;
}
