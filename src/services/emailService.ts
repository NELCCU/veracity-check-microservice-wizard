
import { EmailVerificationResult } from "@/types/verification";
import { supabase } from "@/integrations/supabase/client";

export class EmailService {
  async verifyEmail(email: string): Promise<EmailVerificationResult> {
    try {
      console.log(`Verificando email via Edge Function: ${email}`);
      
      const { data, error } = await supabase.functions.invoke('verify-email', {
        body: { email }
      });

      if (error) {
        console.error('Error from Edge Function:', error);
        throw new Error(error.message || 'Error al verificar el correo electrónico');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Error verificando email:', error);
      throw new Error(error.message || 'Error al verificar el correo electrónico');
    }
  }
}

export const emailService = new EmailService();
