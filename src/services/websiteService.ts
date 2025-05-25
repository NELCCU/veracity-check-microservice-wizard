
import { WebsiteVerificationResult } from "@/types/verification";
import { supabase } from "@/integrations/supabase/client";

export class WebsiteService {
  async verifyWebsite(url: string): Promise<WebsiteVerificationResult> {
    try {
      console.log(`Verificando sitio web via Edge Function: ${url}`);
      
      const { data, error } = await supabase.functions.invoke('verify-website', {
        body: { url }
      });

      if (error) {
        console.error('Error from Edge Function:', error);
        throw new Error(error.message || 'Error al verificar el sitio web');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Error verificando sitio web:', error);
      throw new Error(error.message || 'Error al verificar el sitio web');
    }
  }
}

export const websiteService = new WebsiteService();
