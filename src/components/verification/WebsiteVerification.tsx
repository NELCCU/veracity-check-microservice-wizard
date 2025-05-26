
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Globe, XCircle, Loader2 } from "lucide-react";
import { validateUrl, formatUrl } from "@/utils/validators";
import { WebsiteVerificationResult } from "@/types/verification";
import { useToast } from "@/hooks/use-toast";
import { useVerification } from "@/hooks/useVerification";
import { WebsiteVerificationResults } from "./WebsiteVerificationResults";

interface WebsiteVerificationProps {
  onVerificationComplete?: () => void;
}

export const WebsiteVerification = ({ onVerificationComplete }: WebsiteVerificationProps) => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<WebsiteVerificationResult | null>(null);
  const [validationError, setValidationError] = useState("");
  const { toast } = useToast();
  const { verifyWebsite, isLoading, error } = useVerification();

  const handleVerify = async () => {
    const formattedUrl = formatUrl(url);
    const validation = validateUrl(formattedUrl);
    
    if (!validation.isValid) {
      setValidationError(validation.message || "");
      return;
    }

    setValidationError("");
    
    const verificationResult = await verifyWebsite(formattedUrl);
    
    if (verificationResult) {
      setResult(verificationResult);
      onVerificationComplete?.();
      
      // Toast personalizado basado en los resultados
      if (verificationResult.isDuplicate) {
        toast({
          title: "Sitio duplicado detectado",
          description: `Este sitio ya fue verificado anteriormente. Score de confianza: ${verificationResult.trustScore}/100`,
          variant: "destructive"
        });
      } else if (verificationResult.imitationAnalysis.is_potential_imitation) {
        toast({
          title: "Posible imitación detectada",
          description: `Se detectaron indicios de imitación. Score de confianza: ${verificationResult.trustScore}/100`,
          variant: "destructive"
        });
      } else if (verificationResult.similarSites.length > 0) {
        toast({
          title: "Sitios similares encontrados",
          description: `Se encontraron ${verificationResult.similarSites.length} sitios similares. Score de confianza: ${verificationResult.trustScore}/100`,
        });
      } else {
        toast({
          title: "Verificación completada",
          description: `Análisis de debida diligencia completado - Score de confianza: ${verificationResult.trustScore}/100`,
        });
      }
    }
  };

  const displayError = validationError || error;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Verificación Reforzada de Sitio Web
        </CardTitle>
        <CardDescription>
          Análisis completo de debida diligencia: accesibilidad, seguridad, contenido, dominio, reputación y detección de duplicados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">URL del Sitio Web</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://ejemplo.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <p className="text-sm text-gray-500">
            URL completa incluyendo protocolo (http:// o https://)
          </p>
        </div>

        {displayError && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{displayError}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleVerify} 
          disabled={isLoading || !url}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analizando...
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Realizar Análisis Completo
            </>
          )}
        </Button>

        {result && <WebsiteVerificationResults result={result} />}
      </CardContent>
    </Card>
  );
};
