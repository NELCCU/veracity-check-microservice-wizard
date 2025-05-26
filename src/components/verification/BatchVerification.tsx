
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";
import { BatchVerificationForm } from "./batch/BatchVerificationForm";
import { BatchVerificationResults } from "./batch/BatchVerificationResults";
import { useBatchVerification } from "@/hooks/useBatchVerification";

export const BatchVerification = () => {
  const {
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
  } = useBatchVerification();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Verificación en Lote
        </CardTitle>
        <CardDescription>
          Verifica múltiples teléfonos, emails y sitios web simultáneamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <BatchVerificationForm
          phones={phones}
          emails={emails}
          websites={websites}
          isLoading={isLoading}
          error={error}
          onPhonesChange={setPhones}
          onEmailsChange={setEmails}
          onWebsitesChange={setWebsites}
          onSubmit={handleBatchVerify}
        />

        {result && (
          <BatchVerificationResults
            result={result}
            originalInputs={{ phones, emails, websites }}
          />
        )}
      </CardContent>
    </Card>
  );
};
