
import { useState } from "react";
import { validatePhone, validateEmail, validateUrl, formatPhone, formatEmail, formatUrl } from "@/utils/validators";
import { BatchVerificationResult } from "@/types/verification";
import { useToast } from "@/hooks/use-toast";
import { batchService } from "@/services/batchService";
import { verificationStorage } from "@/services/verificationStorage";

export const useBatchVerification = () => {
  const [phones, setPhones] = useState("");
  const [emails, setEmails] = useState("");
  const [websites, setWebsites] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BatchVerificationResult | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleBatchVerify = async () => {
    const phoneList = phones.split('\n').filter(p => p.trim()).map(p => formatPhone(p.trim()));
    const emailList = emails.split('\n').filter(e => e.trim()).map(e => formatEmail(e.trim()));
    const websiteList = websites.split('\n').filter(w => w.trim()).map(w => formatUrl(w.trim()));

    if (phoneList.length === 0 && emailList.length === 0 && websiteList.length === 0) {
      setError("Debe proporcionar al menos un elemento para verificar");
      return;
    }

    // Validar formatos
    const invalidPhones = phoneList.filter(p => !validatePhone(p).isValid);
    const invalidEmails = emailList.filter(e => !validateEmail(e).isValid);
    const invalidWebsites = websiteList.filter(w => !validateUrl(w).isValid);

    if (invalidPhones.length > 0 || invalidEmails.length > 0 || invalidWebsites.length > 0) {
      setError(`Formatos inválidos encontrados: ${invalidPhones.length} teléfonos, ${invalidEmails.length} emails, ${invalidWebsites.length} sitios web`);
      return;
    }

    setError("");
    setIsLoading(true);
    
    try {
      const batchRequest = {
        phones: phoneList.length > 0 ? phoneList : undefined,
        emails: emailList.length > 0 ? emailList : undefined,
        websites: websiteList.length > 0 ? websiteList : undefined
      };

      const batchResult = await batchService.verifyBatch(batchRequest);
      
      // Guardar cada resultado en el historial después de recibir la respuesta
      await saveVerificationResults(batchResult, phoneList, emailList, websiteList);
      
      setResult(batchResult);
      toast({
        title: "Verificación en lote completada",
        description: `${batchResult.summary.valid} válidos, ${batchResult.summary.invalid} inválidos`,
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al realizar la verificación en lote");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveVerificationResults = async (
    batchResult: BatchVerificationResult,
    phoneList: string[],
    emailList: string[],
    websiteList: string[]
  ) => {
    try {
      console.log('💾 Guardando resultados de verificación en lote en historial...');
      
      // Guardar teléfonos
      if (batchResult.phones && phoneList.length > 0) {
        for (let i = 0; i < phoneList.length; i++) {
          const phone = phoneList[i];
          const result = batchResult.phones[i];
          const phoneResult = {
            status: result.status,
            details: {
              country: result.details.country,
              carrier: result.details.carrier,
              lineType: result.details.lineType,
              isActive: result.details.isActive,
              format: result.details.format
            },
            timestamp: result.timestamp
          };
          await verificationStorage.savePhoneVerification(phone, phoneResult);
        }
      }

      // Guardar emails
      if (batchResult.emails && emailList.length > 0) {
        for (let i = 0; i < emailList.length; i++) {
          const email = emailList[i];
          const result = batchResult.emails[i];
          const emailResult = {
            status: result.status,
            details: {
              domain: result.details.domain,
              isDeliverable: result.details.isDeliverable,
              isDisposable: result.details.isDisposable,
              mxRecords: result.details.mxRecords,
              smtpCheck: result.details.smtpCheck
            },
            timestamp: result.timestamp
          };
          await verificationStorage.saveEmailVerification(email, emailResult);
        }
      }

      // Guardar sitios web
      if (batchResult.websites && websiteList.length > 0) {
        for (let i = 0; i < websiteList.length; i++) {
          const website = websiteList[i];
          const result = batchResult.websites[i];
          // Convertir el resultado del lote al formato completo de WebsiteVerificationResult
          const websiteResult = {
            status: result.status,
            isDuplicate: result.isDuplicate,
            trustScore: result.trustScore || 0,
            traffic: result.traffic,
            details: result.details,
            sslInfo: {
              enabled: result.details.ssl || false,
              valid: result.details.ssl || false,
              issuer: 'Unknown',
              expiryDate: null,
              grade: 'F'
            },
            domainInfo: {
              domain: new URL(website).hostname,
              registrar: 'Unknown',
              registrationDate: null,
              expiryDate: null,
              nameServers: [],
              whoisPrivacy: false,
              ageInDays: 0
            },
            contentAnalysis: {
              title: '',
              description: '',
              keywords: [],
              language: 'Unknown',
              hasContactInfo: false,
              hasTermsOfService: false,
              hasPrivacyPolicy: false,
              hasCookiePolicy: false,
              socialMediaLinks: [],
              contentScore: 0
            },
            technologyStack: {
              framework: 'Unknown',
              cms: 'Unknown',
              server: 'Unknown',
              analytics: [],
              technologies: [],
              jsLibraries: []
            },
            securityAnalysis: {
              blacklisted: false,
              malwareDetected: false,
              phishingRisk: false,
              reputationScore: 0,
              riskLevel: 'Low' as const,
              securityHeaders: {
                hasXFrameOptions: false,
                hasCSP: false,
                hasHSTS: false
              }
            },
            responseHeaders: {
              server: 'Unknown',
              contentType: 'Unknown',
              lastModified: null,
              cacheControl: null,
              xFrameOptions: null,
              contentSecurityPolicy: null,
              strictTransportSecurity: null
            },
            similarSites: [],
            duplicateDetails: {
              exact_match: false,
              differences: []
            },
            imitationAnalysis: {
              is_potential_imitation: false,
              imitation_score: 0,
              suspicious_elements: [],
              legitimate_indicators: []
            },
            contentFingerprint: '',
            visualFingerprint: '',
            timestamp: result.timestamp
          };
          await verificationStorage.saveWebsiteVerification(website, websiteResult);
        }
      }

      console.log('✅ Todos los resultados de verificación en lote guardados en historial');
    } catch (saveError) {
      console.error('❌ Error guardando resultados en historial:', saveError);
      // No bloquear la UI por errores de guardado
    }
  };

  return {
    phones,
    emails,
    websites,
    isLoading,
    result,
    error,
    setPhones,
    setEmails,
    setWebsites,
    handleBatchVerify
  };
};
