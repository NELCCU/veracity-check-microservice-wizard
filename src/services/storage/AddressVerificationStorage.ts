
import { supabase } from "@/integrations/supabase/client";
import { AddressVerificationResult } from "../addressService";
import { BaseVerificationStorage } from "./BaseVerificationStorage";

export class AddressVerificationStorage extends BaseVerificationStorage {
  async saveAddressVerification(address: string, result: AddressVerificationResult): Promise<any> {
    try {
      const user = await this.getAuthenticatedUser();
      
      console.log(`🏠 Guardando verificación de dirección para usuario: ${user.id}`);

      const { data, error } = await supabase
        .from('address_verifications')
        .insert({
          user_id: user.id,
          address: address,
          formatted_address: result.formattedAddress || null,
          status: result.status,
          confidence_score: result.confidenceScore,
          location_type: result.locationType || null,
          coordinates_lat: result.coordinates?.lat || null,
          coordinates_lng: result.coordinates?.lng || null,
          place_id: result.placeId || null,
          components: result.components || {},
          types: result.types || []
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const caseNumber = this.generateCaseNumberFromData(data.id, data.created_at);
        const result = { ...data, caseNumber };
        
        console.log(`✅ Verificación de dirección guardada - Caso: ${caseNumber}`);
        return result;
      }

      return data;
    } catch (error) {
      console.error('💥 Error guardando verificación de dirección:', error);
      throw error;
    }
  }

  async getRecentAddressVerifications(limit: number = 10) {
    try {
      const user = await this.getAuthenticatedUser();

      const { data, error } = await supabase
        .from('address_verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return (data || []).map(verification => ({
        ...verification,
        caseNumber: this.generateCaseNumberFromData(verification.id, verification.created_at)
      }));
    } catch (error) {
      console.error('💥 Error obteniendo verificaciones de dirección:', error);
      return [];
    }
  }
}

export const addressVerificationStorage = new AddressVerificationStorage();
