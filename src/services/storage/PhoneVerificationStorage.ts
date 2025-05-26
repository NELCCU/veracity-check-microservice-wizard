
import { supabase } from "@/integrations/supabase/client";
import { PhoneVerificationResult } from "@/types/verification";
import { BaseVerificationStorage } from "./BaseVerificationStorage";

export class PhoneVerificationStorage extends BaseVerificationStorage {
  
  async savePhoneVerification(phone: string, result: PhoneVerificationResult) {
    try {
      const user = await this.getAuthenticatedUser();
      console.log(`📞 Guardando verificación de teléfono para usuario: ${user.id}`);

      const { data, error } = await supabase
        .from('phone_verifications')
        .insert({
          user_id: user.id,
          phone_number: phone,
          status: result.status,
          country: result.details.country || null,
          carrier: result.details.carrier || null,
          line_type: result.details.lineType || null,
          is_active: result.details.isActive || null
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error guardando verificación de teléfono:', error);
        throw error;
      }

      if (data) {
        const caseNumber = this.generateCaseNumberFromData(data.id, data.created_at);
        console.log(`✅ Verificación de teléfono guardada exitosamente - Caso: ${caseNumber}`, data);
        return { ...data, caseNumber };
      }

      return data;
    } catch (error) {
      console.error('💥 Error guardando verificación de teléfono:', error);
      throw error;
    }
  }

  async getRecentPhoneVerifications(limit: number = 10) {
    try {
      const user = await this.getAuthenticatedUser();
      
      const { data, error } = await supabase
        .from('phone_verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Error obteniendo verificaciones de teléfono:', error);
        return [];
      }

      // Agregar número de caso a cada verificación
      const dataWithCaseNumbers = (data || []).map(verification => ({
        ...verification,
        caseNumber: this.generateCaseNumberFromData(verification.id, verification.created_at)
      }));

      console.log(`📊 Verificaciones de teléfono encontradas: ${dataWithCaseNumbers.length}`);
      return dataWithCaseNumbers;
    } catch (error) {
      console.error('💥 Error obteniendo verificaciones de teléfono:', error);
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
      
      console.log(`🗑️ Eliminando verificación de teléfono - Caso: ${caseNumber}, ID parcial: ${shortId}`);
      
      // Obtener todos los registros del usuario para buscar coincidencias
      const { data: allRecords, error: fetchError } = await supabase
        .from('phone_verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error(`❌ Error obteniendo verificaciones de teléfono:`, fetchError);
        throw fetchError;
      }

      console.log(`📊 Total de registros encontrados: ${allRecords?.length || 0}`);
      
      // Buscar el registro que coincida con el ID parcial
      const matchingRecord = allRecords?.find(record => 
        record.id.toLowerCase().startsWith(shortId)
      );

      if (!matchingRecord) {
        console.log(`⚠️ No se encontró verificación de teléfono con el caso: ${caseNumber}`);
        return false;
      }

      console.log(`✅ Registro encontrado para eliminar:`, matchingRecord.id);

      // Eliminar el registro específico por ID completo
      const { data: deleteData, error: deleteError } = await supabase
        .from('phone_verifications')
        .delete()
        .eq('user_id', user.id)
        .eq('id', matchingRecord.id)
        .select();

      if (deleteError) {
        console.error('❌ Error eliminando verificación de teléfono:', deleteError);
        throw deleteError;
      }

      const deleted = deleteData && deleteData.length > 0;
      if (deleted) {
        console.log(`✅ Verificación de teléfono eliminada exitosamente - Caso: ${caseNumber}`, deleteData[0]);
      }

      return deleted;
    } catch (error) {
      console.error('💥 Error eliminando verificación de teléfono:', error);
      throw error;
    }
  }

  async getRecentPhoneVerifications(limit: number = 10) {
    try {
      const user = await this.getAuthenticatedUser();
      
      const { data, error } = await supabase
        .from('phone_verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Error obteniendo verificaciones de teléfono:', error);
        return [];
      }

      // Agregar número de caso a cada verificación
      const dataWithCaseNumbers = (data || []).map(verification => ({
        ...verification,
        caseNumber: this.generateCaseNumberFromData(verification.id, verification.created_at)
      }));

      console.log(`📊 Verificaciones de teléfono encontradas: ${dataWithCaseNumbers.length}`);
      return dataWithCaseNumbers;
    } catch (error) {
      console.error('💥 Error obteniendo verificaciones de teléfono:', error);
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
}
