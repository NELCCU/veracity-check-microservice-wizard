
import { supabase } from "@/integrations/supabase/client";

export abstract class BaseVerificationStorage {
  
  // Generar número de caso único con formato YYMMDD-SHORTID
  protected generateCaseNumber(): string {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    
    const random = Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0');
    return `${dateStr}-${random}`;
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
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
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

  // Método helper para buscar por ID parcial
  protected async findRecordByPartialId(tableName: string, shortId: string): Promise<any> {
    const user = await this.getAuthenticatedUser();
    
    console.log(`🔍 Buscando en tabla ${tableName} con ID parcial: ${shortId}`);
    
    // Buscar registros que empiecen con el shortId
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', user.id)
      .ilike('id::text', `${shortId.toLowerCase()}%`)
      .limit(5);

    if (error) {
      console.error(`❌ Error buscando en ${tableName}:`, error);
      throw error;
    }

    console.log(`📊 Registros encontrados en ${tableName}:`, data?.length || 0);
    
    if (data && data.length > 0) {
      // Si encontramos múltiples registros, tomar el primero
      const record = data[0];
      console.log(`✅ Registro encontrado:`, record.id);
      return record;
    }

    return null;
  }
}
