
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, CheckCircle, XCircle, Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { validatePhone, formatPhone } from "@/utils/validators";
import { PhoneVerificationResult } from "@/types/verification";
import { useToast } from "@/hooks/use-toast";
import { useVerification } from "@/hooks/useVerification";

interface PhoneVerificationProps {
  onVerificationComplete?: () => void;
}

export const PhoneVerification = ({ onVerificationComplete }: PhoneVerificationProps) => {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<PhoneVerificationResult | null>(null);
  const [validationError, setValidationError] = useState("");
  const [lastAttemptedPhone, setLastAttemptedPhone] = useState("");
  const { toast } = useToast();
  const { verifyPhone, retryLastOperation, isLoading, error, lastError, canRetry } = useVerification();

  const handleVerify = async () => {
    const formattedPhone = formatPhone(phone);
    const validation = validatePhone(formattedPhone);
    
    if (!validation.isValid) {
      setValidationError(validation.message || "");
      return;
    }

    setValidationError("");
    setLastAttemptedPhone(formattedPhone);
    
    const verificationResult = await verifyPhone(formattedPhone);
    
    if (verificationResult) {
      setResult(verificationResult);
      onVerificationComplete?.();
      toast({
        title: "Verificación completada",
        description: `Número ${verificationResult.status === 'valid' ? 'válido' : 'inválido'}`,
      });
    }
  };

  const handleRetry = async () => {
    if (canRetry && lastAttemptedPhone) {
      const canProceed = await retryLastOperation();
      if (canProceed) {
        const verificationResult = await verifyPhone(lastAttemptedPhone);
        if (verificationResult) {
          setResult(verificationResult);
          onVerificationComplete?.();
          toast({
            title: "Verificación completada",
            description: `Número ${verificationResult.status === 'valid' ? 'válido' : 'inválido'}`,
          });
        }
      }
    }
  };

  const displayError = validationError || error;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Verificación de Número de Teléfono
        </CardTitle>
        <CardDescription>
          Valida formato E.164 y verifica si el número está activo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Número de Teléfono</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="font-mono"
          />
          <p className="text-sm text-gray-500">
            Formato E.164: + seguido del código de país y número
          </p>
        </div>

        {displayError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{displayError}</span>
              {canRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  disabled={isLoading}
                  className="ml-2"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reintentar
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {lastError?.type === 'quota_exceeded' && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Plan de NumVerify agotado</p>
                <p className="text-sm">Contacta al administrador para renovar los créditos de verificación de teléfonos.</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={handleVerify} 
            disabled={isLoading || !phone}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <Phone className="mr-2 h-4 w-4" />
                Verificar Teléfono
              </>
            )}
          </Button>
          
          {canRetry && lastAttemptedPhone && (
            <Button 
              variant="outline"
              onClick={handleRetry} 
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {result && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                {result.status === 'valid' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                Resultado de Verificación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Estado:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    result.status === 'valid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {result.status === 'valid' ? 'Válido' : 'Inválido'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">País:</span>
                  <span className="ml-2">{result.details.country}</span>
                </div>
                <div>
                  <span className="font-medium">Operador:</span>
                  <span className="ml-2">{result.details.carrier}</span>
                </div>
                <div>
                  <span className="font-medium">Tipo:</span>
                  <span className="ml-2">{result.details.lineType}</span>
                </div>
                <div>
                  <span className="font-medium">Activo:</span>
                  <span className="ml-2">{result.details.isActive ? 'Sí' : 'No'}</span>
                </div>
                <div>
                  <span className="font-medium">Verificado:</span>
                  <span className="ml-2">{new Date(result.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
