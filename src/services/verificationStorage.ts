import { supabase } from "@/integrations/supabase/client";
import { PhoneVerificationResult, EmailVerificationResult, WebsiteVerificationResult } from "@/types/verification";

export class VerificationStorage {
  
  // Generar número de caso único
  private generateCaseNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CASE-${timestamp}-${random}`;
  }

  async savePhoneVerification(phone: string, result: PhoneVerificationResult) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const caseNumber = this.generateCaseNumber();
      console.log(`Guardando verificación de teléfono - Caso: ${caseNumber}`);

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

      if (error) {
        console.error('Error guardando verificación de teléfono:', error);
        throw error;
      }
      console.log(`Verificación de teléfono guardada exitosamente - Caso: ${caseNumber}`);
    } catch (error) {
      console.error('Error guardando verificación de teléfono:', error);
      throw error;
    }
  }

  async saveEmailVerification(email: string, result: EmailVerificationResult) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const caseNumber = this.generateCaseNumber();
      console.log(`Guardando verificación de email - Caso: ${caseNumber}`);

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

      if (error) {
        console.error('Error guardando verificación de email:', error);
        throw error;
      }
      console.log(`Verificación de email guardada exitosamente - Caso: ${caseNumber}`);
    } catch (error) {
      console.error('Error guardando verificación de email:', error);
      throw error;
    }
  }

  async saveWebsiteVerification(url: string, result: WebsiteVerificationResult) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const caseNumber = this.generateCaseNumber();
      console.log(`Guardando verificación de sitio web - Caso: ${caseNumber}, URL: ${url}`);

      // Preparar los datos para insertar, convirtiendo tipos personalizados a JSON
      const insertData = {
        url: url,
        status: result.status,
        is_duplicate: result.isDuplicate,
        http_status: result.details.httpStatus,
        response_time: result.details.responseTime,
        ssl_enabled: result.details.ssl,
        monthly_visits: result.traffic?.monthlyVisits,
        ranking: result.traffic?.ranking,
        category: result.traffic?.category,
        duplicate_details: JSON.parse(JSON.stringify(result.duplicateDetails || {})),
        similar_sites: JSON.parse(JSON.stringify(result.similarSites || [])),
        imitation_analysis: JSON.parse(JSON.stringify(result.imitationAnalysis || {})),
        content_fingerprint: result.contentFingerprint || '',
        visual_fingerprint: result.visualFingerprint || ''
      } as any;

      // Añadir user_id de forma explícita
      (insertData as any).user_id = user.id;

      console.log('Datos a insertar:', insertData);

      const { data, error } = await supabase
        .from('website_verifications')
        .insert(insertData)
        .select();

      if (error) {
        console.error('Error detallado al guardar verificación de sitio web:', error);
        throw error;
      }

      console.log(`Verificación de sitio web guardada exitosamente - Caso: ${caseNumber}`, data);
    } catch (error) {
      console.error('Error guardando verificación de sitio web:', error);
      throw error;
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
