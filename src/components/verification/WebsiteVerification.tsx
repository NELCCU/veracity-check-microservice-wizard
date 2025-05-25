
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Globe, CheckCircle, XCircle, Loader2, Copy, TrendingUp } from "lucide-react";
import { validateUrl, formatUrl } from "@/utils/validators";
import { WebsiteVerificationResult } from "@/types/verification";
import { useToast } from "@/hooks/use-toast";

export const WebsiteVerification = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WebsiteVerificationResult | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleVerify = async () => {
    const formattedUrl = formatUrl(url);
    const validation = validateUrl(formattedUrl);
    
    if (!validation.isValid) {
      setError(validation.message || "");
      return;
    }

    setError("");
    setIsLoading(true);
    
    try {
      // Simulación de verificación (aquí iría la integración real con Supabase/API)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResult: WebsiteVerificationResult = {
        status: Math.random() > 0.1 ? 'valid' : 'invalid',
        isDuplicate: Math.random() > 0.7,
        traffic: {
          monthlyVisits: Math.floor(Math.random() * 1000000),
          ranking: Math.floor(Math.random() * 100000),
          category: "Technology"
        },
        details: {
          httpStatus: 200,
          responseTime: Math.floor(Math.random() * 2000),
          ssl: true
        },
        timestamp: new Date().toISOString()
      };
      
      setResult(mockResult);
      toast({
        title: "Verificación completada",
        description: `Sitio web ${mockResult.status === 'valid' ? 'válido' : 'inválido'}`,
      });
      
    } catch (err) {
      setError("Error al verificar el sitio web");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Verificación de Sitio Web
        </CardTitle>
        <CardDescription>
          Verifica accesibilidad, detecta duplicados y estima tráfico
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

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
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
              Verificando...
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Verificar Sitio Web
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
            <CardContent className="space-y-4">
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
                <div className="flex items-center gap-1">
                  <span className="font-medium">Duplicado:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    result.isDuplicate 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {result.isDuplicate ? 'Sí' : 'No'}
                  </span>
                  {result.isDuplicate && <Copy className="h-4 w-4 text-orange-500" />}
                </div>
                <div>
                  <span className="font-medium">Código HTTP:</span>
                  <span className="ml-2">{result.details.httpStatus}</span>
                </div>
                <div>
                  <span className="font-medium">Tiempo Respuesta:</span>
                  <span className="ml-2">{result.details.responseTime}ms</span>
                </div>
                <div>
                  <span className="font-medium">SSL:</span>
                  <span className="ml-2">{result.details.ssl ? 'Activo' : 'Inactivo'}</span>
                </div>
                <div>
                  <span className="font-medium">Verificado:</span>
                  <span className="ml-2">{new Date(result.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {result.traffic && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      Métricas de Tráfico
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Visitas Mensuales:</span>
                        <span className="ml-2">{result.traffic.monthlyVisits?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="font-medium">Ranking Global:</span>
                        <span className="ml-2">#{result.traffic.ranking?.toLocaleString()}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Categoría:</span>
                        <span className="ml-2">{result.traffic.category}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
