
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { validatePhone, formatPhone } from "@/utils/validators";
import { PhoneVerificationResult } from "@/types/verification";
import { useToast } from "@/hooks/use-toast";

export const PhoneVerification = () => {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PhoneVerificationResult | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleVerify = async () => {
    const formattedPhone = formatPhone(phone);
    const validation = validatePhone(formattedPhone);
    
    if (!validation.isValid) {
      setError(validation.message || "");
      return;
    }

    setError("");
    setIsLoading(true);
    
    try {
      // Simulación de verificación (aquí iría la integración real con Supabase/API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult: PhoneVerificationResult = {
        status: Math.random() > 0.3 ? 'valid' : 'invalid',
        details: {
          country: "Estados Unidos",
          carrier: "Verizon",
          lineType: "Mobile",
          isActive: true,
          format: formattedPhone
        },
        timestamp: new Date().toISOString()
      };
      
      setResult(mockResult);
      toast({
        title: "Verificación completada",
        description: `Número ${mockResult.status === 'valid' ? 'válido' : 'inválido'}`,
      });
      
    } catch (err) {
      setError("Error al verificar el número de teléfono");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleVerify} 
          disabled={isLoading || !phone}
          className="w-full"
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
