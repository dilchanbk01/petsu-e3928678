export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_credentials: {
        Row: {
          created_at: string
          email: string
          id: string
          password_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          password_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["admin_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["admin_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
          user_id?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          amount: number
          appointment_time: string
          created_at: string
          id: string
          payment_status: string
          session_type: string
          status: string
          updated_at: string
          user_id: string | null
          vet_id: string | null
        }
        Insert: {
          amount: number
          appointment_time: string
          created_at?: string
          id?: string
          payment_status?: string
          session_type: string
          status?: string
          updated_at?: string
          user_id?: string | null
          vet_id?: string | null
        }
        Update: {
          amount?: number
          appointment_time?: string
          created_at?: string
          id?: string
          payment_status?: string
          session_type?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          vet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_vet_id_fkey"
            columns: ["vet_id"]
            isOneToOne: false
            referencedRelation: "vets"
            referencedColumns: ["id"]
          },
        ]
      }
      dynamic_content: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          type: string
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          quantity: number
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          quantity: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          quantity?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          approval_status: string
          available_tickets: number | null
          created_at: string
          creator_id: string | null
          date: string
          description: string
          id: string
          image_url: string | null
          location: string
          price: number
          time: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          approval_status?: string
          available_tickets?: number | null
          created_at?: string
          creator_id?: string | null
          date: string
          description: string
          id?: string
          image_url?: string | null
          location: string
          price?: number
          time: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          approval_status?: string
          available_tickets?: number | null
          created_at?: string
          creator_id?: string | null
          date?: string
          description?: string
          id?: string
          image_url?: string | null
          location?: string
          price?: number
          time?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vet_availability: {
        Row: {
          available_slots: string[] | null
          created_at: string
          id: string
          is_online: boolean | null
          last_seen_at: string | null
          updated_at: string
          vet_id: string | null
        }
        Insert: {
          available_slots?: string[] | null
          created_at?: string
          id?: string
          is_online?: boolean | null
          last_seen_at?: string | null
          updated_at?: string
          vet_id?: string | null
        }
        Update: {
          available_slots?: string[] | null
          created_at?: string
          id?: string
          is_online?: boolean | null
          last_seen_at?: string | null
          updated_at?: string
          vet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vet_availability_vet_id_fkey"
            columns: ["vet_id"]
            isOneToOne: false
            referencedRelation: "vets"
            referencedColumns: ["id"]
          },
        ]
      }
      vet_credentials: {
        Row: {
          created_at: string | null
          email: string
          id: string
          password_hash: string
          updated_at: string | null
          vet_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          password_hash: string
          updated_at?: string | null
          vet_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          password_hash?: string
          updated_at?: string | null
          vet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vet_credentials_vet_id_fkey"
            columns: ["vet_id"]
            isOneToOne: false
            referencedRelation: "vets"
            referencedColumns: ["id"]
          },
        ]
      }
      vets: {
        Row: {
          approval_status: string
          consultation_fee: number
          created_at: string
          experience: string | null
          id: string
          image_url: string | null
          languages: string[] | null
          location: string
          name: string
          pet_types: string[] | null
          rating: number | null
          specialty: string
          updated_at: string
        }
        Insert: {
          approval_status?: string
          consultation_fee: number
          created_at?: string
          experience?: string | null
          id?: string
          image_url?: string | null
          languages?: string[] | null
          location: string
          name: string
          pet_types?: string[] | null
          rating?: number | null
          specialty: string
          updated_at?: string
        }
        Update: {
          approval_status?: string
          consultation_fee?: number
          created_at?: string
          experience?: string | null
          id?: string
          image_url?: string | null
          languages?: string[] | null
          location?: string
          name?: string
          pet_types?: string[] | null
          rating?: number | null
          specialty?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_admin_credentials: {
        Args: {
          admin_email: string
          admin_password: string
        }
        Returns: string
      }
      get_admin_role: {
        Args: {
          user_id: string
        }
        Returns: string
      }
      get_pending_events: {
        Args: Record<PropertyKey, never>
        Returns: {
          approval_status: string
          available_tickets: number | null
          created_at: string
          creator_id: string | null
          date: string
          description: string
          id: string
          image_url: string | null
          location: string
          price: number
          time: string
          title: string
          type: string
          updated_at: string
        }[]
      }
      get_pending_vets: {
        Args: Record<PropertyKey, never>
        Returns: {
          approval_status: string
          consultation_fee: number
          created_at: string
          experience: string | null
          id: string
          image_url: string | null
          languages: string[] | null
          location: string
          name: string
          pet_types: string[] | null
          rating: number | null
          specialty: string
          updated_at: string
        }[]
      }
      hash_admin_password: {
        Args: {
          password: string
        }
        Returns: string
      }
      hash_vet_password: {
        Args: {
          password: string
        }
        Returns: string
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      update_event_status: {
        Args: {
          event_id: string
          new_status: string
        }
        Returns: undefined
      }
      update_vet_status: {
        Args: {
          vet_id: string
          new_status: string
        }
        Returns: undefined
      }
      verify_admin_password: {
        Args: {
          email: string
          password: string
        }
        Returns: boolean
      }
      verify_vet_credentials: {
        Args: {
          email: string
          password: string
        }
        Returns: string
      }
    }
    Enums: {
      admin_role: "admin" | "superadmin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
