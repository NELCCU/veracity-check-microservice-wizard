
import { BatchVerificationRequest, BatchVerificationResult } from "@/types/verification";
import { supabase } from "@/integrations/supabase/client";
import { errorHandlingService } from '@/services/errorHandlingService';

export class BatchService {
  async verifyBatch(request: BatchVerificationRequest): Promise<BatchVerificationResult> {
    try {
      console.log('Iniciando verificación en lote via Edge Function', request);
      
      const { data, error } = await supabase.functions.invoke('batch-verify', {
        body: request
      });

      if (error) {
        console.error('Error from Batch Edge Function:', error);
        
        // Analizar el tipo de error
        if (error.message?.includes('quota') || error.message?.includes('limit')) {
          throw new Error('QUOTA_EXCEEDED: Plan de verificación en lote agotado');
        }
        
        if (error.message?.includes('network') || error.message?.includes('timeout')) {
          throw new Error('NETWORK_ERROR: Error de conexión durante la verificación en lote');
        }
        
        throw new Error(error.message || 'Error al realizar la verificación en lote');
      }

      if (data.error) {
        // Manejar errores específicos del batch
        if (data.error.includes('API key') || data.error.includes('authentication')) {
          throw new Error('AUTH_ERROR: Error de autenticación en servicios de verificación');
        }
        
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Error en verificación en lote:', error);
      
      // Usar el servicio de manejo de errores
      const apiError = errorHandlingService.analyzeError(error, 'general');
      
      // Para errores de lote, mostrar información adicional
      if (apiError.type === 'quota_exceeded') {
        errorHandlingService.showErrorNotification({
          ...apiError,
          message: 'Plan de verificación en lote agotado. Algunas verificaciones pueden haber fallado.'
        });
      } else {
        errorHandlingService.showErrorNotification(apiError);
      }
      
      throw error;
    }
  }
}

export const batchService = new BatchService();
