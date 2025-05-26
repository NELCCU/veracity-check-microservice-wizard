
import { supabase } from "@/integrations/supabase/client";
import { EmailVerificationResult } from "@/types/verification";
import { BaseVerificationStorage } from "./BaseVerificationStorage";

export class EmailVerificationStorage extends BaseVerificationStorage {
  
  async saveEmailVerification(email: string, result: EmailVerificationResult) {
    try {
      const user = await this.getAuthenticatedUser();
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

  async getRecentEmailVerifications(limit: number = 10) {
    try {
      const user = await this.getAuthenticatedUser();
      
      const { data } = await supabase
        .from('email_verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      return data || [];
    } catch (error) {
      console.error('Error obteniendo verificaciones de email:', error);
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
}
