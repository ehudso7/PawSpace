// Minimal Supabase Database type placeholder to satisfy TypeScript generics
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: Record<
      string,
      {
        Row: Record<string, any>;
        Insert: Record<string, any>;
        Update: Record<string, any>;
      }
    >;
    Views: never;
    Functions: never;
    Enums: Record<string, any>;
  };
}
