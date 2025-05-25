
import { PhoneVerificationResult } from "@/types/verification";
import { supabase } from "@/integrations/supabase/client";

export class PhoneService {
  async verifyPhone(phone: string): Promise<PhoneVerificationResult> {
    try {
      console.log(`Verificando teléfono via Edge Function: ${phone}`);
      
      const { data, error } = await supabase.functions.invoke('verify-phone', {
        body: { phone }
      });

      if (error) {
        console.error('Error from Edge Function:', error);
        throw new Error(error.message || 'Error al verificar el número de teléfono');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Error verificando teléfono:', error);
      throw new Error(error.message || 'Error al verificar el número de teléfono');
    }
  }
}

export const phoneService = new PhoneService();
