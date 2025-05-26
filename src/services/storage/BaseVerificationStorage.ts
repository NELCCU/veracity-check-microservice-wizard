
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

  // Método corregido para encontrar registro por número de caso
  protected parseCaseNumber(caseNumber: string): { dateStr: string; shortId: string } {
    console.log(`🔍 Parseando número de caso: ${caseNumber}`);
    
    // Verificar si el formato es YYMMDD-SHORTID (formato actual)
    const match = caseNumber.match(/^(\d{6})-([A-F0-9]{8})$/);
    if (match) {
      const [, dateStr, shortId] = match;
      console.log(`✅ Formato válido encontrado - Fecha: ${dateStr}, ID: ${shortId}`);
      return { dateStr, shortId };
    }
    
    // Fallback para formato anterior (si existe)
    const parts = caseNumber.split('-');
    if (parts.length >= 2) {
      const shortId = parts[parts.length - 1]; // Tomar la última parte como ID
      const dateStr = parts[0];
      console.log(`⚠️ Usando formato fallback - Fecha: ${dateStr}, ID: ${shortId}`);
      return { dateStr, shortId };
    }
    
    console.error(`❌ Formato de número de caso inválido: ${caseNumber}`);
    throw new Error(`Formato de número de caso inválido: ${caseNumber}`);
  }
}
