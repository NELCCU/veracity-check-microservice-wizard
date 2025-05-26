
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Globe, Loader2 } from "lucide-react";
import { useOptimizedVerification } from "@/hooks/useOptimizedVerification";
import { validateUrl } from "@/utils/validators";
import { WebsiteVerificationResult } from "@/types/verification";
import { WebsiteVerificationResults } from "./WebsiteVerificationResults";

export const WebsiteVerification = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<WebsiteVerificationResult | null>(null);
  const [validationError, setValidationError] = useState<string>("");
  
  const { verifyWebsite, isLoading, error } = useOptimizedVerification();

  const handleVerify = async () => {
    // Validación del formato
    const validation = validateUrl(url);
    if (!validation.isValid) {
      setValidationError(validation.message || "Formato inválido");
      return;
    }

    setValidationError("");
    setResult(null);

    const verificationResult = await verifyWebsite(url);
    if (verificationResult) {
      setResult(verificationResult);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Verificación de Sitio Web
          </CardTitle>
          <CardDescription>
            Analiza la seguridad, confiabilidad y legitimidad de sitios web
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL del Sitio Web</Label>
            <div className="flex space-x-2">
              <Input
                id="url"
                type="url"
                placeholder="https://ejemplo.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={validationError ? "border-red-500" : ""}
                disabled={isLoading}
              />
              <Button 
                onClick={handleVerify} 
                disabled={isLoading || !url.trim()}
                className="min-w-[100px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analizando...
                  </>
                ) : (
                  'Analizar'
                )}
              </Button>
            </div>
            {validationError && (
              <p className="text-sm text-red-600">{validationError}</p>
            )}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {result && (
        <WebsiteVerificationResults result={result} />
      )}
    </div>
  );
};
