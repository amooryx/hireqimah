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
      activity_feed: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
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
      hr_candidate_pipeline: {
        Row: {
          created_at: string
          hr_user_id: string
          id: string
          job_title: string | null
          notes: string | null
          stage: string
          student_user_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hr_user_id: string
          id?: string
          job_title?: string | null
          notes?: string | null
          stage?: string
          student_user_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hr_user_id?: string
          id?: string
          job_title?: string | null
          notes?: string | null
          stage?: string
          student_user_id?: string
          updated_at?: string
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
      interview_requests: {
        Row: {
          created_at: string
          hr_user_id: string
          id: string
          job_description: string | null
          job_title: string | null
          status: string
          student_response: string | null
          student_user_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hr_user_id: string
          id?: string
          job_description?: string | null
          job_title?: string | null
          status?: string
          student_response?: string | null
          student_user_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hr_user_id?: string
          id?: string
          job_description?: string | null
          job_title?: string | null
          status?: string
          student_response?: string | null
          student_user_id?: string
          updated_at?: string
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
      job_market_data: {
        Row: {
          company: string | null
          description: string | null
          experience_level: string | null
          expires_at: string | null
          extracted_certifications: string[] | null
          extracted_skills: string[] | null
          id: string
          location: string | null
          scraped_at: string
          sector: string | null
          source: string | null
          source_url: string | null
          title: string
        }
        Insert: {
          company?: string | null
          description?: string | null
          experience_level?: string | null
          expires_at?: string | null
          extracted_certifications?: string[] | null
          extracted_skills?: string[] | null
          id?: string
          location?: string | null
          scraped_at?: string
          sector?: string | null
          source?: string | null
          source_url?: string | null
          title: string
        }
        Update: {
          company?: string | null
          description?: string | null
          experience_level?: string | null
          expires_at?: string | null
          extracted_certifications?: string[] | null
          extracted_skills?: string[] | null
          id?: string
          location?: string | null
          scraped_at?: string
          sector?: string | null
          source?: string | null
          source_url?: string | null
          title?: string
        }
        Relationships: []
      }
      job_postings: {
        Row: {
          company: string | null
          created_at: string
          description: string | null
          hr_user_id: string
          id: string
          is_active: boolean
          location: string | null
          min_ers_score: number | null
          required_skills: string[] | null
          sector: string | null
          title: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          description?: string | null
          hr_user_id: string
          id?: string
          is_active?: boolean
          location?: string | null
          min_ers_score?: number | null
          required_skills?: string[] | null
          sector?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          description?: string | null
          hr_user_id?: string
          id?: string
          is_active?: boolean
          location?: string | null
          min_ers_score?: number | null
          required_skills?: string[] | null
          sector?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      market_cert_demand: {
        Row: {
          cert_name: string
          demand_score: number | null
          id: string
          monthly_trend: number | null
          sector: string | null
          updated_at: string
          weekly_trend: number | null
        }
        Insert: {
          cert_name: string
          demand_score?: number | null
          id?: string
          monthly_trend?: number | null
          sector?: string | null
          updated_at?: string
          weekly_trend?: number | null
        }
        Update: {
          cert_name?: string
          demand_score?: number | null
          id?: string
          monthly_trend?: number | null
          sector?: string | null
          updated_at?: string
          weekly_trend?: number | null
        }
        Relationships: []
      }
      market_refresh_log: {
        Row: {
          completed_at: string | null
          id: string
          jobs_analyzed: number | null
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          jobs_analyzed?: number | null
          started_at?: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          jobs_analyzed?: number | null
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      market_role_demand: {
        Row: {
          demand_score: number | null
          id: string
          monthly_trend: number | null
          role_title: string
          sector: string | null
          updated_at: string
          weekly_trend: number | null
        }
        Insert: {
          demand_score?: number | null
          id?: string
          monthly_trend?: number | null
          role_title: string
          sector?: string | null
          updated_at?: string
          weekly_trend?: number | null
        }
        Update: {
          demand_score?: number | null
          id?: string
          monthly_trend?: number | null
          role_title?: string
          sector?: string | null
          updated_at?: string
          weekly_trend?: number | null
        }
        Relationships: []
      }
      market_skill_demand: {
        Row: {
          demand_score: number | null
          id: string
          monthly_trend: number | null
          sector: string | null
          skill_name: string
          updated_at: string
          weekly_trend: number | null
        }
        Insert: {
          demand_score?: number | null
          id?: string
          monthly_trend?: number | null
          sector?: string | null
          skill_name: string
          updated_at?: string
          weekly_trend?: number | null
        }
        Update: {
          demand_score?: number | null
          id?: string
          monthly_trend?: number | null
          sector?: string | null
          skill_name?: string
          updated_at?: string
          weekly_trend?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
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
      student_badges: {
        Row: {
          badge_icon: string | null
          badge_label: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_icon?: string | null
          badge_label: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_icon?: string | null
          badge_label?: string
          earned_at?: string
          id?: string
          user_id?: string
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
      leaderboard_ranked: {
        Row: {
          avatar_url: string | null
          ers_score: number | null
          full_name: string | null
          gpa: number | null
          gpa_scale: Database["public"]["Enums"]["gpa_scale"] | null
          major: string | null
          major_rank: number | null
          national_rank: number | null
          region: string | null
          university: string | null
          university_rank: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_dynamic_ers: { Args: { _user_id: string }; Returns: number }
      calculate_job_fit: {
        Args: {
          _min_ers?: number
          _required_certifications: string[]
          _required_skills: string[]
          _student_user_id: string
        }
        Returns: Json
      }
      get_market_cert_rankings: {
        Args: { _days?: number; _limit?: number }
        Returns: {
          cert_name: string
          frequency: number
          percentage: number
        }[]
      }
      get_market_skill_rankings: {
        Args: { _days?: number; _limit?: number }
        Returns: {
          frequency: number
          percentage: number
          skill_name: string
        }[]
      }
      get_student_skill_gaps: {
        Args: { _limit?: number; _user_id: string }
        Returns: {
          is_missing: boolean
          market_frequency: number
          market_percentage: number
          skill_name: string
        }[]
      }
      get_university_region: { Args: { _university: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      refresh_leaderboard: { Args: never; Returns: undefined }
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
