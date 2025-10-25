/**
 * Authentication service using Supabase
 * Handles all authentication operations including sign up, sign in, sign out, and profile management
 */

import { supabase } from './supabase';
import { User, UserProfile, UserType, AuthError } from '../types';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

/**
 * Sign up a new user with email and password
 * Creates both auth user and profile record
 */
export const signUp = async (
  email: string,
  password: string,
  userType: UserType,
  profileData: {
    full_name: string;
    phone?: string;
    location?: string;
  }
): Promise<{ user: User | null; error: AuthError | null }> => {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return {
        user: null,
        error: {
          message: authError.message,
          code: authError.status?.toString(),
        },
      };
    }

    if (!authData.user) {
      return {
        user: null,
        error: {
          message: 'Failed to create user account',
        },
      };
    }

    // Create profile record
    const { data: profileRecord, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        user_type: userType,
        full_name: profileData.full_name,
        phone: profileData.phone || null,
        location: profileData.location || null,
      })
      .select()
      .single();

    if (profileError) {
      // If profile creation fails, try to delete the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      return {
        user: null,
        error: {
          message: 'Failed to create user profile',
          code: profileError.code,
        },
      };
    }

    const user: User = {
      id: authData.user.id,
      email: authData.user.email!,
      user_type: userType,
      profile: {
        full_name: profileRecord.full_name,
        avatar_url: profileRecord.avatar_url || undefined,
        phone: profileRecord.phone || undefined,
        location: profileRecord.location || undefined,
        bio: profileRecord.bio || undefined,
      },
    };

    return { user, error: null };
  } catch (error: any) {
    return {
      user: null,
      error: {
        message: error.message || 'An unexpected error occurred during sign up',
      },
    };
  }
};

/**
 * Sign in an existing user with email and password
 */
export const signIn = async (
  email: string,
  password: string
): Promise<{ user: User | null; error: AuthError | null }> => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return {
        user: null,
        error: {
          message: authError.message,
          code: authError.status?.toString(),
        },
      };
    }

    if (!authData.user) {
      return {
        user: null,
        error: {
          message: 'Failed to sign in',
        },
      };
    }

    // Fetch user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (profileError || !profileData) {
      return {
        user: null,
        error: {
          message: 'Failed to fetch user profile',
          code: profileError?.code,
        },
      };
    }

    const user: User = {
      id: authData.user.id,
      email: authData.user.email!,
      user_type: profileData.user_type,
      profile: {
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url || undefined,
        phone: profileData.phone || undefined,
        location: profileData.location || undefined,
        bio: profileData.bio || undefined,
      },
    };

    return { user, error: null };
  } catch (error: any) {
    return {
      user: null,
      error: {
        message: error.message || 'An unexpected error occurred during sign in',
      },
    };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return {
        error: {
          message: error.message,
        },
      };
    }

    return { error: null };
  } catch (error: any) {
    return {
      error: {
        message: error.message || 'An unexpected error occurred during sign out',
      },
    };
  }
};

/**
 * Get the current authenticated user with their profile
 */
export const getCurrentUser = async (): Promise<{ user: User | null; error: AuthError | null }> => {
  try {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      return {
        user: null,
        error: {
          message: authError.message,
        },
      };
    }

    if (!authUser) {
      return { user: null, error: null };
    }

    // Fetch user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authUser.id)
      .single();

    if (profileError || !profileData) {
      return {
        user: null,
        error: {
          message: 'Failed to fetch user profile',
          code: profileError?.code,
        },
      };
    }

    const user: User = {
      id: authUser.id,
      email: authUser.email!,
      user_type: profileData.user_type,
      profile: {
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url || undefined,
        phone: profileData.phone || undefined,
        location: profileData.location || undefined,
        bio: profileData.bio || undefined,
      },
    };

    return { user, error: null };
  } catch (error: any) {
    return {
      user: null,
      error: {
        message: error.message || 'An unexpected error occurred while fetching user',
      },
    };
  }
};

/**
 * Update user profile data
 */
export const updateProfile = async (
  userId: string,
  userData: Partial<UserProfile>
): Promise<{ profile: UserProfile | null; error: AuthError | null }> => {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (userData.full_name) updateData.full_name = userData.full_name;
    if (userData.phone !== undefined) updateData.phone = userData.phone;
    if (userData.location !== undefined) updateData.location = userData.location;
    if (userData.bio !== undefined) updateData.bio = userData.bio;
    if (userData.avatar_url !== undefined) updateData.avatar_url = userData.avatar_url;

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return {
        profile: null,
        error: {
          message: 'Failed to update profile',
          code: error.code,
        },
      };
    }

    const profile: UserProfile = {
      full_name: data.full_name,
      avatar_url: data.avatar_url || undefined,
      phone: data.phone || undefined,
      location: data.location || undefined,
      bio: data.bio || undefined,
    };

    return { profile, error: null };
  } catch (error: any) {
    return {
      profile: null,
      error: {
        message: error.message || 'An unexpected error occurred while updating profile',
      },
    };
  }
};

/**
 * Upload user avatar image to Supabase storage
 */
export const uploadAvatar = async (
  userId: string,
  imageUri: string
): Promise<{ url: string | null; error: AuthError | null }> => {
  try {
    // Read the file as base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Generate unique filename
    const fileExt = imageUri.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Convert base64 to array buffer
    const arrayBuffer = decode(base64);

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, arrayBuffer, {
        contentType: `image/${fileExt}`,
        upsert: true,
      });

    if (error) {
      return {
        url: null,
        error: {
          message: 'Failed to upload avatar',
          code: error.message,
        },
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update profile with new avatar URL
    await updateProfile(userId, { avatar_url: publicUrl });

    return { url: publicUrl, error: null };
  } catch (error: any) {
    return {
      url: null,
      error: {
        message: error.message || 'An unexpected error occurred while uploading avatar',
      },
    };
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  email: string
): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      return {
        error: {
          message: error.message,
        },
      };
    }

    return { error: null };
  } catch (error: any) {
    return {
      error: {
        message: error.message || 'Failed to send password reset email',
      },
    };
  }
};
