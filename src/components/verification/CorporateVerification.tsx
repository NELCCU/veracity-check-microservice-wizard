
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Building2, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { corporateService } from '@/services/corporateService';
import { CorporateVerificationResult } from '@/types/corporate';
import { useToast } from '@/hooks/use-toast';
import { CorporateVerificationResults } from './CorporateVerificationResults';

export const CorporateVerification = () => {
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [country, setCountry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CorporateVerificationResult | null>(null);
  const { toast } = useToast();

  const handleVerification = async () => {
    if (!companyName.trim() || !taxId.trim() || !country) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('🏢 Iniciando verificación corporativa...');
      const verificationResult = await corporateService.verifyCorporateEntity(
        companyName.trim(),
        taxId.trim(),
        country
      );
      
      setResult(verificationResult);
      toast({
        title: "Verificación completada",
        description: `Entidad corporativa ${companyName} verificada exitosamente`,
      });
    } catch (error) {
      console.error('Error en verificación:', error);
      toast({
        title: "Error en verificación",
        description: error.message || "Error al verificar la entidad corporativa",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'under_review':
        return <Shield className="h-5 w-5 text-yellow-500" />;
      default:
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprobado';
      case 'rejected':
        return 'Rechazado';
      case 'under_review':
        return 'En Revisión';
      default:
        return 'Pendiente';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'under_review':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Verificación de Entidad Corporativa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nombre de la Empresa *</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Ej: Global66 S.A."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxId">Identificación Fiscal *</Label>
              <Input
                id="taxId"
                type="text"
                placeholder="Ej: 76.123.456-7"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">País *</Label>
            <Select value={country} onValueChange={setCountry} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el país" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Colombia">Colombia</SelectItem>
                <SelectItem value="Chile">Chile</SelectItem>
                <SelectItem value="Peru">Perú</SelectItem>
                <SelectItem value="Mexico">México</SelectItem>
                <SelectItem value="Spain">España</SelectItem>
                <SelectItem value="USA">Estados Unidos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleVerification} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Iniciar Due Diligence Reforzada
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Resultado de la Verificación</span>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(result.corporate_verification.status)}`}>
                {getStatusIcon(result.corporate_verification.status)}
                <span className="text-sm font-medium">
                  {getStatusText(result.corporate_verification.status)}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CorporateVerificationResults result={result} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
