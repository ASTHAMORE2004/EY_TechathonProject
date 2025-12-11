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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          agent_type: string | null
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          agent_type?: string | null
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          agent_type?: string | null
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          context: Json | null
          created_at: string | null
          customer_id: string | null
          id: string
          loan_application_id: string | null
          stage: Database["public"]["Enums"]["conversation_stage"] | null
          updated_at: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          loan_application_id?: string | null
          stage?: Database["public"]["Enums"]["conversation_stage"] | null
          updated_at?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          loan_application_id?: string | null
          stage?: Database["public"]["Enums"]["conversation_stage"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          aadhaar_document_url: string | null
          aadhaar_number: string | null
          created_at: string | null
          credit_score: number | null
          credit_score_1000: number | null
          email: string | null
          employment_type: string | null
          full_name: string
          id: string
          income_document_url: string | null
          kyc_verified: boolean | null
          monthly_income: number | null
          pan_document_url: string | null
          pan_number: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          aadhaar_document_url?: string | null
          aadhaar_number?: string | null
          created_at?: string | null
          credit_score?: number | null
          credit_score_1000?: number | null
          email?: string | null
          employment_type?: string | null
          full_name: string
          id?: string
          income_document_url?: string | null
          kyc_verified?: boolean | null
          monthly_income?: number | null
          pan_document_url?: string | null
          pan_number?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          aadhaar_document_url?: string | null
          aadhaar_number?: string | null
          created_at?: string | null
          credit_score?: number | null
          credit_score_1000?: number | null
          email?: string | null
          employment_type?: string | null
          full_name?: string
          id?: string
          income_document_url?: string | null
          kyc_verified?: boolean | null
          monthly_income?: number | null
          pan_document_url?: string | null
          pan_number?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      investment_recommendations: {
        Row: {
          accepted: boolean | null
          cashback_amount: number | null
          created_at: string | null
          customer_id: string | null
          id: string
          loan_application_id: string | null
          monthly_savings_goal: number | null
          recommended_fund: string | null
          round_up_amount: number | null
        }
        Insert: {
          accepted?: boolean | null
          cashback_amount?: number | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          loan_application_id?: string | null
          monthly_savings_goal?: number | null
          recommended_fund?: string | null
          round_up_amount?: number | null
        }
        Update: {
          accepted?: boolean | null
          cashback_amount?: number | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          loan_application_id?: string | null
          monthly_savings_goal?: number | null
          recommended_fund?: string | null
          round_up_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "investment_recommendations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_recommendations_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_applications: {
        Row: {
          created_at: string | null
          customer_id: string | null
          emi_amount: number | null
          id: string
          interest_rate: number | null
          loan_amount: number
          purpose: string | null
          sanction_letter_url: string | null
          status: Database["public"]["Enums"]["loan_status"] | null
          tenure_months: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          emi_amount?: number | null
          id?: string
          interest_rate?: number | null
          loan_amount: number
          purpose?: string | null
          sanction_letter_url?: string | null
          status?: Database["public"]["Enums"]["loan_status"] | null
          tenure_months: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          emi_amount?: number | null
          id?: string
          interest_rate?: number | null
          loan_amount?: number
          purpose?: string | null
          sanction_letter_url?: string | null
          status?: Database["public"]["Enums"]["loan_status"] | null
          tenure_months?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_applications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      conversation_stage:
        | "greeting"
        | "needs_assessment"
        | "verification"
        | "credit_check"
        | "offer"
        | "investment_nudge"
        | "sanction"
        | "completed"
      loan_status:
        | "pending"
        | "in_progress"
        | "approved"
        | "rejected"
        | "sanctioned"
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
    Enums: {
      conversation_stage: [
        "greeting",
        "needs_assessment",
        "verification",
        "credit_check",
        "offer",
        "investment_nudge",
        "sanction",
        "completed",
      ],
      loan_status: [
        "pending",
        "in_progress",
        "approved",
        "rejected",
        "sanctioned",
      ],
    },
  },
} as const
