
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { BatchVerificationResult } from "@/types/verification";
import { BatchVerificationSummary } from "./BatchVerificationSummary";
import { BatchVerificationResultList } from "./BatchVerificationResultList";

interface BatchVerificationResultsProps {
  result: BatchVerificationResult;
  originalInputs: {
    phones: string;
    emails: string;
    websites: string;
  };
}

export const BatchVerificationResults = ({ result, originalInputs }: BatchVerificationResultsProps) => {
  const phoneInputs = originalInputs.phones.split('\n').filter(p => p.trim());
  const emailInputs = originalInputs.emails.split('\n').filter(e => e.trim());
  const websiteInputs = originalInputs.websites.split('\n').filter(w => w.trim());

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Resultados de Verificación en Lote
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <BatchVerificationSummary 
          total={result.summary.total}
          valid={result.summary.valid}
          invalid={result.summary.invalid}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BatchVerificationResultList
            title="Teléfonos"
            results={result.phones}
            originalInputs={phoneInputs}
            getDisplayValue={(result) => result.details.format}
          />

          <BatchVerificationResultList
            title="Emails"
            results={result.emails}
            originalInputs={emailInputs}
            getDisplayValue={(_, index) => emailInputs[index]}
          />

          <BatchVerificationResultList
            title="Sitios Web"
            results={result.websites}
            originalInputs={websiteInputs}
            getDisplayValue={(_, index) => websiteInputs[index]}
          />
        </div>
      </CardContent>
    </Card>
  );
};
