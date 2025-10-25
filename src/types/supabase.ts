// Minimal inferred Database type for Supabase typed client usage.
// Adjust to match your actual Supabase schema if it differs.

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
          id: string; // UUID referencing auth.users
          user_type: 'pet_owner' | 'service_provider';
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          location: string | null;
          bio: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          user_type: 'pet_owner' | 'service_provider';
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          location?: string | null;
          bio?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          user_type?: 'pet_owner' | 'service_provider';
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          location?: string | null;
          bio?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
