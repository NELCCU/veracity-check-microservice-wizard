
import { useState } from 'react';
import { phoneService } from '@/services/phoneService';
import { emailService } from '@/services/emailService';
import { websiteService } from '@/services/websiteService';
import { PhoneVerificationResult, EmailVerificationResult, WebsiteVerificationResult } from '@/types/verification';

export const useVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyPhone = async (phone: string): Promise<PhoneVerificationResult | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await phoneService.verifyPhone(phone);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (email: string): Promise<EmailVerificationResult | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await emailService.verifyEmail(email);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyWebsite = async (url: string): Promise<WebsiteVerificationResult | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await websiteService.verifyWebsite(url);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verifyPhone,
    verifyEmail,
    verifyWebsite,
    isLoading,
    error
  };
};
