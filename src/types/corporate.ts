
export interface CorporateVerification {
  id: string;
  user_id: string;
  company_name: string;
  tax_id: string;
  country: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  overall_risk_score: number;
  created_at: string;
  updated_at: string;
}

export interface CorporateRegistryInfo {
  id: string;
  corporate_verification_id: string;
  legal_status: 'active' | 'inactive' | 'dissolved' | 'suspended';
  registration_date: string;
  registration_number: string;
  legal_form: string;
  share_capital: number;
  registered_address: string;
  business_activity: string;
  verification_status: string;
  created_at: string;
}

export interface CorporateStructure {
  id: string;
  corporate_verification_id: string;
  person_name: string;
  person_type: 'shareholder' | 'director' | 'legal_representative' | 'beneficial_owner';
  identification_number: string;
  nationality: string;
  ownership_percentage: number;
  position: string;
  appointment_date: string;
  is_pep: boolean;
  pep_details: any;
  sanctions_check_result: any;
  created_at: string;
}

export interface PepSanctionsCheck {
  id: string;
  corporate_verification_id: string;
  person_id: string;
  check_type: 'pep' | 'sanctions' | 'adverse_media';
  check_result: 'clear' | 'hit' | 'potential_match';
  risk_level: 'low' | 'medium' | 'high';
  details: any;
  sources_checked: string[];
  last_checked: string;
  created_at: string;
}

export interface GeographicRiskAnalysis {
  id: string;
  corporate_verification_id: string;
  country_code: string;
  country_risk_score: number;
  jurisdiction_type: 'high_risk' | 'standard' | 'low_risk';
  regulatory_compliance: any;
  address_verification_status: string;
  address_verification_details: any;
  created_at: string;
}

export interface BusinessActivityAnalysis {
  id: string;
  corporate_verification_id: string;
  industry_sector: string;
  business_model: string;
  is_restricted_activity: boolean;
  restricted_activity_details: string;
  licenses_required: string[];
  licenses_verified: any;
  credit_score: number;
  financial_status: 'good' | 'fair' | 'poor' | 'no_data';
  created_at: string;
}

export interface ContinuousMonitoring {
  id: string;
  corporate_verification_id: string;
  monitoring_type: 'pep_update' | 'sanctions_update' | 'registry_change' | 'news_alert';
  alert_level: 'info' | 'warning' | 'critical';
  alert_message: string;
  alert_details: any;
  is_resolved: boolean;
  next_review_date: string;
  created_at: string;
}

export interface RiskScoring {
  id: string;
  corporate_verification_id: string;
  category: 'corporate' | 'pep' | 'geographic' | 'business' | 'overall';
  score: number;
  weight: number;
  factors: any;
  decision_matrix: 'auto_approve' | 'manual_review' | 'auto_reject';
  decision_reason: string;
  created_at: string;
}

export interface RegulatoryReport {
  id: string;
  corporate_verification_id: string;
  report_type: 'kyc_summary' | 'aml_report' | 'pep_report' | 'sanctions_report';
  report_data: any;
  generated_at: string;
  report_status: 'generated' | 'submitted' | 'archived';
  regulatory_authority: string;
  submission_date: string;
}

export interface CorporateVerificationResult {
  corporate_verification: CorporateVerification;
  registry_info?: CorporateRegistryInfo;
  corporate_structure?: CorporateStructure[];
  pep_sanctions_checks?: PepSanctionsCheck[];
  geographic_risk?: GeographicRiskAnalysis;
  business_activity?: BusinessActivityAnalysis;
  monitoring_alerts?: ContinuousMonitoring[];
  risk_scores?: RiskScoring[];
  regulatory_reports?: RegulatoryReport[];
}
