
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

  // Generar número de caso basado en el ID y timestamp
  protected generateCaseNumberFromData(id: string, createdAt: string): string {
    const shortId = id.substring(0, 8).toUpperCase();
    const date = new Date(createdAt);
    const dateStr = date.toISOString().slice(2, 10).replace(/-/g, '');
    return `${dateStr}-${shortId}`;
  }

  // Método para encontrar registro por número de caso
  protected parseCaseNumber(caseNumber: string): { dateStr: string; shortId: string } {
    const parts = caseNumber.split('-');
    if (parts.length !== 2) {
      throw new Error('Formato de número de caso inválido');
    }
    return {
      dateStr: parts[0],
      shortId: parts[1]
    };
  }
}
