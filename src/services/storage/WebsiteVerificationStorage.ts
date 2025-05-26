
import { supabase } from "@/integrations/supabase/client";
import { WebsiteVerificationResult } from "@/types/verification";
import { BaseVerificationStorage } from "./BaseVerificationStorage";

export class WebsiteVerificationStorage extends BaseVerificationStorage {
  
  async saveWebsiteVerification(url: string, result: WebsiteVerificationResult) {
    try {
      const user = await this.getAuthenticatedUser();
      console.log(`🌐 Guardando verificación de sitio web para usuario: ${user.id}, URL: ${url}`);
      console.log('📊 Datos del resultado:', result);

      // Preparar los datos para insertar con más detalle
      const insertData = {
        user_id: user.id,
        url: url,
        status: result.status,
        is_duplicate: result.isDuplicate || false,
        http_status: result.details?.httpStatus || 0,
        response_time: result.details?.responseTime || 0,
        ssl_enabled: result.sslInfo?.enabled || false,
        ssl_grade: result.sslInfo?.grade || 'F',
        monthly_visits: result.traffic?.monthlyVisits || null,
        ranking: result.traffic?.ranking || null,
        category: result.traffic?.category || null,
        trust_score: result.trustScore || 0,
        domain_age_days: result.domainInfo?.ageInDays || 0,
        content_score: result.contentAnalysis?.contentScore || 0,
        risk_level: result.securityAnalysis?.riskLevel || 'Unknown',
        reputation_score: result.securityAnalysis?.reputationScore || 0,
        has_privacy_policy: result.contentAnalysis?.hasPrivacyPolicy || false,
        has_terms_of_service: result.contentAnalysis?.hasTermsOfService || false,
        has_contact_info: result.contentAnalysis?.hasContactInfo || false,
        duplicate_details: result.duplicateDetails ? JSON.stringify(result.duplicateDetails) : JSON.stringify({}),
        similar_sites: result.similarSites ? JSON.stringify(result.similarSites) : JSON.stringify([]),
        imitation_analysis: result.imitationAnalysis ? JSON.stringify(result.imitationAnalysis) : JSON.stringify({}),
        content_fingerprint: result.contentFingerprint || '',
        visual_fingerprint: result.visualFingerprint || ''
      };

      console.log('💾 Datos preparados para insertar:', insertData);

      const { data, error } = await supabase
        .from('website_verifications')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('❌ Error detallado al guardar verificación de sitio web:', error);
        throw new Error(`Error al guardar en base de datos: ${error.message}`);
      }

      if (data) {
        const caseNumber = this.generateCaseNumberFromData(data.id, data.created_at);
        console.log(`✅ Verificación de sitio web guardada exitosamente - Caso: ${caseNumber}`, data);
        return { ...data, caseNumber };
      }

      return data;
    } catch (error) {
      console.error('💥 Error crítico guardando verificación de sitio web:', error);
      throw error;
    }
  }

  async getRecentWebsiteVerifications(limit: number = 10) {
    try {
      const user = await this.getAuthenticatedUser();
      console.log(`📋 Obteniendo verificaciones recientes de sitio web para usuario: ${user.id}`);
      
      const { data, error } = await supabase
        .from('website_verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Error obteniendo verificaciones de sitio web:', error);
        return [];
      }

      // Agregar número de caso a cada verificación
      const dataWithCaseNumbers = (data || []).map(verification => ({
        ...verification,
        caseNumber: this.generateCaseNumberFromData(verification.id, verification.created_at)
      }));

      console.log(`📊 Verificaciones de sitio web encontradas: ${dataWithCaseNumbers.length}`);
      return dataWithCaseNumbers;
    } catch (error) {
      console.error('💥 Error obteniendo verificaciones de sitio web:', error);
      return [];
    }
  }

  async getWebsiteVerificationStats(today: string) {
    try {
      const user = await this.getAuthenticatedUser();

      const { count, error } = await supabase
        .from('website_verifications')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .gte('created_at', today);

      if (error) {
        console.error('❌ Error obteniendo estadísticas de sitio web:', error);
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('💥 Error obteniendo estadísticas de sitio web:', error);
      return 0;
    }
  }
}
