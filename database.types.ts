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
      choices: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          room_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          room_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "choices_roomId_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      results: {
        Row: {
          choice_id: string
          points: number
          room_id: string
        }
        Insert: {
          choice_id: string
          points: number
          room_id: string
        }
        Update: {
          choice_id?: string
          points?: number
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "results_choice_id_fkey"
            columns: ["choice_id"]
            isOneToOne: false
            referencedRelation: "choices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_users: {
        Row: {
          has_voted: boolean
          room_id: string
          user_id: string
        }
        Insert: {
          has_voted?: boolean
          room_id: string
          user_id: string
        }
        Update: {
          has_voted?: boolean
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_users_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          created_at: string
          description: string
          headline: string
          id: string
          name: string
          slug: string
          status: Database["public"]["Enums"]["room_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          headline: string
          id?: string
          name: string
          slug: string
          status?: Database["public"]["Enums"]["room_status"]
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          headline?: string
          id?: string
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["room_status"]
          user_id?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          choice_id: string
          created_at: string
          rank: number
          room_id: string
          user_id: string
        }
        Insert: {
          choice_id: string
          created_at?: string
          rank: number
          room_id: string
          user_id: string
        }
        Update: {
          choice_id?: string
          created_at?: string
          rank?: number
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_choice_id_fkey"
            columns: ["choice_id"]
            isOneToOne: false
            referencedRelation: "choices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      slugify: {
        Args: {
          value: string
        }
        Returns: string
      }
      unaccent: {
        Args: {
          "": string
        }
        Returns: string
      }
      unaccent_init: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
    }
    Enums: {
      room_status: "private" | "open" | "results"
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
