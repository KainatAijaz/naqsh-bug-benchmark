export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      artists: {
        Row: {
          bio: string | null
          city: string
          country: string
          created_at: string
          featured_until: string | null
          id: string
          is_available_today: boolean
          is_featured: boolean
          is_verified: boolean
          name: string
          phone: string | null
          price_from: number
          profile_image_url: string | null
          rating: number
          registration_paid: boolean
          specialty: string
          updated_at: string
          user_id: string | null
          whatsapp_api_key: string | null
        }
        Insert: {
          bio?: string | null
          city: string
          country: string
          created_at?: string
          featured_until?: string | null
          id?: string
          is_available_today?: boolean
          is_featured?: boolean
          is_verified?: boolean
          name: string
          phone?: string | null
          price_from?: number
          profile_image_url?: string | null
          rating?: number
          registration_paid?: boolean
          specialty: string
          updated_at?: string
          user_id?: string | null
          whatsapp_api_key?: string | null
        }
        Update: {
          bio?: string | null
          city?: string
          country?: string
          created_at?: string
          featured_until?: string | null
          id?: string
          is_available_today?: boolean
          is_featured?: boolean
          is_verified?: boolean
          name?: string
          phone?: string | null
          price_from?: number
          profile_image_url?: string | null
          rating?: number
          registration_paid?: boolean
          specialty?: string
          updated_at?: string
          user_id?: string | null
          whatsapp_api_key?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          artist_id: string
          booking_total: number
          commission_amount: number
          commission_rate: number
          created_at: string
          customer_id: string
          date: string
          id: string
          occasion: string | null
          package: string | null
          status: string
          updated_at: string
        }
        Insert: {
          artist_id: string
          booking_total?: number
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          customer_id: string
          date: string
          id?: string
          occasion?: string | null
          package?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          artist_id?: string
          booking_total?: number
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          customer_id?: string
          date?: string
          id?: string
          occasion?: string | null
          package?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          artist_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          artist_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          artist_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          id: string
          items_summary: string
          order_number: string
          shipping_address: string | null
          status: string
          stripe_session_id: string | null
          total: number
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          id?: string
          items_summary: string
          order_number: string
          shipping_address?: string | null
          status?: string
          stripe_session_id?: string | null
          total?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          id?: string
          items_summary?: string
          order_number?: string
          shipping_address?: string | null
          status?: string
          stripe_session_id?: string | null
          total?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      platform_payments: {
        Row: {
          amount: number
          artist_id: string
          created_at: string
          id: string
          payment_type: string
          status: string
          stripe_session_id: string | null
        }
        Insert: {
          amount?: number
          artist_id: string
          created_at?: string
          id?: string
          payment_type: string
          status?: string
          stripe_session_id?: string | null
        }
        Update: {
          amount?: number
          artist_id?: string
          created_at?: string
          id?: string
          payment_type?: string
          status?: string
          stripe_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_payments_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_images: {
        Row: {
          artist_id: string
          created_at: string
          id: string
          image_url: string
          style_tag: string | null
        }
        Insert: {
          artist_id: string
          created_at?: string
          id?: string
          image_url: string
          style_tag?: string | null
        }
        Update: {
          artist_id?: string
          created_at?: string
          id?: string
          image_url?: string
          style_tag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_images_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          id: string
          is_active: boolean
          is_bestseller: boolean
          long_description: string | null
          name: string
          price: number
          short_description: string | null
          slug: string
          stock: number
          stripe_price_id: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_bestseller?: boolean
          long_description?: string | null
          name: string
          price?: number
          short_description?: string | null
          slug: string
          stock?: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_bestseller?: boolean
          long_description?: string | null
          name?: string
          price?: number
          short_description?: string | null
          slug?: string
          stock?: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          artist_id: string
          booking_id: string | null
          comment: string | null
          created_at: string
          customer_name: string
          id: string
          rating: number
        }
        Insert: {
          artist_id: string
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          customer_name: string
          id?: string
          rating: number
        }
        Update: {
          artist_id?: string
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          customer_name?: string
          id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
