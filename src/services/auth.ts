import { supabase } from './supabase';
import { User, UserProfile, SignUpData, SignInData, AuthError } from '../types';
import * as FileSystem from 'expo-file-system';

export class AuthService {
  /**
   * Sign up a new user with email and password
   */
  static async signUp(data: SignUpData): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      // First, create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        return { user: null, error: { message: authError.message, code: authError.message } };
      }

      if (!authData.user) {
        return { user: null, error: { message: 'Failed to create user account' } };
      }

      // Create user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          full_name: data.profile.full_name,
          phone: data.profile.phone,
          location: data.profile.location,
          bio: data.profile.bio,
          user_type: data.userType,
        })
        .select()
        .single();

      if (profileError) {
        // If profile creation fails, we should clean up the auth user
        await supabase.auth.signOut();
        return { user: null, error: { message: 'Failed to create user profile' } };
      }

      const user: User = {
        id: authData.user.id,
        email: authData.user.email!,
        user_type: data.userType,
        profile: {
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
          phone: profileData.phone,
          location: profileData.location,
          bio: profileData.bio,
        },
      };

      return { user, error: null };
    } catch (error) {
      return { user: null, error: { message: 'An unexpected error occurred during sign up' } };
    }
  }

  /**
   * Sign in an existing user
   */
  static async signIn(data: SignInData): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        return { user: null, error: { message: authError.message, code: authError.message } };
      }

      if (!authData.user) {
        return { user: null, error: { message: 'Failed to sign in' } };
      }

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      if (profileError) {
        return { user: null, error: { message: 'Failed to load user profile' } };
      }

      const user: User = {
        id: authData.user.id,
        email: authData.user.email!,
        user_type: profileData.user_type,
        profile: {
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
          phone: profileData.phone,
          location: profileData.location,
          bio: profileData.bio,
        },
      };

      return { user, error: null };
    } catch (error) {
      return { user: null, error: { message: 'An unexpected error occurred during sign in' } };
    }
  }

  /**
   * Sign out the current user
   */
  static async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: { message: error.message, code: error.message } };
      }
      return { error: null };
    } catch (error) {
      return { error: { message: 'An unexpected error occurred during sign out' } };
    }
  }

  /**
   * Get the current authenticated user
   */
  static async getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError) {
        return { user: null, error: { message: authError.message, code: authError.message } };
      }

      if (!authData.user) {
        return { user: null, error: null };
      }

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      if (profileError) {
        return { user: null, error: { message: 'Failed to load user profile' } };
      }

      const user: User = {
        id: authData.user.id,
        email: authData.user.email!,
        user_type: profileData.user_type,
        profile: {
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
          phone: profileData.phone,
          location: profileData.location,
          bio: profileData.bio,
        },
      };

      return { user, error: null };
    } catch (error) {
      return { user: null, error: { message: 'An unexpected error occurred while getting current user' } };
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return { user: null, error: { message: 'Failed to update profile' } };
      }

      // Get the updated user
      return await this.getCurrentUser();
    } catch (error) {
      return { user: null, error: { message: 'An unexpected error occurred while updating profile' } };
    }
  }

  /**
   * Upload avatar image
   */
  static async uploadAvatar(userId: string, imageUri: string): Promise<{ avatarUrl: string | null; error: AuthError | null }> {
    try {
      // Read the file
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        return { avatarUrl: null, error: { message: 'Image file not found' } };
      }

      // Generate a unique filename
      const fileExt = imageUri.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to blob
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, byteArray, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (error) {
        return { avatarUrl: null, error: { message: 'Failed to upload avatar' } };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = urlData.publicUrl;

      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('user_id', userId);

      if (updateError) {
        return { avatarUrl: null, error: { message: 'Failed to update profile with new avatar' } };
      }

      return { avatarUrl, error: null };
    } catch (error) {
      return { avatarUrl: null, error: { message: 'An unexpected error occurred while uploading avatar' } };
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        return { error: { message: error.message, code: error.message } };
      }
      return { error: null };
    } catch (error) {
      return { error: { message: 'An unexpected error occurred while resetting password' } };
    }
  }
}