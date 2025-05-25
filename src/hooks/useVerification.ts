
import { useState } from 'react';
import { phoneService } from '@/services/phoneService';
import { emailService } from '@/services/emailService';
import { websiteService } from '@/services/websiteService';
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
      const result = await phoneService.verifyPhone(phone);
      return result;
    } catch (err) {
      const apiError = errorHandlingService.handleError(err, 'numverify');
      setError(apiError.message);
      setLastError(apiError);
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
      const result = await emailService.verifyEmail(email);
      return result;
    } catch (err) {
      const apiError = errorHandlingService.handleError(err, 'zerobounce');
      setError(apiError.message);
      setLastError(apiError);
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
      const result = await websiteService.verifyWebsite(url);
      return result;
    } catch (err) {
      const apiError = errorHandlingService.handleError(err, 'similarweb');
      setError(apiError.message);
      setLastError(apiError);
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
