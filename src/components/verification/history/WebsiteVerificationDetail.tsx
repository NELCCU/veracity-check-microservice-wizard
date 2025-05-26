
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { WebsiteAnalysisTabs } from "./WebsiteAnalysisTabs";

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

  const duplicateDetails = parseJsonField(verification.duplicate_details, {});
  const imitationAnalysis = parseJsonField(verification.imitation_analysis, {});

  console.log('🔍 Verification data:', verification);
  console.log('📋 Duplicate details:', duplicateDetails);
  console.log('🎭 Imitation analysis:', imitationAnalysis);

  return (
    <div className="space-y-4">
      {verification.is_duplicate && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Sitio Duplicado:</strong> Este sitio web ya ha sido verificado anteriormente.
            {duplicateDetails?.original_date && (
              <div className="mt-2 text-sm">
                Verificación original: {new Date(duplicateDetails.original_date).toLocaleDateString()}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {imitationAnalysis?.is_potential_imitation && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Posible Imitación Detectada:</strong> Este sitio presenta características que sugieren que podría ser una imitación.
            {imitationAnalysis.target_brand && (
              <div className="mt-1">Posible imitación de: <strong>{imitationAnalysis.target_brand}</strong></div>
            )}
            <div className="mt-1">Score de imitación: <strong>{imitationAnalysis.imitation_score}/100</strong></div>
          </AlertDescription>
        </Alert>
      )}

      <WebsiteAnalysisTabs verification={verification} />
    </div>
  );
};
