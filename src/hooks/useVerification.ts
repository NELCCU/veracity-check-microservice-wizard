
import { useState } from 'react';
import { phoneService } from '@/services/phoneService';
import { emailService } from '@/services/emailService';
import { websiteService } from '@/services/websiteService';
import { verificationStorage } from '@/services/verificationStorage';
import { errorHandlingService, ApiError } from '@/services/errorHandlingService';
import { PhoneVerificationResult, EmailVerificationResult, WebsiteVerificationResult } from '@/types/verification';

export const useVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastError, setLastError] = useState<ApiError | null>(null);

  const verifyPhone = async (phone: string): Promise<PhoneVerificationResult | null> => {
    setIsLoading(true);
    setError(null);
    setLastError(null);
    
    try {
      console.log(`Iniciando verificación de teléfono: ${phone}`);
      const result = await phoneService.verifyPhone(phone);
      
      if (result) {
        console.log('Resultado de verificación obtenido, guardando en historial...');
        await verificationStorage.savePhoneVerification(phone, result);
        console.log('Verificación de teléfono guardada exitosamente en historial');
      }
      
      return result;
    } catch (err) {
      const apiError = errorHandlingService.handleError(err, 'numverify');
      setError(apiError.message);
      setLastError(apiError);
      console.error('Error en verificación de teléfono:', apiError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (email: string): Promise<EmailVerificationResult | null> => {
    setIsLoading(true);
    setError(null);
    setLastError(null);
    
    try {
      console.log(`Iniciando verificación de email: ${email}`);
      const result = await emailService.verifyEmail(email);
      
      if (result) {
        console.log('Resultado de verificación obtenido, guardando en historial...');
        await verificationStorage.saveEmailVerification(email, result);
        console.log('Verificación de email guardada exitosamente en historial');
      }
      
      return result;
    } catch (err) {
      const apiError = errorHandlingService.handleError(err, 'zerobounce');
      setError(apiError.message);
      setLastError(apiError);
      console.error('Error en verificación de email:', apiError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyWebsite = async (url: string): Promise<WebsiteVerificationResult | null> => {
    setIsLoading(true);
    setError(null);
    setLastError(null);
    
    try {
      console.log(`Iniciando verificación de sitio web: ${url}`);
      const result = await websiteService.verifyWebsite(url);
      
      if (result) {
        console.log('Resultado de verificación obtenido, guardando en historial...');
        await verificationStorage.saveWebsiteVerification(url, result);
        console.log('Verificación de sitio web guardada exitosamente en historial');
      }
      
      return result;
    } catch (err) {
      const apiError = errorHandlingService.handleError(err, 'similarweb');
      setError(apiError.message);
      setLastError(apiError);
      console.error('Error en verificación de sitio web:', apiError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const retryLastOperation = async (): Promise<boolean> => {
    if (!lastError || !errorHandlingService.isRecoverableError(lastError)) {
      return false;
    }

    const delay = errorHandlingService.getRetryDelay(lastError);
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    return true;
  };

  return {
    verifyPhone,
    verifyEmail,
    verifyWebsite,
    retryLastOperation,
    isLoading,
    error,
    lastError,
    canRetry: lastError ? errorHandlingService.isRecoverableError(lastError) : false
  };
};
