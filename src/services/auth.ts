import { supabase } from './supabase';
import { User, UserProfile, SignUpData, SignInData, UpdateProfileData, AuthError } from '../types';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';

export class AuthService {
  static async signUp(data: SignUpData): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      // Sign up the user
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
          id: authData.user.id,
          full_name: data.profile.full_name,
          phone: data.profile.phone || null,
          location: data.profile.location || null,
          bio: data.profile.bio || null,
          user_type: data.userType,
        })
        .select()
        .single();

      if (profileError) {
        // If profile creation fails, we should clean up the auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
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
      return { 
        user: null, 
        error: { message: 'An unexpected error occurred during sign up' } 
      };
    }
  }

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
        .eq('id', authData.user.id)
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
      return { 
        user: null, 
        error: { message: 'An unexpected error occurred during sign in' } 
      };
    }
  }

  static async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { error: { message: error.message, code: error.message } };
      }

      return { error: null };
    } catch (error) {
      return { 
        error: { message: 'An unexpected error occurred during sign out' } 
      };
    }
  }

  static async getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError) {
        return { user: null, error: { message: authError.message, code: authError.message } };
      }

      if (!authUser) {
        return { user: null, error: null };
      }

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        return { user: null, error: { message: 'Failed to load user profile' } };
      }

      const user: User = {
        id: authUser.id,
        email: authUser.email!,
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
      return { 
        user: null, 
        error: { message: 'An unexpected error occurred while getting current user' } 
      };
    }
  }

  static async updateProfile(userId: string, data: UpdateProfileData): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          phone: data.phone,
          location: data.location,
          bio: data.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (profileError) {
        return { user: null, error: { message: 'Failed to update profile' } };
      }

      // Get updated user data
      const { data: authData } = await supabase.auth.getUser();
      
      const user: User = {
        id: userId,
        email: authData.data.user!.email!,
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
      return { 
        user: null, 
        error: { message: 'An unexpected error occurred while updating profile' } 
      };
    }
  }

  static async uploadAvatar(imageUri: string): Promise<{ url: string | null; error: AuthError | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { url: null, error: { message: 'User not authenticated' } };
      }

      // Create a unique filename
      const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Convert image to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) {
        return { url: null, error: { message: 'Failed to upload avatar' } };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        return { url: null, error: { message: 'Failed to update avatar URL' } };
      }

      return { url: publicUrl, error: null };
    } catch (error) {
      return { 
        url: null, 
        error: { message: 'An unexpected error occurred while uploading avatar' } 
      };
    }
  }

  static async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'pawspace://reset-password',
      });

      if (error) {
        return { error: { message: error.message, code: error.message } };
      }

      return { error: null };
    } catch (error) {
      return { 
        error: { message: 'An unexpected error occurred while resetting password' } 
      };
    }
  }

  static async selectImage(): Promise<{ uri: string | null; error: AuthError | null }> {
    return new Promise((resolve) => {
      const options = {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        maxWidth: 1000,
        maxHeight: 1000,
      };

      launchImageLibrary(options, (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorMessage) {
          resolve({ uri: null, error: { message: 'Image selection cancelled' } });
          return;
        }

        if (response.assets && response.assets[0]) {
          resolve({ uri: response.assets[0].uri || null, error: null });
        } else {
          resolve({ uri: null, error: { message: 'No image selected' } });
        }
      });
    });
  }
}