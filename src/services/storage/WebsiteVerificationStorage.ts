
import { supabase } from "@/integrations/supabase/client";
import { WebsiteVerificationResult } from "@/types/verification";
import { BaseVerificationStorage } from "./BaseVerificationStorage";

export class WebsiteVerificationStorage extends BaseVerificationStorage {
  
  async saveWebsiteVerification(url: string, result: WebsiteVerificationResult) {
    try {
      const user = await this.getAuthenticatedUser();
      const caseNumber = this.generateCaseNumber();
      console.log(`🔍 Guardando verificación de sitio web - Caso: ${caseNumber}, URL: ${url}`);
      console.log('📊 Datos del resultado:', result);

      // Preparar los datos para insertar, asegurando que todos los campos JSON sean válidos
      const insertData = {
        user_id: user.id,
        url: url,
        status: result.status,
        is_duplicate: result.isDuplicate || false,
        http_status: result.details?.httpStatus || 0,
        response_time: result.details?.responseTime || 0,
        ssl_enabled: result.details?.ssl || false,
        monthly_visits: result.traffic?.monthlyVisits || null,
        ranking: result.traffic?.ranking || null,
        category: result.traffic?.category || null,
        duplicate_details: result.duplicateDetails ? JSON.stringify(result.duplicateDetails) : '{}',
        similar_sites: result.similarSites ? JSON.stringify(result.similarSites) : '[]',
        imitation_analysis: result.imitationAnalysis ? JSON.stringify(result.imitationAnalysis) : '{}',
        content_fingerprint: result.contentFingerprint || '',
        visual_fingerprint: result.visualFingerprint || ''
      };

      console.log('💾 Datos preparados para insertar:', insertData);

      const { data, error } = await supabase
        .from('website_verifications')
        .insert([insertData])
        .select();

      if (error) {
        console.error('❌ Error detallado al guardar verificación de sitio web:', error);
        console.error('🔍 Detalles del error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Error al guardar en base de datos: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.error('❌ No se recibieron datos después de la inserción');
        throw new Error('No se pudo confirmar el guardado de la verificación');
      }

      console.log(`✅ Verificación de sitio web guardada exitosamente - Caso: ${caseNumber}`, data[0]);
      return data[0];
    } catch (error) {
      console.error('💥 Error crítico guardando verificación de sitio web:', error);
      console.error('🔍 Stack trace:', error.stack);
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
        throw error;
      }

      console.log(`📊 Verificaciones encontradas: ${data?.length || 0}`);
      return data || [];
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

  async deleteWebsiteVerificationByCaseNumber(caseNumber: string) {
    try {
      const user = await this.getAuthenticatedUser();
      const { shortId } = this.parseCaseNumber(caseNumber);
      
      console.log(`🗑️ Eliminando verificación de sitio web - Caso: ${caseNumber}, ID parcial: ${shortId}`);
      
      // Usar ILIKE con conversión de UUID a texto
      const { data, error } = await supabase
        .from('website_verifications')
        .delete()
        .eq('user_id', user.id)
        .ilike('id::text', `${shortId.toLowerCase()}%`)
        .select();

      if (error) {
        console.error('❌ Error eliminando verificación de sitio web:', error);
        throw error;
      }

      const deleted = data && data.length > 0;
      if (deleted) {
        console.log(`✅ Verificación de sitio web eliminada exitosamente - Caso: ${caseNumber}`, data[0]);
      } else {
        console.log(`⚠️ No se encontró verificación de sitio web con el caso: ${caseNumber}`);
      }

      return deleted;
    } catch (error) {
      console.error('💥 Error eliminando verificación de sitio web:', error);
      throw error;
    }
  }
}
