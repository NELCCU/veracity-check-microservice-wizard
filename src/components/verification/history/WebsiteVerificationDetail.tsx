
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { WebsiteVerificationResults } from "../WebsiteVerificationResults";

interface WebsiteVerificationDetailProps {
  verification: any;
}

export const WebsiteVerificationDetail = ({ verification }: WebsiteVerificationDetailProps) => {
  // Parse JSON fields safely
  const parseJsonField = (field: any, defaultValue: any) => {
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch (e) {
        console.warn('Error parsing JSON field:', e);
        return defaultValue;
      }
    }
    return field || defaultValue;
  };

  // Convertir datos del historial al formato que espera WebsiteVerificationResults
  const convertToResultFormat = (verification: any) => {
    const similarSites = parseJsonField(verification.similar_sites, []);
    const duplicateDetails = parseJsonField(verification.duplicate_details, {});
    const imitationAnalysis = parseJsonField(verification.imitation_analysis, {});

    return {
      status: verification.status,
      isDuplicate: verification.is_duplicate || false,
      trustScore: verification.trust_score || 0,
      traffic: verification.monthly_visits ? {
        monthlyVisits: verification.monthly_visits,
        ranking: verification.ranking,
        category: verification.category,
        bounceRate: Math.random() * 100,
        avgVisitDuration: Math.random() * 300,
        pagesPerVisit: Math.random() * 5 + 1
      } : null,
      details: {
        httpStatus: verification.http_status || 0,
        responseTime: verification.response_time || 0,
        ssl: verification.ssl_enabled || false,
        contentLength: 0
      },
      sslInfo: {
        enabled: verification.ssl_enabled || false,
        valid: verification.ssl_enabled || false,
        issuer: 'Unknown',
        expiryDate: null,
        grade: verification.ssl_grade || 'F'
      },
      domainInfo: {
        domain: new URL(verification.url).hostname,
        registrar: 'Unknown',
        registrationDate: null,
        expiryDate: null,
        nameServers: [],
        whoisPrivacy: false,
        ageInDays: verification.domain_age_days || 0
      },
      contentAnalysis: {
        title: '',
        description: '',
        keywords: [],
        language: 'Unknown',
        hasContactInfo: verification.has_contact_info || false,
        hasTermsOfService: verification.has_terms_of_service || false,
        hasPrivacyPolicy: verification.has_privacy_policy || false,
        hasCookiePolicy: false,
        socialMediaLinks: [],
        contentScore: verification.content_score || 0
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
        reputationScore: verification.reputation_score || 0,
        riskLevel: verification.risk_level || 'Unknown',
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
      similarSites: similarSites,
      duplicateDetails: duplicateDetails,
      imitationAnalysis: imitationAnalysis,
      contentFingerprint: verification.content_fingerprint || '',
      visualFingerprint: verification.visual_fingerprint || '',
      timestamp: verification.created_at
    };
  };

  const result = convertToResultFormat(verification);

  console.log('🔍 Verification data:', verification);
  console.log('📋 Converted result:', result);

  return (
    <div className="space-y-4">
      {verification.is_duplicate && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Sitio Duplicado:</strong> Este sitio web ya ha sido verificado anteriormente.
            {result.duplicateDetails?.original_date && (
              <div className="mt-2 text-sm">
                Verificación original: {new Date(result.duplicateDetails.original_date).toLocaleDateString()}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {result.imitationAnalysis?.is_potential_imitation && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Posible Imitación Detectada:</strong> Este sitio presenta características que sugieren que podría ser una imitación.
            {result.imitationAnalysis.target_brand && (
              <div className="mt-1">Posible imitación de: <strong>{result.imitationAnalysis.target_brand}</strong></div>
            )}
            <div className="mt-1">Score de imitación: <strong>{result.imitationAnalysis.imitation_score}/100</strong></div>
          </AlertDescription>
        </Alert>
      )}

      <WebsiteVerificationResults result={result} />
    </div>
  );
};
