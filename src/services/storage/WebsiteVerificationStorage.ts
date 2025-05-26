
import { supabase } from "@/integrations/supabase/client";
import { WebsiteVerificationResult } from "@/types/verification";
import { BaseVerificationStorage } from "./BaseVerificationStorage";

export class WebsiteVerificationStorage extends BaseVerificationStorage {
  
  async saveWebsiteVerification(url: string, result: WebsiteVerificationResult) {
    try {
      const user = await this.getAuthenticatedUser();
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

  async getRecentWebsiteVerifications(limit: number = 10) {
    try {
      const user = await this.getAuthenticatedUser();
      
      const { data } = await supabase
        .from('website_verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      return data || [];
    } catch (error) {
      console.error('Error obteniendo verificaciones de sitio web:', error);
      return [];
    }
  }

  async getWebsiteVerificationStats(today: string) {
    try {
      const user = await this.getAuthenticatedUser();

      const { count } = await supabase
        .from('website_verifications')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .gte('created_at', today);

      return count || 0;
    } catch (error) {
      console.error('Error obteniendo estadísticas de sitio web:', error);
      return 0;
    }
  }
}
