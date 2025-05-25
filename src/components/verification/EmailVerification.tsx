
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle, XCircle, Loader2, Shield } from "lucide-react";
import { validateEmail, formatEmail } from "@/utils/validators";
import { EmailVerificationResult } from "@/types/verification";
import { useToast } from "@/hooks/use-toast";

export const EmailVerification = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EmailVerificationResult | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleVerify = async () => {
    const formattedEmail = formatEmail(email);
    const validation = validateEmail(formattedEmail);
    
    if (!validation.isValid) {
      setError(validation.message || "");
      return;
    }

    setError("");
    setIsLoading(true);
    
    try {
      // Simulación de verificación (aquí iría la integración real con Supabase/API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult: EmailVerificationResult = {
        status: Math.random() > 0.2 ? 'valid' : 'invalid',
        details: {
          isDeliverable: true,
          isDisposable: Math.random() > 0.8,
          domain: formattedEmail.split('@')[1],
          mxRecords: true,
          smtpCheck: true
        },
        timestamp: new Date().toISOString()
      };
      
      setResult(mockResult);
      toast({
        title: "Verificación completada",
        description: `Email ${mockResult.status === 'valid' ? 'válido' : 'inválido'}`,
      });
      
    } catch (err) {
      setError("Error al verificar el correo electrónico");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Verificación de Correo Electrónico
        </CardTitle>
        <CardDescription>
          Valida formato RFC 5322, registros MX y entregabilidad
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="usuario@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-sm text-gray-500">
            Formato estándar de correo electrónico
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleVerify} 
          disabled={isLoading || !email}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Verificar Email
            </>
          )}
        </Button>

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
                  <span className="font-medium">Dominio:</span>
                  <span className="ml-2">{result.details.domain}</span>
                </div>
                <div>
                  <span className="font-medium">Entregable:</span>
                  <span className="ml-2">{result.details.isDeliverable ? 'Sí' : 'No'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Desechable:</span>
                  <span className="ml-2">{result.details.isDisposable ? 'Sí' : 'No'}</span>
                  {result.details.isDisposable && <Shield className="h-4 w-4 text-orange-500" />}
                </div>
                <div>
                  <span className="font-medium">Registros MX:</span>
                  <span className="ml-2">{result.details.mxRecords ? 'Válidos' : 'Inválidos'}</span>
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
