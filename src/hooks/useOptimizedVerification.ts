
import { useState, useCallback } from 'react';
import { phoneService } from '@/services/phoneService';
import { emailService } from '@/services/emailService';
import { websiteService } from '@/services/websiteService';
import { optimizedVerificationStorage } from '@/services/storage/OptimizedVerificationStorage';
import { errorHandlingService, ApiError } from '@/services/errorHandlingService';
import { PhoneVerificationResult, EmailVerificationResult, WebsiteVerificationResult } from '@/types/verification';
import { SecurityAudit } from '@/services/security/SecurityAudit';
import { PerformanceMonitor } from '@/services/optimization/PerformanceMonitor';

/**
 * Optimized Verification Hook - Mejoras de rendimiento y seguridad
 * Implementa cache, batch operations y auditoria
 */
export const useOptimizedVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastError, setLastError] = useState<ApiError | null>(null);
  
  const audit = SecurityAudit.getInstance();
  const monitor = PerformanceMonitor.getInstance();

  const verifyPhone = useCallback(async (phone: string): Promise<PhoneVerificationResult | null> => {
    const endTiming = monitor.startTiming('verify_phone_total');
    setIsLoading(true);
    setError(null);
    setLastError(null);
    
    try {
      console.log(`📞 Iniciando verificación de teléfono: ${phone}`);
      
      const result = await phoneService.verifyPhone(phone);
      
      if (result) {
        console.log('💾 Resultado obtenido, guardando en historial de forma optimizada...');
        
        // Guardar de forma asíncrona para no bloquear la UI
        const savePromise = optimizedVerificationStorage.savePhoneVerification(phone, result);
        
        // No esperamos el guardado, continúamos inmediatamente
        savePromise
          .then(() => console.log('✅ Verificación de teléfono guardada exitosamente'))
          .catch(err => console.error('❌ Error guardando en historial:', err));
        
        audit.logEvent({
          userId: 'current-user',
          action: 'PHONE_VERIFICATION_SUCCESS',
          resource: phone,
          success: true,
          riskLevel: 'LOW'
        });
      }
      
      return result;
    } catch (err) {
      const apiError = errorHandlingService.handleError(err, 'numverify');
      setError(apiError.message);
      setLastError(apiError);
      
      audit.logEvent({
        userId: 'current-user',
        action: 'PHONE_VERIFICATION_ERROR',
        resource: phone,
        success: false,
        riskLevel: 'MEDIUM',
        metadata: { error: apiError.message }
      });
      
      console.error('❌ Error en verificación de teléfono:', apiError);
      return null;
    } finally {
      setIsLoading(false);
      endTiming();
    }
  }, [audit, monitor]);

  const verifyEmail = useCallback(async (email: string): Promise<EmailVerificationResult | null> => {
    const endTiming = monitor.startTiming('verify_email_total');
    setIsLoading(true);
    setError(null);
    setLastError(null);
    
    try {
      console.log(`📧 Iniciando verificación de email: ${email}`);
      
      const result = await emailService.verifyEmail(email);
      
      if (result) {
        console.log('💾 Resultado obtenido, guardando en historial de forma optimizada...');
        
        // Guardar de forma asíncrona para no bloquear la UI
        const savePromise = optimizedVerificationStorage.saveEmailVerification(email, result);
        
        // No esperamos el guardado, continúamos inmediatamente
        savePromise
          .then(() => console.log('✅ Verificación de email guardada exitosamente'))
          .catch(err => console.error('❌ Error guardando en historial:', err));
        
        audit.logEvent({
          userId: 'current-user',
          action: 'EMAIL_VERIFICATION_SUCCESS',
          resource: email,
          success: true,
          riskLevel: 'LOW'
        });
      }
      
      return result;
    } catch (err) {
      const apiError = errorHandlingService.handleError(err, 'zerobounce');
      setError(apiError.message);
      setLastError(apiError);
      
      audit.logEvent({
        userId: 'current-user',
        action: 'EMAIL_VERIFICATION_ERROR',
        resource: email,
        success: false,
        riskLevel: 'MEDIUM',
        metadata: { error: apiError.message }
      });
      
      console.error('❌ Error en verificación de email:', apiError);
      return null;
    } finally {
      setIsLoading(false);
      endTiming();
    }
  }, [audit, monitor]);

  const verifyWebsite = useCallback(async (url: string): Promise<WebsiteVerificationResult | null> => {
    const endTiming = monitor.startTiming('verify_website_total');
    setIsLoading(true);
    setError(null);
    setLastError(null);
    
    try {
      console.log(`🌐 Iniciando verificación de sitio web: ${url}`);
      
      const result = await websiteService.verifyWebsite(url);
      
      if (result) {
        console.log('💾 Resultado obtenido, guardando en historial de forma optimizada...');
        
        // Guardar de forma asíncrona para no bloquear la UI
        const savePromise = optimizedVerificationStorage.saveWebsiteVerification(url, result);
        
        // No esperamos el guardado, continúamos inmediatamente
        savePromise
          .then(() => console.log('✅ Verificación de sitio web guardada exitosamente'))
          .catch(err => {
            console.error('❌ Error guardando en historial:', err);
            setError('Verificación completada pero no se pudo guardar en el historial');
          });
        
        audit.logEvent({
          userId: 'current-user',
          action: 'WEBSITE_VERIFICATION_SUCCESS',
          resource: url,
          success: true,
          riskLevel: 'LOW'
        });
      }
      
      return result;
    } catch (err) {
      const apiError = errorHandlingService.handleError(err, 'similarweb');
      setError(apiError.message);
      setLastError(apiError);
      
      audit.logEvent({
        userId: 'current-user',
        action: 'WEBSITE_VERIFICATION_ERROR',
        resource: url,
        success: false,
        riskLevel: 'MEDIUM',
        metadata: { error: apiError.message }
      });
      
      console.error('❌ Error en verificación de sitio web:', apiError);
      return null;
    } finally {
      setIsLoading(false);
      endTiming();
    }
  }, [audit, monitor]);

  const retryLastOperation = useCallback(async (): Promise<boolean> => {
    if (!lastError || !errorHandlingService.isRecoverableError(lastError)) {
      return false;
    }

    const delay = errorHandlingService.getRetryDelay(lastError);
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    return true;
  }, [lastError]);

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
