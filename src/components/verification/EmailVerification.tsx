
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { useOptimizedVerification } from "@/hooks/useOptimizedVerification";
import { validateEmail } from "@/utils/validators";
import { EmailVerificationResult } from "@/types/verification";

export const EmailVerification = () => {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<EmailVerificationResult | null>(null);
  const [validationError, setValidationError] = useState<string>("");
  
  const { verifyEmail, isLoading, error } = useOptimizedVerification();

  const handleVerify = async () => {
    // Validación del formato
    const validation = validateEmail(email);
    if (!validation.isValid) {
      setValidationError(validation.message || "Formato inválido");
      return;
    }

    setValidationError("");
    setResult(null);

    const verificationResult = await verifyEmail(email);
    if (verificationResult) {
      setResult(verificationResult);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'invalid':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'invalid':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Verificación de Email
        </CardTitle>
        <CardDescription>
          Verifica la validez y entregabilidad de direcciones de correo electrónico
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Dirección de Email</Label>
          <div className="flex space-x-2">
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@dominio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={validationError ? "border-red-500" : ""}
              disabled={isLoading}
            />
            <Button 
              onClick={handleVerify} 
              disabled={isLoading || !email.trim()}
              className="min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Verificar'
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

        {result && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Resultado de Verificación</h3>
              <Badge className={getStatusColor(result.status)}>
                {getStatusIcon(result.status)}
                <span className="ml-1">
                  {result.status === 'valid' ? 'Válido' : 'Inválido'}
                </span>
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Dominio</p>
                <p className="text-sm">{result.details.domain || 'No disponible'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Entregable</p>
                <p className="text-sm">
                  {result.details.isDeliverable ? 'Sí' : 'No'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Desechable</p>
                <p className="text-sm">
                  {result.details.isDisposable ? 'Sí' : 'No'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Registros MX</p>
                <p className="text-sm">
                  {result.details.mxRecords ? 'Encontrados' : 'No encontrados'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
