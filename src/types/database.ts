// Supabase Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar: string | null;
          phone: string | null;
          bio: string | null;
          location: string | null;
          is_premium: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          avatar?: string | null;
          phone?: string | null;
          bio?: string | null;
          location?: string | null;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar?: string | null;
          phone?: string | null;
          bio?: string | null;
          location?: string | null;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      providers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          title: string;
          description: string;
          avatar: string;
          cover_image: string | null;
          location: string;
          rating: number;
          review_count: number;
          starting_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          title: string;
          description: string;
          avatar: string;
          cover_image?: string | null;
          location: string;
          rating?: number;
          review_count?: number;
          starting_price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          title?: string;
          description?: string;
          avatar?: string;
          cover_image?: string | null;
          location?: string;
          rating?: number;
          review_count?: number;
          starting_price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          provider_id: string;
          title: string;
          description: string;
          price: number;
          duration: number;
          image_url: string;
          category: string;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          provider_id: string;
          title: string;
          description: string;
          price: number;
          duration: number;
          image_url: string;
          category: string;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          provider_id?: string;
          title?: string;
          description?: string;
          price?: number;
          duration?: number;
          image_url?: string;
          category?: string;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          service_id: string;
          provider_id: string;
          date: string;
          time: string;
          status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
          notes: string | null;
          total_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          service_id: string;
          provider_id: string;
          date: string;
          time: string;
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
          notes?: string | null;
          total_price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          service_id?: string;
          provider_id?: string;
          date?: string;
          time?: string;
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
          notes?: string | null;
          total_price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      transformations: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          caption: string;
          category: string;
          likes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_url: string;
          caption: string;
          category: string;
          likes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          image_url?: string;
          caption?: string;
          category?: string;
          likes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      transformation_likes: {
        Row: {
          id: string;
          transformation_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          transformation_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          transformation_id?: string;
          user_id?: string;
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