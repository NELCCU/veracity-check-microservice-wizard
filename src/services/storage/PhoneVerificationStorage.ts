import { supabase } from "@/integrations/supabase/client";
import { PhoneVerificationResult } from "@/types/verification";
import { BaseVerificationStorage } from "./BaseVerificationStorage";

export class PhoneVerificationStorage extends BaseVerificationStorage {
  
  async savePhoneVerification(phone: string, result: PhoneVerificationResult) {
    try {
      const user = await this.getAuthenticatedUser();
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

  async getRecentPhoneVerifications(limit: number = 10) {
    try {
      const user = await this.getAuthenticatedUser();
      
      const { data } = await supabase
        .from('phone_verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      return data || [];
    } catch (error) {
      console.error('Error obteniendo verificaciones de teléfono:', error);
      return [];
    }
  }

  async getPhoneVerificationStats(today: string) {
    try {
      const user = await this.getAuthenticatedUser();

      const { count } = await supabase
        .from('phone_verifications')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .gte('created_at', today);

      return count || 0;
    } catch (error) {
      console.error('Error obteniendo estadísticas de teléfono:', error);
      return 0;
    }
  }

  async deletePhoneVerificationByCaseNumber(caseNumber: string) {
    try {
      const user = await this.getAuthenticatedUser();
      const { shortId } = this.parseCaseNumber(caseNumber);
      
      const { data, error } = await supabase
        .from('phone_verifications')
        .delete()
        .eq('user_id', user.id)
        .ilike('id', `${shortId.toLowerCase()}%`)
        .select();

      if (error) {
        console.error('Error eliminando verificación de teléfono:', error);
        throw error;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error eliminando verificación de teléfono:', error);
      throw error;
    }
  }
}
