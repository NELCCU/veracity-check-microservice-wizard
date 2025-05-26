
import { supabase } from "@/integrations/supabase/client";

export abstract class BaseVerificationStorage {
  
  // Generar número de caso único
  protected generateCaseNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CASE-${timestamp}-${random}`;
  }

  protected async getAuthenticatedUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');
    return user;
  }
}
