
import { supabase } from "@/integrations/supabase/client";

export abstract class BaseVerificationStorage {
  
  protected async getAuthenticatedUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error('Usuario no autenticado');
    }
    return user;
  }

  protected generateCaseNumberFromData(id: string, createdAt: string): string {
    const shortId = id.substring(0, 8).toUpperCase();
    const date = new Date(createdAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `VRF-${year}${month}${day}-${shortId}`;
  }

  protected parseCaseNumber(caseNumber: string): { shortId: string; date: string } {
    console.log(`🔍 Parseando número de caso: ${caseNumber}`);
    
    // Formato esperado: VRF-YYYYMMDD-SHORTID
    const match = caseNumber.match(/^VRF-(\d{8})-([A-F0-9]{8})$/);
    
    if (!match) {
      console.error(`❌ Formato de caso inválido: ${caseNumber}`);
      throw new Error(`Formato de número de caso inválido: ${caseNumber}`);
    }

    const [, date, shortId] = match;
    console.log(`✅ Caso parseado - Fecha: ${date}, ID parcial: ${shortId}`);
    
    return { shortId: shortId.toLowerCase(), date };
  }
}
