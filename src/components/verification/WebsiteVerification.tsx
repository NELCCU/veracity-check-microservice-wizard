
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, CheckCircle, XCircle, Loader2, Copy, TrendingUp, Shield, Lock, AlertTriangle, Clock, Server, FileText } from "lucide-react";
import { validateUrl, formatUrl } from "@/utils/validators";
import { WebsiteVerificationResult } from "@/types/verification";
import { useToast } from "@/hooks/use-toast";
import { useVerification } from "@/hooks/useVerification";

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
      toast({
        title: "Verificación completada",
        description: `Análisis de debida diligencia completado - Score de confianza: ${verificationResult.trustScore}/100`,
      });
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return "text-green-600 bg-green-100";
      case 'Medium': return "text-yellow-600 bg-yellow-100";
      case 'High': return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
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
          Análisis completo de debida diligencia: accesibilidad, seguridad, contenido, dominio y reputación
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

        {result && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {result.status === 'valid' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  Resultado del Análisis de Debida Diligencia
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={`px-3 py-1 ${getTrustScoreColor(result.trustScore)}`}>
                    Score: {result.trustScore}/100
                  </Badge>
                  <Badge className={getRiskLevelColor(result.securityAnalysis.riskLevel)}>
                    Riesgo: {result.securityAnalysis.riskLevel}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="overview">Resumen</TabsTrigger>
                  <TabsTrigger value="security">Seguridad</TabsTrigger>
                  <TabsTrigger value="domain">Dominio</TabsTrigger>
                  <TabsTrigger value="content">Contenido</TabsTrigger>
                  <TabsTrigger value="traffic">Tráfico</TabsTrigger>
                  <TabsTrigger value="technical">Técnico</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Estado:</span>
                      <Badge className={`ml-2 ${result.status === 'valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {result.status === 'valid' ? 'Válido' : 'Inválido'}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Duplicado:</span>
                      <Badge className={`ml-2 ${result.isDuplicate ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                        {result.isDuplicate ? 'Sí' : 'No'}
                      </Badge>
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
                      <span className="font-medium">SSL/TLS:</span>
                      <Badge className={`ml-2 ${result.sslInfo.enabled && result.sslInfo.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {result.sslInfo.enabled ? `Activo (${result.sslInfo.grade})` : 'Inactivo'}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Edad del Dominio:</span>
                      <span className="ml-2">{Math.floor(result.domainInfo.ageInDays / 365)} años</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Shield className="h-4 w-4 text-blue-600" />
                        Análisis de Seguridad
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Score de Reputación:</span>
                          <span className="ml-2">{result.securityAnalysis.reputationScore}/100</span>
                        </div>
                        <div>
                          <span className="font-medium">Nivel de Riesgo:</span>
                          <Badge className={`ml-2 ${getRiskLevelColor(result.securityAnalysis.riskLevel)}`}>
                            {result.securityAnalysis.riskLevel}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium">Lista Negra:</span>
                          <span className={`ml-2 ${result.securityAnalysis.blacklisted ? 'text-red-600' : 'text-green-600'}`}>
                            {result.securityAnalysis.blacklisted ? 'Sí' : 'No'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Riesgo de Phishing:</span>
                          <span className={`ml-2 ${result.securityAnalysis.phishingRisk ? 'text-red-600' : 'text-green-600'}`}>
                            {result.securityAnalysis.phishingRisk ? 'Alto' : 'Bajo'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Headers de Seguridad:</h4>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <Badge variant={result.securityAnalysis.securityHeaders.hasXFrameOptions ? "default" : "secondary"}>
                            X-Frame-Options
                          </Badge>
                          <Badge variant={result.securityAnalysis.securityHeaders.hasCSP ? "default" : "secondary"}>
                            CSP
                          </Badge>
                          <Badge variant={result.securityAnalysis.securityHeaders.hasHSTS ? "default" : "secondary"}>
                            HSTS
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="domain" className="space-y-4">
                  <Card className="bg-purple-50 border-purple-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Globe className="h-4 w-4 text-purple-600" />
                        Información del Dominio
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Dominio:</span>
                          <span className="ml-2">{result.domainInfo.domain}</span>
                        </div>
                        <div>
                          <span className="font-medium">Registrador:</span>
                          <span className="ml-2">{result.domainInfo.registrar}</span>
                        </div>
                        <div>
                          <span className="font-medium">Fecha de Registro:</span>
                          <span className="ml-2">
                            {result.domainInfo.registrationDate 
                              ? new Date(result.domainInfo.registrationDate).toLocaleDateString()
                              : 'No disponible'
                            }
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Fecha de Expiración:</span>
                          <span className="ml-2">
                            {result.domainInfo.expiryDate 
                              ? new Date(result.domainInfo.expiryDate).toLocaleDateString()
                              : 'No disponible'
                            }
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Edad del Dominio:</span>
                          <span className="ml-2">{result.domainInfo.ageInDays} días</span>
                        </div>
                        <div>
                          <span className="font-medium">Privacidad WHOIS:</span>
                          <span className={`ml-2 ${result.domainInfo.whoisPrivacy ? 'text-orange-600' : 'text-green-600'}`}>
                            {result.domainInfo.whoisPrivacy ? 'Activada' : 'Desactivada'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Servidores DNS:</h4>
                        <div className="text-xs text-gray-600">
                          {result.domainInfo.nameServers.join(', ')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <FileText className="h-4 w-4 text-green-600" />
                        Análisis de Contenido
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="mb-4">
                        <span className="font-medium">Score de Contenido:</span>
                        <Badge className={`ml-2 ${result.contentAnalysis.contentScore > 70 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {result.contentAnalysis.contentScore}/100
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Título:</span>
                          <p className="text-gray-600 text-xs mt-1">{result.contentAnalysis.title || 'No disponible'}</p>
                        </div>
                        <div>
                          <span className="font-medium">Descripción:</span>
                          <p className="text-gray-600 text-xs mt-1">{result.contentAnalysis.description || 'No disponible'}</p>
                        </div>
                        <div>
                          <span className="font-medium">Idioma:</span>
                          <span className="ml-2">{result.contentAnalysis.language}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Políticas y Contacto:</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <Badge variant={result.contentAnalysis.hasContactInfo ? "default" : "secondary"}>
                            Info. Contacto
                          </Badge>
                          <Badge variant={result.contentAnalysis.hasPrivacyPolicy ? "default" : "secondary"}>
                            Política Privacidad
                          </Badge>
                          <Badge variant={result.contentAnalysis.hasTermsOfService ? "default" : "secondary"}>
                            Términos Servicio
                          </Badge>
                          <Badge variant={result.contentAnalysis.hasCookiePolicy ? "default" : "secondary"}>
                            Política Cookies
                          </Badge>
                        </div>
                      </div>
                      
                      {result.contentAnalysis.socialMediaLinks.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Redes Sociales:</h4>
                          <div className="text-xs text-gray-600">
                            {result.contentAnalysis.socialMediaLinks.length} enlaces encontrados
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="traffic" className="space-y-4">
                  {result.traffic && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          Métricas de Tráfico y Engagement
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
                          <div>
                            <span className="font-medium">Categoría:</span>
                            <span className="ml-2">{result.traffic.category}</span>
                          </div>
                          <div>
                            <span className="font-medium">Tasa de Rebote:</span>
                            <span className="ml-2">{result.traffic.bounceRate?.toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="font-medium">Duración Promedio:</span>
                            <span className="ml-2">{result.traffic.avgVisitDuration?.toFixed(0)}s</span>
                          </div>
                          <div>
                            <span className="font-medium">Páginas por Visita:</span>
                            <span className="ml-2">{result.traffic.pagesPerVisit?.toFixed(1)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="technical" className="space-y-4">
                  <Card className="bg-gray-50 border-gray-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Server className="h-4 w-4 text-gray-600" />
                        Información Técnica
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Servidor:</span>
                          <span className="ml-2">{result.responseHeaders.server}</span>
                        </div>
                        <div>
                          <span className="font-medium">Tipo de Contenido:</span>
                          <span className="ml-2">{result.responseHeaders.contentType}</span>
                        </div>
                        <div>
                          <span className="font-medium">Tamaño:</span>
                          <span className="ml-2">{result.details.contentLength} bytes</span>
                        </div>
                        <div>
                          <span className="font-medium">Framework:</span>
                          <span className="ml-2">{result.technologyStack.framework}</span>
                        </div>
                      </div>
                      
                      {result.sslInfo.enabled && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Lock className="h-4 w-4 text-green-600" />
                            Certificado SSL
                          </h4>
                          <div className="text-xs space-y-1">
                            <div>Emisor: {result.sslInfo.issuer}</div>
                            <div>Grado: {result.sslInfo.grade}</div>
                            {result.sslInfo.expiryDate && (
                              <div>Expira: {new Date(result.sslInfo.expiryDate).toLocaleDateString()}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Verificado el {new Date(result.timestamp).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
