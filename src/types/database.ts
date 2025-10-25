// Supabase Database Types
// This file should be generated from your Supabase schema
// For now, we'll create a placeholder structure

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          avatar_url: string | null;
          bio: string | null;
          is_provider: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          avatar_url?: string | null;
          bio?: string | null;
          is_provider?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          is_provider?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          provider_id: string;
          name: string;
          description: string;
          price: number;
          duration: number;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          provider_id: string;
          name: string;
          description: string;
          price: number;
          duration: number;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          provider_id?: string;
          name?: string;
          description?: string;
          price?: number;
          duration?: number;
          image_url?: string | null;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          provider_id: string;
          service_id: string;
          date: string;
          time: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider_id: string;
          service_id: string;
          date: string;
          time: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          provider_id?: string;
          service_id?: string;
          date?: string;
          time?: string;
          status?: string;
          created_at?: string;
        };
      };
      transformations: {
        Row: {
          id: string;
          user_id: string;
          before_image: string;
          after_image: string;
          description: string | null;
          likes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          before_image: string;
          after_image: string;
          description?: string | null;
          likes?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          before_image?: string;
          after_image?: string;
          description?: string | null;
          likes?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
