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
      business_activity_analysis: {
        Row: {
          business_model: string | null
          corporate_verification_id: string | null
          created_at: string
          credit_score: number | null
          financial_status: string | null
          id: string
          industry_sector: string | null
          is_restricted_activity: boolean | null
          licenses_required: string[] | null
          licenses_verified: Json | null
          restricted_activity_details: string | null
        }
        Insert: {
          business_model?: string | null
          corporate_verification_id?: string | null
          created_at?: string
          credit_score?: number | null
          financial_status?: string | null
          id?: string
          industry_sector?: string | null
          is_restricted_activity?: boolean | null
          licenses_required?: string[] | null
          licenses_verified?: Json | null
          restricted_activity_details?: string | null
        }
        Update: {
          business_model?: string | null
          corporate_verification_id?: string | null
          created_at?: string
          credit_score?: number | null
          financial_status?: string | null
          id?: string
          industry_sector?: string | null
          is_restricted_activity?: boolean | null
          licenses_required?: string[] | null
          licenses_verified?: Json | null
          restricted_activity_details?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_activity_analysis_corporate_verification_id_fkey"
            columns: ["corporate_verification_id"]
            isOneToOne: false
            referencedRelation: "corporate_verifications"
            referencedColumns: ["id"]
          },
        ]
      }
      continuous_monitoring: {
        Row: {
          alert_details: Json | null
          alert_level: string | null
          alert_message: string | null
          corporate_verification_id: string | null
          created_at: string
          id: string
          is_resolved: boolean | null
          monitoring_type: string
          next_review_date: string | null
        }
        Insert: {
          alert_details?: Json | null
          alert_level?: string | null
          alert_message?: string | null
          corporate_verification_id?: string | null
          created_at?: string
          id?: string
          is_resolved?: boolean | null
          monitoring_type: string
          next_review_date?: string | null
        }
        Update: {
          alert_details?: Json | null
          alert_level?: string | null
          alert_message?: string | null
          corporate_verification_id?: string | null
          created_at?: string
          id?: string
          is_resolved?: boolean | null
          monitoring_type?: string
          next_review_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "continuous_monitoring_corporate_verification_id_fkey"
            columns: ["corporate_verification_id"]
            isOneToOne: false
            referencedRelation: "corporate_verifications"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_registry_info: {
        Row: {
          business_activity: string | null
          corporate_verification_id: string | null
          created_at: string
          id: string
          legal_form: string | null
          legal_status: string | null
          registered_address: string | null
          registration_date: string | null
          registration_number: string | null
          share_capital: number | null
          verification_status: string | null
        }
        Insert: {
          business_activity?: string | null
          corporate_verification_id?: string | null
          created_at?: string
          id?: string
          legal_form?: string | null
          legal_status?: string | null
          registered_address?: string | null
          registration_date?: string | null
          registration_number?: string | null
          share_capital?: number | null
          verification_status?: string | null
        }
        Update: {
          business_activity?: string | null
          corporate_verification_id?: string | null
          created_at?: string
          id?: string
          legal_form?: string | null
          legal_status?: string | null
          registered_address?: string | null
          registration_date?: string | null
          registration_number?: string | null
          share_capital?: number | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "corporate_registry_info_corporate_verification_id_fkey"
            columns: ["corporate_verification_id"]
            isOneToOne: false
            referencedRelation: "corporate_verifications"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_structure: {
        Row: {
          appointment_date: string | null
          corporate_verification_id: string | null
          created_at: string
          id: string
          identification_number: string | null
          is_pep: boolean | null
          nationality: string | null
          ownership_percentage: number | null
          pep_details: Json | null
          person_name: string
          person_type: string
          position: string | null
          sanctions_check_result: Json | null
        }
        Insert: {
          appointment_date?: string | null
          corporate_verification_id?: string | null
          created_at?: string
          id?: string
          identification_number?: string | null
          is_pep?: boolean | null
          nationality?: string | null
          ownership_percentage?: number | null
          pep_details?: Json | null
          person_name: string
          person_type: string
          position?: string | null
          sanctions_check_result?: Json | null
        }
        Update: {
          appointment_date?: string | null
          corporate_verification_id?: string | null
          created_at?: string
          id?: string
          identification_number?: string | null
          is_pep?: boolean | null
          nationality?: string | null
          ownership_percentage?: number | null
          pep_details?: Json | null
          person_name?: string
          person_type?: string
          position?: string | null
          sanctions_check_result?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "corporate_structure_corporate_verification_id_fkey"
            columns: ["corporate_verification_id"]
            isOneToOne: false
            referencedRelation: "corporate_verifications"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_verifications: {
        Row: {
          company_name: string
          country: string
          created_at: string
          id: string
          overall_risk_score: number | null
          status: string
          tax_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name: string
          country: string
          created_at?: string
          id?: string
          overall_risk_score?: number | null
          status?: string
          tax_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string
          country?: string
          created_at?: string
          id?: string
          overall_risk_score?: number | null
          status?: string
          tax_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_verifications: {
        Row: {
          created_at: string
          domain: string | null
          email: string
          id: string
          is_deliverable: boolean | null
          is_disposable: boolean | null
          mx_records: boolean | null
          smtp_check: boolean | null
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          domain?: string | null
          email: string
          id?: string
          is_deliverable?: boolean | null
          is_disposable?: boolean | null
          mx_records?: boolean | null
          smtp_check?: boolean | null
          status: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          domain?: string | null
          email?: string
          id?: string
          is_deliverable?: boolean | null
          is_disposable?: boolean | null
          mx_records?: boolean | null
          smtp_check?: boolean | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      geographic_risk_analysis: {
        Row: {
          address_verification_details: Json | null
          address_verification_status: string | null
          corporate_verification_id: string | null
          country_code: string
          country_risk_score: number | null
          created_at: string
          id: string
          jurisdiction_type: string | null
          regulatory_compliance: Json | null
        }
        Insert: {
          address_verification_details?: Json | null
          address_verification_status?: string | null
          corporate_verification_id?: string | null
          country_code: string
          country_risk_score?: number | null
          created_at?: string
          id?: string
          jurisdiction_type?: string | null
          regulatory_compliance?: Json | null
        }
        Update: {
          address_verification_details?: Json | null
          address_verification_status?: string | null
          corporate_verification_id?: string | null
          country_code?: string
          country_risk_score?: number | null
          created_at?: string
          id?: string
          jurisdiction_type?: string | null
          regulatory_compliance?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "geographic_risk_analysis_corporate_verification_id_fkey"
            columns: ["corporate_verification_id"]
            isOneToOne: false
            referencedRelation: "corporate_verifications"
            referencedColumns: ["id"]
          },
        ]
      }
      pep_sanctions_checks: {
        Row: {
          check_result: string
          check_type: string
          corporate_verification_id: string | null
          created_at: string
          details: Json | null
          id: string
          last_checked: string | null
          person_id: string | null
          risk_level: string | null
          sources_checked: string[] | null
        }
        Insert: {
          check_result: string
          check_type: string
          corporate_verification_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          last_checked?: string | null
          person_id?: string | null
          risk_level?: string | null
          sources_checked?: string[] | null
        }
        Update: {
          check_result?: string
          check_type?: string
          corporate_verification_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          last_checked?: string | null
          person_id?: string | null
          risk_level?: string | null
          sources_checked?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "pep_sanctions_checks_corporate_verification_id_fkey"
            columns: ["corporate_verification_id"]
            isOneToOne: false
            referencedRelation: "corporate_verifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pep_sanctions_checks_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "corporate_structure"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_verifications: {
        Row: {
          carrier: string | null
          country: string | null
          created_at: string
          id: string
          is_active: boolean | null
          line_type: string | null
          phone_number: string
          status: string
          user_id: string | null
        }
        Insert: {
          carrier?: string | null
          country?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          line_type?: string | null
          phone_number: string
          status: string
          user_id?: string | null
        }
        Update: {
          carrier?: string | null
          country?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          line_type?: string | null
          phone_number?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      regulatory_reports: {
        Row: {
          corporate_verification_id: string | null
          generated_at: string | null
          id: string
          regulatory_authority: string | null
          report_data: Json
          report_status: string | null
          report_type: string
          submission_date: string | null
        }
        Insert: {
          corporate_verification_id?: string | null
          generated_at?: string | null
          id?: string
          regulatory_authority?: string | null
          report_data?: Json
          report_status?: string | null
          report_type: string
          submission_date?: string | null
        }
        Update: {
          corporate_verification_id?: string | null
          generated_at?: string | null
          id?: string
          regulatory_authority?: string | null
          report_data?: Json
          report_status?: string | null
          report_type?: string
          submission_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "regulatory_reports_corporate_verification_id_fkey"
            columns: ["corporate_verification_id"]
            isOneToOne: false
            referencedRelation: "corporate_verifications"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_scoring: {
        Row: {
          category: string
          corporate_verification_id: string | null
          created_at: string
          decision_matrix: string | null
          decision_reason: string | null
          factors: Json | null
          id: string
          score: number
          weight: number | null
        }
        Insert: {
          category: string
          corporate_verification_id?: string | null
          created_at?: string
          decision_matrix?: string | null
          decision_reason?: string | null
          factors?: Json | null
          id?: string
          score?: number
          weight?: number | null
        }
        Update: {
          category?: string
          corporate_verification_id?: string | null
          created_at?: string
          decision_matrix?: string | null
          decision_reason?: string | null
          factors?: Json | null
          id?: string
          score?: number
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "risk_scoring_corporate_verification_id_fkey"
            columns: ["corporate_verification_id"]
            isOneToOne: false
            referencedRelation: "corporate_verifications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          daily_verification_limit: number | null
          email_api_provider: string | null
          id: string
          phone_api_provider: string | null
          updated_at: string
          user_id: string | null
          website_api_provider: string | null
        }
        Insert: {
          created_at?: string
          daily_verification_limit?: number | null
          email_api_provider?: string | null
          id?: string
          phone_api_provider?: string | null
          updated_at?: string
          user_id?: string | null
          website_api_provider?: string | null
        }
        Update: {
          created_at?: string
          daily_verification_limit?: number | null
          email_api_provider?: string | null
          id?: string
          phone_api_provider?: string | null
          updated_at?: string
          user_id?: string | null
          website_api_provider?: string | null
        }
        Relationships: []
      }
      website_relationships: {
        Row: {
          analysis_details: Json | null
          created_at: string
          id: string
          primary_site_id: string | null
          related_site_id: string | null
          relationship_type: string
          similarity_score: number | null
        }
        Insert: {
          analysis_details?: Json | null
          created_at?: string
          id?: string
          primary_site_id?: string | null
          related_site_id?: string | null
          relationship_type: string
          similarity_score?: number | null
        }
        Update: {
          analysis_details?: Json | null
          created_at?: string
          id?: string
          primary_site_id?: string | null
          related_site_id?: string | null
          relationship_type?: string
          similarity_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "website_relationships_primary_site_id_fkey"
            columns: ["primary_site_id"]
            isOneToOne: false
            referencedRelation: "website_verifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "website_relationships_related_site_id_fkey"
            columns: ["related_site_id"]
            isOneToOne: false
            referencedRelation: "website_verifications"
            referencedColumns: ["id"]
          },
        ]
      }
      website_verifications: {
        Row: {
          category: string | null
          content_fingerprint: string | null
          content_score: number | null
          created_at: string
          domain_age_days: number | null
          duplicate_details: Json | null
          has_contact_info: boolean | null
          has_privacy_policy: boolean | null
          has_terms_of_service: boolean | null
          http_status: number | null
          id: string
          imitation_analysis: Json | null
          is_duplicate: boolean | null
          monthly_visits: number | null
          ranking: number | null
          reputation_score: number | null
          response_time: number | null
          risk_level: string | null
          similar_sites: Json | null
          ssl_enabled: boolean | null
          ssl_grade: string | null
          status: string
          trust_score: number | null
          url: string
          user_id: string | null
          visual_fingerprint: string | null
        }
        Insert: {
          category?: string | null
          content_fingerprint?: string | null
          content_score?: number | null
          created_at?: string
          domain_age_days?: number | null
          duplicate_details?: Json | null
          has_contact_info?: boolean | null
          has_privacy_policy?: boolean | null
          has_terms_of_service?: boolean | null
          http_status?: number | null
          id?: string
          imitation_analysis?: Json | null
          is_duplicate?: boolean | null
          monthly_visits?: number | null
          ranking?: number | null
          reputation_score?: number | null
          response_time?: number | null
          risk_level?: string | null
          similar_sites?: Json | null
          ssl_enabled?: boolean | null
          ssl_grade?: string | null
          status: string
          trust_score?: number | null
          url: string
          user_id?: string | null
          visual_fingerprint?: string | null
        }
        Update: {
          category?: string | null
          content_fingerprint?: string | null
          content_score?: number | null
          created_at?: string
          domain_age_days?: number | null
          duplicate_details?: Json | null
          has_contact_info?: boolean | null
          has_privacy_policy?: boolean | null
          has_terms_of_service?: boolean | null
          http_status?: number | null
          id?: string
          imitation_analysis?: Json | null
          is_duplicate?: boolean | null
          monthly_visits?: number | null
          ranking?: number | null
          reputation_score?: number | null
          response_time?: number | null
          risk_level?: string | null
          similar_sites?: Json | null
          ssl_enabled?: boolean | null
          ssl_grade?: string | null
          status?: string
          trust_score?: number | null
          url?: string
          user_id?: string | null
          visual_fingerprint?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_content_similarity: {
        Args: { content1: string; content2: string }
        Returns: number
      }
      get_corporate_verification_user_id: {
        Args: { verification_id: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
