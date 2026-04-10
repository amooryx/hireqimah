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
      activity_feed: {
        Row: {
          activity_type: string
          created_at: string
          detail: string | null
          id: string
          title: string
          university: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          detail?: string | null
          id?: string
          title: string
          university?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          detail?: string | null
          id?: string
          title?: string
          university?: string | null
          user_id?: string
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
          decay_rate_annual: number | null
          description: string | null
          id: string
          is_hadaf_reimbursed: boolean | null
          is_volatile: boolean | null
          name: string
          sector: string | null
          weight: number
        }
        Insert: {
          category: string
          created_at?: string
          decay_rate_annual?: number | null
          description?: string | null
          id?: string
          is_hadaf_reimbursed?: boolean | null
          is_volatile?: boolean | null
          name: string
          sector?: string | null
          weight?: number
        }
        Update: {
          category?: string
          created_at?: string
          decay_rate_annual?: number | null
          description?: string | null
          id?: string
          is_hadaf_reimbursed?: boolean | null
          is_volatile?: boolean | null
          name?: string
          sector?: string | null
          weight?: number
        }
        Relationships: []
      }
      demand_history: {
        Row: {
          created_at: string
          demand_score: number
          id: string
          item_name: string
          item_type: string
          mention_count: number
          snapshot_date: string
        }
        Insert: {
          created_at?: string
          demand_score?: number
          id?: string
          item_name: string
          item_type: string
          mention_count?: number
          snapshot_date?: string
        }
        Update: {
          created_at?: string
          demand_score?: number
          id?: string
          item_name?: string
          item_type?: string
          mention_count?: number
          snapshot_date?: string
        }
        Relationships: []
      }
      document_integrity: {
        Row: {
          author: string | null
          created_at: string
          creation_date: string | null
          enrollment_date: string | null
          file_path: string
          file_type: string | null
          flag: string | null
          flag_reason: string | null
          id: string
          modification_date: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          sha256_hash: string
          user_id: string
        }
        Insert: {
          author?: string | null
          created_at?: string
          creation_date?: string | null
          enrollment_date?: string | null
          file_path: string
          file_type?: string | null
          flag?: string | null
          flag_reason?: string | null
          id?: string
          modification_date?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sha256_hash: string
          user_id: string
        }
        Update: {
          author?: string | null
          created_at?: string
          creation_date?: string | null
          enrollment_date?: string | null
          file_path?: string
          file_type?: string | null
          flag?: string | null
          flag_reason?: string | null
          id?: string
          modification_date?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sha256_hash?: string
          user_id?: string
        }
        Relationships: []
      }
      endorsements: {
        Row: {
          created_at: string
          endorser_role: string
          endorser_user_id: string
          id: string
          message: string | null
          skill_name: string
          student_user_id: string
        }
        Insert: {
          created_at?: string
          endorser_role: string
          endorser_user_id: string
          id?: string
          message?: string | null
          skill_name: string
          student_user_id: string
        }
        Update: {
          created_at?: string
          endorser_role?: string
          endorser_user_id?: string
          id?: string
          message?: string | null
          skill_name?: string
          student_user_id?: string
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
      global_benchmarks: {
        Row: {
          benchmark_score: number
          created_at: string
          id: string
          percentile_data: Json | null
          region: string | null
          role_title: string
          sector: string
          source: string | null
          updated_at: string
        }
        Insert: {
          benchmark_score: number
          created_at?: string
          id?: string
          percentile_data?: Json | null
          region?: string | null
          role_title: string
          sector: string
          source?: string | null
          updated_at?: string
        }
        Update: {
          benchmark_score?: number
          created_at?: string
          id?: string
          percentile_data?: Json | null
          region?: string | null
          role_title?: string
          sector?: string
          source?: string | null
          updated_at?: string
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
      job_analysis_results: {
        Row: {
          analyzed_at: string
          confidence_score: number | null
          detected_role: string | null
          experience_level: string | null
          extracted_certifications: string[] | null
          extracted_skills: string[] | null
          extracted_soft_skills: string[] | null
          id: string
          job_cache_id: string | null
          raw_analysis: Json | null
          salary_range: string | null
        }
        Insert: {
          analyzed_at?: string
          confidence_score?: number | null
          detected_role?: string | null
          experience_level?: string | null
          extracted_certifications?: string[] | null
          extracted_skills?: string[] | null
          extracted_soft_skills?: string[] | null
          id?: string
          job_cache_id?: string | null
          raw_analysis?: Json | null
          salary_range?: string | null
        }
        Update: {
          analyzed_at?: string
          confidence_score?: number | null
          detected_role?: string | null
          experience_level?: string | null
          extracted_certifications?: string[] | null
          extracted_skills?: string[] | null
          extracted_soft_skills?: string[] | null
          id?: string
          job_cache_id?: string | null
          raw_analysis?: Json | null
          salary_range?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_analysis_results_job_cache_id_fkey"
            columns: ["job_cache_id"]
            isOneToOne: false
            referencedRelation: "job_cache"
            referencedColumns: ["id"]
          },
        ]
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
      job_postings: {
        Row: {
          company: string | null
          created_at: string
          description: string | null
          experience_level: string | null
          expires_at: string | null
          hr_user_id: string
          id: string
          is_active: boolean
          location: string | null
          min_ers_score: number | null
          required_certifications: string[] | null
          required_skills: string[] | null
          sector: string | null
          title: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          description?: string | null
          experience_level?: string | null
          expires_at?: string | null
          hr_user_id: string
          id?: string
          is_active?: boolean
          location?: string | null
          min_ers_score?: number | null
          required_certifications?: string[] | null
          required_skills?: string[] | null
          sector?: string | null
          title: string
        }
        Update: {
          company?: string | null
          created_at?: string
          description?: string | null
          experience_level?: string | null
          expires_at?: string | null
          hr_user_id?: string
          id?: string
          is_active?: boolean
          location?: string | null
          min_ers_score?: number | null
          required_certifications?: string[] | null
          required_skills?: string[] | null
          sector?: string | null
          title?: string
        }
        Relationships: []
      }
      login_attempts: {
        Row: {
          attempted_at: string
          email: string
          id: string
          ip_address: string | null
          success: boolean
        }
        Insert: {
          attempted_at?: string
          email: string
          id?: string
          ip_address?: string | null
          success?: boolean
        }
        Update: {
          attempted_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          success?: boolean
        }
        Relationships: []
      }
      majors_repository: {
        Row: {
          created_at: string
          department: string | null
          id: string
          name: string
          name_ar: string | null
          sector: string
          skill_domain: string | null
          university_id: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          id?: string
          name: string
          name_ar?: string | null
          sector: string
          skill_domain?: string | null
          university_id?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          id?: string
          name?: string
          name_ar?: string | null
          sector?: string
          skill_domain?: string | null
          university_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "majors_repository_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      market_cert_demand: {
        Row: {
          catalog_id: string | null
          cert_name: string
          company_diversity: number
          created_at: string
          demand_score: number
          difficulty_level: string | null
          ers_points: number
          id: string
          last_calculated_at: string
          mention_count: number
          monthly_change: number | null
          normalized_name: string
          recent_postings: number
          sector: string | null
          trend: string | null
          weekly_change: number | null
        }
        Insert: {
          catalog_id?: string | null
          cert_name: string
          company_diversity?: number
          created_at?: string
          demand_score?: number
          difficulty_level?: string | null
          ers_points?: number
          id?: string
          last_calculated_at?: string
          mention_count?: number
          monthly_change?: number | null
          normalized_name: string
          recent_postings?: number
          sector?: string | null
          trend?: string | null
          weekly_change?: number | null
        }
        Update: {
          catalog_id?: string | null
          cert_name?: string
          company_diversity?: number
          created_at?: string
          demand_score?: number
          difficulty_level?: string | null
          ers_points?: number
          id?: string
          last_calculated_at?: string
          mention_count?: number
          monthly_change?: number | null
          normalized_name?: string
          recent_postings?: number
          sector?: string | null
          trend?: string | null
          weekly_change?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "market_cert_demand_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "certification_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      market_refresh_log: {
        Row: {
          certs_updated: number | null
          completed_at: string | null
          error_message: string | null
          id: string
          jobs_analyzed: number | null
          roles_updated: number | null
          skills_updated: number | null
          started_at: string
          status: string | null
          triggered_by: string | null
        }
        Insert: {
          certs_updated?: number | null
          completed_at?: string | null
          error_message?: string | null
          id?: string
          jobs_analyzed?: number | null
          roles_updated?: number | null
          skills_updated?: number | null
          started_at?: string
          status?: string | null
          triggered_by?: string | null
        }
        Update: {
          certs_updated?: number | null
          completed_at?: string | null
          error_message?: string | null
          id?: string
          jobs_analyzed?: number | null
          roles_updated?: number | null
          skills_updated?: number | null
          started_at?: string
          status?: string | null
          triggered_by?: string | null
        }
        Relationships: []
      }
      market_role_demand: {
        Row: {
          company_diversity: number
          created_at: string
          demand_score: number
          id: string
          job_count: number
          last_calculated_at: string
          market_stability: string | null
          match_companies: string[] | null
          monthly_change: number | null
          role_category: string
          role_name: string
          salary_range: string | null
          top_certifications: string[] | null
          top_required_skills: string[] | null
          weekly_change: number | null
        }
        Insert: {
          company_diversity?: number
          created_at?: string
          demand_score?: number
          id?: string
          job_count?: number
          last_calculated_at?: string
          market_stability?: string | null
          match_companies?: string[] | null
          monthly_change?: number | null
          role_category?: string
          role_name: string
          salary_range?: string | null
          top_certifications?: string[] | null
          top_required_skills?: string[] | null
          weekly_change?: number | null
        }
        Update: {
          company_diversity?: number
          created_at?: string
          demand_score?: number
          id?: string
          job_count?: number
          last_calculated_at?: string
          market_stability?: string | null
          match_companies?: string[] | null
          monthly_change?: number | null
          role_category?: string
          role_name?: string
          salary_range?: string | null
          top_certifications?: string[] | null
          top_required_skills?: string[] | null
          weekly_change?: number | null
        }
        Relationships: []
      }
      market_role_taxonomy: {
        Row: {
          aliases: string[] | null
          created_at: string
          id: string
          role_category: string
          role_name: string
          updated_at: string
        }
        Insert: {
          aliases?: string[] | null
          created_at?: string
          id?: string
          role_category?: string
          role_name: string
          updated_at?: string
        }
        Update: {
          aliases?: string[] | null
          created_at?: string
          id?: string
          role_category?: string
          role_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      market_skill_demand: {
        Row: {
          company_diversity: number
          created_at: string
          demand_score: number
          id: string
          last_calculated_at: string
          mention_count: number
          monthly_change: number | null
          normalized_name: string
          recent_postings: number
          sector: string | null
          skill_name: string
          trend: string | null
          weekly_change: number | null
        }
        Insert: {
          company_diversity?: number
          created_at?: string
          demand_score?: number
          id?: string
          last_calculated_at?: string
          mention_count?: number
          monthly_change?: number | null
          normalized_name: string
          recent_postings?: number
          sector?: string | null
          skill_name: string
          trend?: string | null
          weekly_change?: number | null
        }
        Update: {
          company_diversity?: number
          created_at?: string
          demand_score?: number
          id?: string
          last_calculated_at?: string
          mention_count?: number
          monthly_change?: number | null
          normalized_name?: string
          recent_postings?: number
          sector?: string | null
          skill_name?: string
          trend?: string | null
          weekly_change?: number | null
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
          employment_status: string | null
          external_verification_token: string | null
          full_name: string
          graduation_status: string | null
          id: string
          national_id_encrypted: string | null
          nationality: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          employment_status?: string | null
          external_verification_token?: string | null
          full_name: string
          graduation_status?: string | null
          id?: string
          national_id_encrypted?: string | null
          nationality?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          employment_status?: string | null
          external_verification_token?: string | null
          full_name?: string
          graduation_status?: string | null
          id?: string
          national_id_encrypted?: string | null
          nationality?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referred_email: string
          referred_user_id: string | null
          referrer_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          referred_email: string
          referred_user_id?: string | null
          referrer_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          referred_email?: string
          referred_user_id?: string | null
          referrer_id?: string
          status?: string
        }
        Relationships: []
      }
      skill_cert_mapping: {
        Row: {
          cert_name: string
          created_at: string
          id: string
          relevance_score: number
          skill_name: string
        }
        Insert: {
          cert_name: string
          created_at?: string
          id?: string
          relevance_score?: number
          skill_name: string
        }
        Update: {
          cert_name?: string
          created_at?: string
          id?: string
          relevance_score?: number
          skill_name?: string
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
        Relationships: [
          {
            foreignKeyName: "skill_matrix_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skill_ontology"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_ontology: {
        Row: {
          context_description: string | null
          created_at: string
          id: string
          is_volatile: boolean | null
          parent_skill_id: string | null
          sector: string | null
          skill_category: string
          skill_name: string
          weight: number | null
        }
        Insert: {
          context_description?: string | null
          created_at?: string
          id?: string
          is_volatile?: boolean | null
          parent_skill_id?: string | null
          sector?: string | null
          skill_category: string
          skill_name: string
          weight?: number | null
        }
        Update: {
          context_description?: string | null
          created_at?: string
          id?: string
          is_volatile?: boolean | null
          parent_skill_id?: string | null
          sector?: string | null
          skill_category?: string
          skill_name?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "skill_ontology_parent_skill_id_fkey"
            columns: ["parent_skill_id"]
            isOneToOne: false
            referencedRelation: "skill_ontology"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_synonyms: {
        Row: {
          canonical_name: string
          created_at: string
          id: string
          synonym: string
        }
        Insert: {
          canonical_name: string
          created_at?: string
          id?: string
          synonym: string
        }
        Update: {
          canonical_name?: string
          created_at?: string
          id?: string
          synonym?: string
        }
        Relationships: []
      }
      soft_skill_assessments: {
        Row: {
          assessed_at: string
          assessment_type: string | null
          evidence: Json | null
          id: string
          score: number | null
          skill_id: string | null
          skill_name: string
          user_id: string
        }
        Insert: {
          assessed_at?: string
          assessment_type?: string | null
          evidence?: Json | null
          id?: string
          score?: number | null
          skill_id?: string | null
          skill_name: string
          user_id: string
        }
        Update: {
          assessed_at?: string
          assessment_type?: string | null
          evidence?: Json | null
          id?: string
          score?: number | null
          skill_id?: string | null
          skill_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "soft_skill_assessments_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skill_ontology"
            referencedColumns: ["id"]
          },
        ]
      }
      student_badges: {
        Row: {
          badge_icon: string | null
          badge_key: string
          badge_label: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_icon?: string | null
          badge_key: string
          badge_label: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_icon?: string | null
          badge_key?: string
          badge_label?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      student_certifications: {
        Row: {
          certificate_id: string | null
          certification_id: string | null
          custom_name: string | null
          file_path: string | null
          id: string
          issued_date: string | null
          issuer: string | null
          uploaded_at: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          certificate_id?: string | null
          certification_id?: string | null
          custom_name?: string | null
          file_path?: string | null
          id?: string
          issued_date?: string | null
          issuer?: string | null
          uploaded_at?: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          certificate_id?: string | null
          certification_id?: string | null
          custom_name?: string | null
          file_path?: string | null
          id?: string
          issued_date?: string | null
          issuer?: string | null
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
          career_target: string | null
          certification_score: number | null
          conduct_score: number | null
          created_at: string
          engagement_points: number | null
          ers_score: number | null
          github_url: string | null
          gpa: number | null
          gpa_scale: Database["public"]["Enums"]["gpa_scale"]
          id: string
          linkedin_url: string | null
          major: string
          national_rank: number | null
          onboarding_completed: boolean | null
          onboarding_progress: number | null
          portfolio_url: string | null
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
          career_target?: string | null
          certification_score?: number | null
          conduct_score?: number | null
          created_at?: string
          engagement_points?: number | null
          ers_score?: number | null
          github_url?: string | null
          gpa?: number | null
          gpa_scale?: Database["public"]["Enums"]["gpa_scale"]
          id?: string
          linkedin_url?: string | null
          major: string
          national_rank?: number | null
          onboarding_completed?: boolean | null
          onboarding_progress?: number | null
          portfolio_url?: string | null
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
          career_target?: string | null
          certification_score?: number | null
          conduct_score?: number | null
          created_at?: string
          engagement_points?: number | null
          ers_score?: number | null
          github_url?: string | null
          gpa?: number | null
          gpa_scale?: Database["public"]["Enums"]["gpa_scale"]
          id?: string
          linkedin_url?: string | null
          major?: string
          national_rank?: number | null
          onboarding_completed?: boolean | null
          onboarding_progress?: number | null
          portfolio_url?: string | null
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
      synergy_mappings: {
        Row: {
          bonus_percentage: number | null
          created_at: string
          description: string | null
          id: string
          sector_a: string
          sector_b: string
        }
        Insert: {
          bonus_percentage?: number | null
          created_at?: string
          description?: string | null
          id?: string
          sector_a: string
          sector_b: string
        }
        Update: {
          bonus_percentage?: number | null
          created_at?: string
          description?: string | null
          id?: string
          sector_a?: string
          sector_b?: string
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
      universities: {
        Row: {
          created_at: string
          domain: string | null
          id: string
          name: string
          region: string | null
          short_code: string | null
          type: string | null
        }
        Insert: {
          created_at?: string
          domain?: string | null
          id?: string
          name: string
          region?: string | null
          short_code?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string
          domain?: string | null
          id?: string
          name?: string
          region?: string | null
          short_code?: string | null
          type?: string | null
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
      verification_requests: {
        Row: {
          created_at: string
          id: string
          resource_id: string
          resource_type: string
          reviewed_at: string | null
          reviewer_id: string | null
          reviewer_notes: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          resource_id: string
          resource_type: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          reviewer_notes?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          resource_id?: string
          resource_type?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          reviewer_notes?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_account_locked: { Args: { p_email: string }; Returns: Json }
      cleanup_old_login_attempts: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      recalculate_ers: { Args: { p_user_id: string }; Returns: undefined }
      record_login_attempt: {
        Args: { p_email: string; p_ip?: string; p_success: boolean }
        Returns: undefined
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
