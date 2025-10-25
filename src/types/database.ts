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
          is_verified: boolean;
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
          is_verified?: boolean;
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
          is_verified?: boolean;
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
          category: string;
          price: number;
          duration: number;
          image_url: string;
          rating: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          provider_id: string;
          title: string;
          description: string;
          category: string;
          price: number;
          duration: number;
          image_url: string;
          rating?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          provider_id?: string;
          title?: string;
          description?: string;
          category?: string;
          price?: number;
          duration?: number;
          image_url?: string;
          rating?: number;
          is_active?: boolean;
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
          time_slot: string;
          status: string;
          notes: string | null;
          total_amount: number;
          payment_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          service_id: string;
          provider_id: string;
          date: string;
          time_slot: string;
          status?: string;
          notes?: string | null;
          total_amount: number;
          payment_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          service_id?: string;
          provider_id?: string;
          date?: string;
          time_slot?: string;
          status?: string;
          notes?: string | null;
          total_amount?: number;
          payment_status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      transformations: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          before_image_url: string | null;
          caption: string;
          tags: string[];
          likes_count: number;
          comments_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_url: string;
          before_image_url?: string | null;
          caption: string;
          tags?: string[];
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          image_url?: string;
          before_image_url?: string | null;
          caption?: string;
          tags?: string[];
          likes_count?: number;
          comments_count?: number;
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
      transformation_comments: {
        Row: {
          id: string;
          transformation_id: string;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          transformation_id: string;
          user_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          transformation_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          user_id: string;
          provider_id: string;
          rating: number;
          comment: string | null;
          images: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          user_id: string;
          provider_id: string;
          rating: number;
          comment?: string | null;
          images?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          user_id?: string;
          provider_id?: string;
          rating?: number;
          comment?: string | null;
          images?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      pets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          species: string;
          breed: string | null;
          age: number | null;
          weight: number | null;
          color: string | null;
          avatar: string | null;
          medical_notes: string | null;
          behavior_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          species: string;
          breed?: string | null;
          age?: number | null;
          weight?: number | null;
          color?: string | null;
          avatar?: string | null;
          medical_notes?: string | null;
          behavior_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          species?: string;
          breed?: string | null;
          age?: number | null;
          weight?: number | null;
          color?: string | null;
          avatar?: string | null;
          medical_notes?: string | null;
          behavior_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: string;
          status: string;
          start_date: string;
          end_date: string;
          auto_renew: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan: string;
          status?: string;
          start_date: string;
          end_date: string;
          auto_renew?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: string;
          status?: string;
          start_date?: string;
          end_date?: string;
          auto_renew?: boolean;
          created_at?: string;
          updated_at?: string;
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
      service_category: 'grooming' | 'training' | 'veterinary' | 'boarding' | 'walking' | 'sitting' | 'photography' | 'other';
      booking_status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
      payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
      pet_species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
      subscription_plan: 'free' | 'premium' | 'pro';
      subscription_status: 'active' | 'cancelled' | 'expired' | 'past_due';
    };
  };
}