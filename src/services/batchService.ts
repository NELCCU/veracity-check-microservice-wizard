
import { BatchVerificationRequest, BatchVerificationResult } from "@/types/verification";
import { supabase } from "@/integrations/supabase/client";

export class BatchService {
  async verifyBatch(request: BatchVerificationRequest): Promise<BatchVerificationResult> {
    try {
      console.log('Iniciando verificación en lote via Edge Function', request);
      
      const { data, error } = await supabase.functions.invoke('batch-verify', {
        body: request
      });

      if (error) {
        console.error('Error from Batch Edge Function:', error);
        throw new Error(error.message || 'Error al realizar la verificación en lote');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Error en verificación en lote:', error);
      throw new Error(error.message || 'Error al realizar la verificación en lote');
    }
  }
}

export const batchService = new BatchService();
