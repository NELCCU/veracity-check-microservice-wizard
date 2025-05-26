
import { supabase } from "@/integrations/supabase/client";
import { PhoneVerificationResult, EmailVerificationResult, WebsiteVerificationResult } from "@/types/verification";
import { BaseVerificationStorage } from "./BaseVerificationStorage";
import { CacheManager } from "../performance/CacheManager";
import { SecurityAudit } from "../security/SecurityAudit";
import { PerformanceMonitor } from "../optimization/PerformanceMonitor";

/**
 * Optimized Verification Storage - Mejoras de rendimiento y seguridad
 * Implementa cache, auditoria y monitoreo de rendimiento
 */
export class OptimizedVerificationStorage extends BaseVerificationStorage {
  private cache = CacheManager.getInstance();
  private audit = SecurityAudit.getInstance();
  private monitor = PerformanceMonitor.getInstance();

  // Método para limpiar cache específico
  private invalidateCache() {
    this.cache.clear();
    console.log('🗑️ Cache invalidado para actualización inmediata');
  }

  async savePhoneVerification(phone: string, result: PhoneVerificationResult): Promise<any> {
    const endTiming = this.monitor.startTiming('save_phone_verification');
    
    try {
      const user = await this.getAuthenticatedUser();
      
      // Auditoria de seguridad
      this.audit.logVerificationAttempt(user.id, 'phone', phone, result.status === 'valid');
      
      console.log(`📞 Guardando verificación de teléfono para usuario: ${user.id}`);

      const { data, error } = await supabase
        .from('phone_verifications')
        .insert({
          user_id: user.id,
          phone_number: phone,
          status: result.status,
          country: result.details.country || null,
          carrier: result.details.carrier || null,
          line_type: result.details.lineType || null,
          is_active: result.details.isActive || null
        })
        .select()
        .single();

      if (error) {
        this.audit.logEvent({
          userId: user.id,
          action: 'SAVE_PHONE_VERIFICATION_ERROR',
          resource: phone,
          success: false,
          riskLevel: 'MEDIUM',
          metadata: { error: error.message }
        });
        throw error;
      }

      if (data) {
        const caseNumber = this.generateCaseNumberFromData(data.id, data.created_at);
        const result = { ...data, caseNumber };
        
        // Invalidar cache para actualización inmediata
        this.invalidateCache();
        
        console.log(`✅ Verificación de teléfono guardada - Caso: ${caseNumber}`);
        return result;
      }

      return data;
    } catch (error) {
      console.error('💥 Error guardando verificación de teléfono:', error);
      throw error;
    } finally {
      endTiming();
    }
  }

  async saveEmailVerification(email: string, result: EmailVerificationResult): Promise<any> {
    const endTiming = this.monitor.startTiming('save_email_verification');
    
    try {
      const user = await this.getAuthenticatedUser();
      
      // Auditoria de seguridad
      this.audit.logVerificationAttempt(user.id, 'email', email, result.status === 'valid');
      
      console.log(`📧 Guardando verificación de email para usuario: ${user.id}`);

      const { data, error } = await supabase
        .from('email_verifications')
        .insert({
          user_id: user.id,
          email: email,
          status: result.status,
          domain: result.details.domain || null,
          is_deliverable: result.details.isDeliverable || null,
          is_disposable: result.details.isDisposable || null,
          mx_records: result.details.mxRecords || null,
          smtp_check: result.details.smtpCheck || null
        })
        .select()
        .single();

      if (error) {
        this.audit.logEvent({
          userId: user.id,
          action: 'SAVE_EMAIL_VERIFICATION_ERROR',
          resource: email,
          success: false,
          riskLevel: 'MEDIUM',
          metadata: { error: error.message }
        });
        throw error;
      }

      if (data) {
        const caseNumber = this.generateCaseNumberFromData(data.id, data.created_at);
        const result = { ...data, caseNumber };
        
        // Invalidar cache para actualización inmediata
        this.invalidateCache();
        
        console.log(`✅ Verificación de email guardada - Caso: ${caseNumber}`);
        return result;
      }

      return data;
    } catch (error) {
      console.error('💥 Error guardando verificación de email:', error);
      throw error;
    } finally {
      endTiming();
    }
  }

  async saveWebsiteVerification(url: string, result: WebsiteVerificationResult): Promise<any> {
    const endTiming = this.monitor.startTiming('save_website_verification');
    
    try {
      const user = await this.getAuthenticatedUser();
      
      // Auditoria de seguridad
      this.audit.logVerificationAttempt(user.id, 'website', url, result.status === 'valid');
      
      console.log(`🌐 Guardando verificación de sitio web para usuario: ${user.id}, URL: ${url}`);

      // Preparar los datos de forma más eficiente
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
        duplicate_details: JSON.stringify(result.duplicateDetails || {}),
        similar_sites: JSON.stringify(result.similarSites || []),
        imitation_analysis: JSON.stringify(result.imitationAnalysis || {}),
        content_fingerprint: result.contentFingerprint || '',
        visual_fingerprint: result.visualFingerprint || ''
      };

      const { data, error } = await supabase
        .from('website_verifications')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        this.audit.logEvent({
          userId: user.id,
          action: 'SAVE_WEBSITE_VERIFICATION_ERROR',
          resource: url,
          success: false,
          riskLevel: 'MEDIUM',
          metadata: { error: error.message }
        });
        throw new Error(`Error al guardar en base de datos: ${error.message}`);
      }

      if (data) {
        const caseNumber = this.generateCaseNumberFromData(data.id, data.created_at);
        const result = { ...data, caseNumber };
        
        // Invalidar cache para actualización inmediata
        this.invalidateCache();
        
        console.log(`✅ Verificación de sitio web guardada - Caso: ${caseNumber}`);
        return result;
      }

      return data;
    } catch (error) {
      console.error('💥 Error guardando verificación de sitio web:', error);
      throw error;
    } finally {
      endTiming();
    }
  }

  async getRecentVerifications(limit: number = 10) {
    const endTiming = this.monitor.startTiming('get_recent_verifications');
    const cacheKey = `recent_verifications_${limit}`;
    
    try {
      // Reducir tiempo de cache para actualizaciones más frecuentes
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log('📋 Verificaciones obtenidas del cache');
        return cached;
      }

      const user = await this.getAuthenticatedUser();

      // Ejecutar consultas en paralelo con mejor rendimiento
      const [phoneData, emailData, websiteData] = await Promise.allSettled([
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

      const result = {
        phones: phoneData.status === 'fulfilled' ? (phoneData.value.data || []).map(verification => ({
          ...verification,
          caseNumber: this.generateCaseNumberFromData(verification.id, verification.created_at)
        })) : [],
        emails: emailData.status === 'fulfilled' ? (emailData.value.data || []).map(verification => ({
          ...verification,
          caseNumber: this.generateCaseNumberFromData(verification.id, verification.created_at)
        })) : [],
        websites: websiteData.status === 'fulfilled' ? (websiteData.value.data || []).map(verification => ({
          ...verification,
          caseNumber: this.generateCaseNumberFromData(verification.id, verification.created_at)
        })) : []
      };

      // Cache más corto para actualizaciones más frecuentes
      this.cache.set(cacheKey, result, 30 * 1000); // 30 segundos

      console.log(`📊 Verificaciones encontradas: ${result.phones.length + result.emails.length + result.websites.length}`);
      return result;
    } catch (error) {
      console.error('💥 Error obteniendo verificaciones recientes:', error);
      return { phones: [], emails: [], websites: [] };
    } finally {
      endTiming();
    }
  }

  async getVerificationStats() {
    const endTiming = this.monitor.startTiming('get_verification_stats');
    const cacheKey = 'verification_stats_today';
    
    try {
      // Cache más corto para estadísticas más actualizadas
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log('📊 Estadísticas obtenidas del cache');
        return cached;
      }

      const user = await this.getAuthenticatedUser();
      const today = new Date().toISOString().split('T')[0];

      // Ejecutar consultas en paralelo con manejo de errores
      const [phoneCount, emailCount, websiteCount] = await Promise.allSettled([
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

      const result = {
        today: {
          phones: phoneCount.status === 'fulfilled' ? phoneCount.value.count || 0 : 0,
          emails: emailCount.status === 'fulfilled' ? emailCount.value.count || 0 : 0,
          websites: websiteCount.status === 'fulfilled' ? websiteCount.value.count || 0 : 0,
          total: (phoneCount.status === 'fulfilled' ? phoneCount.value.count || 0 : 0) + 
                 (emailCount.status === 'fulfilled' ? emailCount.value.count || 0 : 0) + 
                 (websiteCount.status === 'fulfilled' ? websiteCount.value.count || 0 : 0)
        }
      };

      // Cache más corto para estadísticas más actualizadas
      this.cache.set(cacheKey, result, 60 * 1000); // 1 minuto

      return result;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return { today: { phones: 0, emails: 0, websites: 0, total: 0 } };
    } finally {
      endTiming();
    }
  }
}

export const optimizedVerificationStorage = new OptimizedVerificationStorage();
