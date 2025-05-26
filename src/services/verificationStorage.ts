import { supabase } from "@/integrations/supabase/client";
import { PhoneVerificationResult, EmailVerificationResult, WebsiteVerificationResult } from "@/types/verification";

export class VerificationStorage {
  
  async savePhoneVerification(phone: string, result: PhoneVerificationResult) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { error } = await supabase
        .from('phone_verifications')
        .insert({
          user_id: user.id,
          phone_number: phone,
          status: result.status,
          country: result.details.country,
          carrier: result.details.carrier,
          line_type: result.details.lineType,
          is_active: result.details.isActive
        });

      if (error) throw error;
      console.log('Verificación de teléfono guardada en Supabase');
    } catch (error) {
      console.error('Error guardando verificación de teléfono:', error);
    }
  }

  async saveEmailVerification(email: string, result: EmailVerificationResult) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { error } = await supabase
        .from('email_verifications')
        .insert({
          user_id: user.id,
          email: email,
          status: result.status,
          domain: result.details.domain,
          is_deliverable: result.details.isDeliverable,
          is_disposable: result.details.isDisposable,
          mx_records: result.details.mxRecords,
          smtp_check: result.details.smtpCheck
        });

      if (error) throw error;
      console.log('Verificación de email guardada en Supabase');
    } catch (error) {
      console.error('Error guardando verificación de email:', error);
    }
  }

  async saveWebsiteVerification(url: string, result: WebsiteVerificationResult) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { error } = await supabase
        .from('website_verifications')
        .insert({
          url: url,
          status: result.status,
          is_duplicate: result.isDuplicate,
          http_status: result.details.httpStatus,
          response_time: result.details.responseTime,
          ssl_enabled: result.details.ssl,
          monthly_visits: result.traffic?.monthlyVisits,
          ranking: result.traffic?.ranking,
          category: result.traffic?.category,
          // Guardar todos los datos del análisis completo
          trust_score: result.trustScore,
          domain_age_days: result.domainInfo?.ageInDays,
          ssl_grade: result.sslInfo?.grade,
          content_score: result.contentAnalysis?.contentScore,
          risk_level: result.securityAnalysis?.riskLevel,
          has_privacy_policy: result.contentAnalysis?.hasPrivacyPolicy,
          has_terms_of_service: result.contentAnalysis?.hasTermsOfService,
          has_contact_info: result.contentAnalysis?.hasContactInfo,
          reputation_score: result.securityAnalysis?.reputationScore,
          // Guardar análisis completo como JSON
          duplicate_details: result.duplicateDetails || {},
          similar_sites: result.similarSites || [],
          imitation_analysis: result.imitationAnalysis || {},
          content_fingerprint: result.contentAnalysis?.title || '',
          visual_fingerprint: result.domainInfo?.domain || ''
        });

      if (error) throw error;
      console.log('Verificación de sitio web guardada en Supabase');
    } catch (error) {
      console.error('Error guardando verificación de sitio web:', error);
    }
  }

  async getRecentVerifications(limit: number = 10) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const [phoneData, emailData, websiteData] = await Promise.all([
        supabase
          .from('phone_verifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(limit),
        
        supabase
          .from('email_verifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(limit),
        
        supabase
          .from('website_verifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(limit)
      ]);

      return {
        phones: phoneData.data || [],
        emails: emailData.data || [],
        websites: websiteData.data || []
      };
    } catch (error) {
      console.error('Error obteniendo verificaciones recientes:', error);
      return { phones: [], emails: [], websites: [] };
    }
  }

  async getVerificationStats() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const today = new Date().toISOString().split('T')[0];

      const [phoneCount, emailCount, websiteCount] = await Promise.all([
        supabase
          .from('phone_verifications')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .gte('created_at', today),
        
        supabase
          .from('email_verifications')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .gte('created_at', today),
        
        supabase
          .from('website_verifications')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .gte('created_at', today)
      ]);

      return {
        today: {
          phones: phoneCount.count || 0,
          emails: emailCount.count || 0,
          websites: websiteCount.count || 0,
          total: (phoneCount.count || 0) + (emailCount.count || 0) + (websiteCount.count || 0)
        }
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return { today: { phones: 0, emails: 0, websites: 0, total: 0 } };
    }
  }
}

export const verificationStorage = new VerificationStorage();
