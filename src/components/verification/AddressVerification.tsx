
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addressService, AddressVerificationResult } from "@/services/addressService";
import { addressVerificationStorage } from "@/services/storage/AddressVerificationStorage";
import { useQueryClient } from "@tanstack/react-query";

export const AddressVerification = () => {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AddressVerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleVerify = async () => {
    if (!address.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa una dirección para verificar",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log(`🏠 Verificando dirección: ${address}`);
      
      const verificationResult = await addressService.verifyAddress(address);
      setResult(verificationResult);
      
      // Guardar en el historial
      try {
        await addressVerificationStorage.saveAddressVerification(address, verificationResult);
        
        // Invalidar queries para actualizar el historial
        queryClient.invalidateQueries({ queryKey: ['verification-stats'] });
        queryClient.invalidateQueries({ queryKey: ['recent-verifications'] });
        
        toast({
          title: "Verificación completada",
          description: `Dirección ${verificationResult.status === 'valid' ? 'válida' : 'inválida'} - Guardada en historial`,
        });
      } catch (saveError) {
        console.error('Error guardando en historial:', saveError);
        toast({
          title: "Verificación completada",
          description: "La verificación se completó pero no se pudo guardar en el historial",
          variant: "destructive"
        });
      }
      
    } catch (err) {
      console.error('Error en verificación:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al verificar la dirección');
      toast({
        title: "Error en verificación",
        description: "No se pudo verificar la dirección. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getLocationTypeDescription = (type: string) => {
    const descriptions: { [key: string]: string } = {
      'ROOFTOP': 'Ubicación exacta',
      'RANGE_INTERPOLATED': 'Interpolación de rango',
      'GEOMETRIC_CENTER': 'Centro geométrico',
      'APPROXIMATE': 'Aproximado'
    };
    return descriptions[type] || type;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Verificación de Direcciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ingresa la dirección a verificar (ej: Av. Providencia 1208, Santiago, Chile)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleVerify()}
            />
            <Button onClick={handleVerify} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Verificar
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Error:</span>
              </div>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          )}

          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {result.status === 'valid' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    Resultado de Verificación
                  </span>
                  <Badge variant={result.status === 'valid' ? 'default' : 'destructive'}>
                    {result.status === 'valid' ? 'Válida' : 'Inválida'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.formattedAddress && (
                  <div>
                    <h4 className="font-medium text-gray-700">Dirección Formateada:</h4>
                    <p className="text-gray-900">{result.formattedAddress}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Puntuación de Confianza:</h4>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getConfidenceColor(result.confidenceScore)}`}></div>
                      <span>{result.confidenceScore}%</span>
                    </div>
                  </div>

                  {result.locationType && (
                    <div>
                      <h4 className="font-medium text-gray-700">Tipo de Ubicación:</h4>
                      <p>{getLocationTypeDescription(result.locationType)}</p>
                    </div>
                  )}

                  {result.coordinates && (
                    <div>
                      <h4 className="font-medium text-gray-700">Coordenadas:</h4>
                      <p>{result.coordinates.lat.toFixed(6)}, {result.coordinates.lng.toFixed(6)}</p>
                    </div>
                  )}

                  {result.placeId && (
                    <div>
                      <h4 className="font-medium text-gray-700">Place ID:</h4>
                      <p className="text-sm text-gray-600 break-all">{result.placeId}</p>
                    </div>
                  )}
                </div>

                {Object.keys(result.components).length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Componentes de la Dirección:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(result.components).map(([key, value]) => (
                        value && (
                          <div key={key} className="text-sm">
                            <span className="font-medium text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                            </span>
                            <p className="text-gray-900">{value}</p>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {result.types.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Tipos:</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.types.map((type, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {type.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
