
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { WebsiteAnalysisTabs } from "./WebsiteAnalysisTabs";

interface WebsiteVerificationDetailProps {
  verification: any;
}

export const WebsiteVerificationDetail = ({ verification }: WebsiteVerificationDetailProps) => {
  return (
    <div className="space-y-4">
      {verification.is_duplicate && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Sitio Duplicado:</strong> Este sitio web ya ha sido verificado anteriormente.
            {verification.duplicate_details?.original_date && (
              <div className="mt-2 text-sm">
                Verificación original: {new Date(verification.duplicate_details.original_date).toLocaleDateString()}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {verification.imitation_analysis?.is_potential_imitation && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Posible Imitación Detectada:</strong> Este sitio presenta características que sugieren que podría ser una imitación.
            {verification.imitation_analysis.target_brand && (
              <div className="mt-1">Posible imitación de: <strong>{verification.imitation_analysis.target_brand}</strong></div>
            )}
            <div className="mt-1">Score de imitación: <strong>{verification.imitation_analysis.imitation_score}/100</strong></div>
          </AlertDescription>
        </Alert>
      )}

      <WebsiteAnalysisTabs verification={verification} />
    </div>
  );
};
