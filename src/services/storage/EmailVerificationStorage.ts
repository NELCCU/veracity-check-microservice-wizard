
import { supabase } from "@/integrations/supabase/client";
import { EmailVerificationResult } from "@/types/verification";
import { BaseVerificationStorage } from "./BaseVerificationStorage";

export class EmailVerificationStorage extends BaseVerificationStorage {
  
  async saveEmailVerification(email: string, result: EmailVerificationResult) {
    try {
      const user = await this.getAuthenticatedUser();
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
        console.error('❌ Error guardando verificación de email:', error);
        throw error;
      }

      if (data) {
        const caseNumber = this.generateCaseNumberFromData(data.id, data.created_at);
        console.log(`✅ Verificación de email guardada exitosamente - Caso: ${caseNumber}`, data);
        return { ...data, caseNumber };
      }

      return data;
    } catch (error) {
      console.error('💥 Error guardando verificación de email:', error);
      throw error;
    }
  }

  async getRecentEmailVerifications(limit: number = 10) {
    try {
      const user = await this.getAuthenticatedUser();
      
      const { data, error } = await supabase
        .from('email_verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Error obteniendo verificaciones de email:', error);
        return [];
      }

      // Agregar número de caso a cada verificación
      const dataWithCaseNumbers = (data || []).map(verification => ({
        ...verification,
        caseNumber: this.generateCaseNumberFromData(verification.id, verification.created_at)
      }));

      console.log(`📊 Verificaciones de email encontradas: ${dataWithCaseNumbers.length}`);
      return dataWithCaseNumbers;
    } catch (error) {
      console.error('💥 Error obteniendo verificaciones de email:', error);
      return [];
    }
  }

  async getEmailVerificationStats(today: string) {
    try {
      const user = await this.getAuthenticatedUser();

      const { count } = await supabase
        .from('email_verifications')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .gte('created_at', today);

      return count || 0;
    } catch (error) {
      console.error('Error obteniendo estadísticas de email:', error);
      return 0;
    }
  }

  async deleteEmailVerificationByCaseNumber(caseNumber: string) {
    try {
      const user = await this.getAuthenticatedUser();
      const { shortId } = this.parseCaseNumber(caseNumber);
      
      console.log(`🗑️ Eliminando verificación de email - Caso: ${caseNumber}, ID parcial: ${shortId}`);
      
      // Buscar el registro específico usando el ID parcial convertido a texto
      const { data, error } = await supabase
        .from('email_verifications')
        .select('*')
        .eq('user_id', user.id)
        .like('id::text', `${shortId.toLowerCase()}%`)
        .limit(5);

      if (error) {
        console.error(`❌ Error buscando en email_verifications:`, error);
        throw error;
      }

      console.log(`📊 Registros encontrados en email_verifications:`, data?.length || 0);
      
      if (!data || data.length === 0) {
        console.log(`⚠️ No se encontró verificación de email con el caso: ${caseNumber}`);
        return false;
      }

      const record = data[0];
      console.log(`✅ Registro encontrado:`, record.id);

      // Eliminar el registro específico por ID completo
      const { data: deleteData, error: deleteError } = await supabase
        .from('email_verifications')
        .delete()
        .eq('user_id', user.id)
        .eq('id', record.id)
        .select();

      if (deleteError) {
        console.error('❌ Error eliminando verificación de email:', deleteError);
        throw deleteError;
      }

      const deleted = deleteData && deleteData.length > 0;
      if (deleted) {
        console.log(`✅ Verificación de email eliminada exitosamente - Caso: ${caseNumber}`, deleteData[0]);
      }

      return deleted;
    } catch (error) {
      console.error('💥 Error eliminando verificación de email:', error);
      throw error;
    }
  }
}
