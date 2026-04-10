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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      certification_catalog: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_hadaf_reimbursed: boolean | null
          name: string
          sector: string | null
          weight: number
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_hadaf_reimbursed?: boolean | null
          name: string
          sector?: string | null
          weight?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_hadaf_reimbursed?: boolean | null
          name?: string
          sector?: string | null
          weight?: number
        }
        Relationships: []
      }
      ers_scores: {
        Row: {
          academic_score: number | null
          calculated_at: string
          certification_score: number | null
          conduct_score: number | null
          created_at: string
          decay_applied: number | null
          explanation: Json | null
          id: string
          interview_score: number | null
          national_readiness_bonus: number | null
          project_score: number | null
          recency_score: number | null
          soft_skills_score: number | null
          synergy_bonus: number | null
          total_score: number | null
          user_id: string
        }
        Insert: {
          academic_score?: number | null
          calculated_at?: string
          certification_score?: number | null
          conduct_score?: number | null
          created_at?: string
          decay_applied?: number | null
          explanation?: Json | null
          id?: string
          interview_score?: number | null
          national_readiness_bonus?: number | null
          project_score?: number | null
          recency_score?: number | null
          soft_skills_score?: number | null
          synergy_bonus?: number | null
          total_score?: number | null
          user_id: string
        }
        Update: {
          academic_score?: number | null
          calculated_at?: string
          certification_score?: number | null
          conduct_score?: number | null
          created_at?: string
          decay_applied?: number | null
          explanation?: Json | null
          id?: string
          interview_score?: number | null
          national_readiness_bonus?: number | null
          project_score?: number | null
          recency_score?: number | null
          soft_skills_score?: number | null
          synergy_bonus?: number | null
          total_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      hr_profiles: {
        Row: {
          company_name: string
          created_at: string
          id: string
          industry: string | null
          position: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name: string
          created_at?: string
          id?: string
          industry?: string | null
          position?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string
          created_at?: string
          id?: string
          industry?: string | null
          position?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      hr_shortlists: {
        Row: {
          created_at: string
          hr_user_id: string
          id: string
          notes: string | null
          student_user_id: string
        }
        Insert: {
          created_at?: string
          hr_user_id: string
          id?: string
          notes?: string | null
          student_user_id: string
        }
        Update: {
          created_at?: string
          hr_user_id?: string
          id?: string
          notes?: string | null
          student_user_id?: string
        }
        Relationships: []
      }
      job_cache: {
        Row: {
          company: string | null
          experience_level: string | null
          expires_at: string
          fetched_at: string
          id: string
          location: string | null
          raw_data: Json | null
          required_certifications: string[] | null
          required_skills: string[] | null
          sector: string | null
          source: string | null
          source_url: string | null
          title: string
        }
        Insert: {
          company?: string | null
          experience_level?: string | null
          expires_at?: string
          fetched_at?: string
          id?: string
          location?: string | null
          raw_data?: Json | null
          required_certifications?: string[] | null
          required_skills?: string[] | null
          sector?: string | null
          source?: string | null
          source_url?: string | null
          title: string
        }
        Update: {
          company?: string | null
          experience_level?: string | null
          expires_at?: string
          fetched_at?: string
          id?: string
          location?: string | null
          raw_data?: Json | null
          required_certifications?: string[] | null
          required_skills?: string[] | null
          sector?: string | null
          source?: string | null
          source_url?: string | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          nationality: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          nationality?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          nationality?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      skill_matrix: {
        Row: {
          created_at: string
          id: string
          last_updated: string
          proficiency_level: string | null
          skill_id: string | null
          skill_name: string
          source: string | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_updated?: string
          proficiency_level?: string | null
          skill_id?: string | null
          skill_name: string
          source?: string | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          id?: string
          last_updated?: string
          proficiency_level?: string | null
          skill_id?: string | null
          skill_name?: string
          source?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      student_certifications: {
        Row: {
          certification_id: string | null
          custom_name: string | null
          file_path: string | null
          id: string
          uploaded_at: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          certification_id?: string | null
          custom_name?: string | null
          file_path?: string | null
          id?: string
          uploaded_at?: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          certification_id?: string | null
          custom_name?: string | null
          file_path?: string | null
          id?: string
          uploaded_at?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "student_certifications_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certification_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          academic_score: number | null
          certification_score: number | null
          conduct_score: number | null
          created_at: string
          engagement_points: number | null
          ers_score: number | null
          gpa: number | null
          gpa_scale: Database["public"]["Enums"]["gpa_scale"]
          id: string
          major: string
          national_rank: number | null
          project_score: number | null
          soft_skills_score: number | null
          target_role: string | null
          university: string
          university_rank: number | null
          updated_at: string
          user_id: string
          visibility_public: boolean | null
        }
        Insert: {
          academic_score?: number | null
          certification_score?: number | null
          conduct_score?: number | null
          created_at?: string
          engagement_points?: number | null
          ers_score?: number | null
          gpa?: number | null
          gpa_scale?: Database["public"]["Enums"]["gpa_scale"]
          id?: string
          major: string
          national_rank?: number | null
          project_score?: number | null
          soft_skills_score?: number | null
          target_role?: string | null
          university: string
          university_rank?: number | null
          updated_at?: string
          user_id: string
          visibility_public?: boolean | null
        }
        Update: {
          academic_score?: number | null
          certification_score?: number | null
          conduct_score?: number | null
          created_at?: string
          engagement_points?: number | null
          ers_score?: number | null
          gpa?: number | null
          gpa_scale?: Database["public"]["Enums"]["gpa_scale"]
          id?: string
          major?: string
          national_rank?: number | null
          project_score?: number | null
          soft_skills_score?: number | null
          target_role?: string | null
          university?: string
          university_rank?: number | null
          updated_at?: string
          user_id?: string
          visibility_public?: boolean | null
        }
        Relationships: []
      }
      student_projects: {
        Row: {
          created_at: string
          description: string | null
          file_path: string | null
          id: string
          title: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path?: string | null
          id?: string
          title: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string | null
          id?: string
          title?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      transcript_uploads: {
        Row: {
          created_at: string
          file_path: string
          id: string
          parsed_at: string | null
          parsed_data: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          file_path: string
          id?: string
          parsed_at?: string | null
          parsed_data?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          file_path?: string
          id?: string
          parsed_at?: string | null
          parsed_data?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      university_profiles: {
        Row: {
          admin_contact: string | null
          created_at: string
          id: string
          official_domain: string | null
          university_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_contact?: string | null
          created_at?: string
          id?: string
          official_domain?: string | null
          university_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_contact?: string | null
          created_at?: string
          id?: string
          official_domain?: string | null
          university_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "hr" | "university" | "admin"
      gpa_scale: "4" | "5"
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
      app_role: ["student", "hr", "university", "admin"],
      gpa_scale: ["4", "5"],
    },
  },
} as const
