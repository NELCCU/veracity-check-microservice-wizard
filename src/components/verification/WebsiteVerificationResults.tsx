
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ExternalLink, 
  Copy, 
  Shield, 
  Globe,
  Eye,
  Target,
  Link2,
  FileText,
  TrendingUp,
  Server,
  Lock
} from "lucide-react";
import { WebsiteVerificationResult, SimilarSite } from "@/types/verification";
import { useToast } from "@/hooks/use-toast";

interface WebsiteVerificationResultsProps {
  result: WebsiteVerificationResult;
}

export const WebsiteVerificationResults = ({ result }: WebsiteVerificationResultsProps) => {
  const { toast } = useToast();

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

  const getRelationshipColor = (type: string) => {
    switch (type) {
      case 'duplicate': return "text-red-600 bg-red-100";
      case 'imitation': return "text-orange-600 bg-orange-100";
      case 'similar': return "text-blue-600 bg-blue-100";
      case 'suspicious': return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getSocialMediaName = (url: string) => {
    if (url.includes('facebook.com')) return 'Facebook';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter/X';
    if (url.includes('linkedin.com')) return 'LinkedIn';
    if (url.includes('instagram.com')) return 'Instagram';
    if (url.includes('youtube.com')) return 'YouTube';
    if (url.includes('tiktok.com')) return 'TikTok';
    if (url.includes('pinterest.com')) return 'Pinterest';
    if (url.includes('github.com')) return 'GitHub';
    return 'Red Social';
  };

  const getSocialMediaIcon = (url: string) => {
    const iconClass = "h-4 w-4";
    
    if (url.includes('facebook.com')) {
      return <div className={`${iconClass} bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold`}>f</div>;
    }
    if (url.includes('twitter.com') || url.includes('x.com')) {
      return <div className={`${iconClass} bg-black rounded text-white flex items-center justify-center text-xs font-bold`}>X</div>;
    }
    if (url.includes('linkedin.com')) {
      return <div className={`${iconClass} bg-blue-700 rounded text-white flex items-center justify-center text-xs font-bold`}>in</div>;
    }
    if (url.includes('instagram.com')) {
      return <div className={`${iconClass} bg-gradient-to-r from-purple-500 to-pink-500 rounded text-white flex items-center justify-center text-xs font-bold`}>IG</div>;
    }
    if (url.includes('youtube.com')) {
      return <div className={`${iconClass} bg-red-600 rounded text-white flex items-center justify-center text-xs font-bold`}>YT</div>;
    }
    if (url.includes('tiktok.com')) {
      return <div className={`${iconClass} bg-black rounded text-white flex items-center justify-center text-xs font-bold`}>TT</div>;
    }
    if (url.includes('pinterest.com')) {
      return <div className={`${iconClass} bg-red-500 rounded text-white flex items-center justify-center text-xs font-bold`}>P</div>;
    }
    if (url.includes('github.com')) {
      return <div className={`${iconClass} bg-gray-800 rounded text-white flex items-center justify-center text-xs font-bold`}>GH</div>;
    }
    
    return <Globe className={iconClass} />;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "URL copiada al portapapeles",
    });
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  return (
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
        {/* Alertas de duplicados e imitación */}
        {result.isDuplicate && (
          <Alert className="mb-4 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Sitio Duplicado:</strong> Este sitio web ya ha sido verificado anteriormente.
              {result.duplicateDetails.exact_match && result.duplicateDetails.original_date && (
                <div className="mt-2 text-sm">
                  Verificación original: {new Date(result.duplicateDetails.original_date).toLocaleDateString()}
                  {result.duplicateDetails.original_url && (
                    <div className="flex items-center gap-2 mt-1">
                      <span>URL original: {result.duplicateDetails.original_url}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(result.duplicateDetails.original_url!)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {result.imitationAnalysis.is_potential_imitation && (
          <Alert variant="destructive" className="mb-4">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Posible Imitación Detectada:</strong> Este sitio presenta características que sugieren que podría ser una imitación.
              {result.imitationAnalysis.target_brand && (
                <div className="mt-1">Posible imitación de: <strong>{result.imitationAnalysis.target_brand}</strong></div>
              )}
              <div className="mt-1">Score de imitación: <strong>{result.imitationAnalysis.imitation_score}/100</strong></div>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="duplicates">
              <div className="flex items-center gap-1">
                Duplicados
                {(result.isDuplicate || result.similarSites.length > 0) && (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </div>
            </TabsTrigger>
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

          <TabsContent value="duplicates" className="space-y-4">
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-4 w-4 text-red-600" />
                  Análisis de Duplicados y Sitios Similares
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.isDuplicate && (
                  <div className="p-4 bg-red-100 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      Sitio Duplicado Detectado
                    </h4>
                    <div className="text-sm space-y-2">
                      {result.duplicateDetails.exact_match && (
                        <div>
                          <span className="font-medium">Tipo:</span> Coincidencia exacta
                        </div>
                      )}
                      {result.duplicateDetails.original_url && (
                        <div className="flex items-center justify-between p-2 bg-white rounded border">
                          <span className="text-xs break-all">{result.duplicateDetails.original_url}</span>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(result.duplicateDetails.original_url!)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() => openUrl(result.duplicateDetails.original_url!)}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      {result.duplicateDetails.original_date && (
                        <div>
                          <span className="font-medium">Fecha original:</span> {new Date(result.duplicateDetails.original_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {result.similarSites.length > 0 ? (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-blue-600" />
                      Sitios Similares Encontrados ({result.similarSites.length})
                    </h4>
                    <div className="space-y-3">
                      {result.similarSites.map((site, index) => (
                        <div key={index} className="p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={`text-xs ${getRelationshipColor(site.relationship_type)}`}>
                                {site.relationship_type === 'duplicate' && 'Duplicado'}
                                {site.relationship_type === 'imitation' && 'Imitación'}
                                {site.relationship_type === 'similar' && 'Similar'}
                                {site.relationship_type === 'suspicious' && 'Sospechoso'}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {site.similarity_score}% similar
                              </Badge>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0"
                                onClick={() => copyToClipboard(site.url)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0"
                                onClick={() => openUrl(site.url)}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 break-all mb-2">
                            {site.url}
                          </div>
                          {site.analysis_details && (
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {site.analysis_details.content_similarity && (
                                <div>
                                  <span className="font-medium">Contenido:</span> {Math.round(site.analysis_details.content_similarity)}%
                                </div>
                              )}
                              {site.analysis_details.domain_similarity && (
                                <div>
                                  <span className="font-medium">Dominio:</span> {Math.round(site.analysis_details.domain_similarity)}%
                                </div>
                              )}
                              {site.analysis_details.structural_similarity && (
                                <div>
                                  <span className="font-medium">Estructura:</span> {Math.round(site.analysis_details.structural_similarity)}%
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : !result.isDuplicate && (
                  <div className="text-center text-gray-500 py-8">
                    <Globe className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No se encontraron sitios duplicados o similares</p>
                    <p className="text-sm">Este sitio web parece ser único en nuestra base de datos</p>
                  </div>
                )}

                {result.imitationAnalysis.is_potential_imitation && (
                  <div className="p-4 bg-orange-100 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Eye className="h-4 w-4 text-orange-600" />
                      Análisis de Imitación
                    </h4>
                    <div className="text-sm space-y-2">
                      <div>
                        <span className="font-medium">Score de imitación:</span> {result.imitationAnalysis.imitation_score}/100
                      </div>
                      {result.imitationAnalysis.target_brand && (
                        <div>
                          <span className="font-medium">Posible marca imitada:</span> {result.imitationAnalysis.target_brand}
                        </div>
                      )}
                      {result.imitationAnalysis.suspicious_elements.length > 0 && (
                        <div>
                          <span className="font-medium">Elementos sospechosos:</span>
                          <ul className="list-disc list-inside mt-1 text-xs">
                            {result.imitationAnalysis.suspicious_elements.map((element, idx) => (
                              <li key={idx}>{element}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {result.imitationAnalysis.legitimate_indicators.length > 0 && (
                        <div>
                          <span className="font-medium">Indicadores legítimos:</span>
                          <ul className="list-disc list-inside mt-1 text-xs">
                            {result.imitationAnalysis.legitimate_indicators.map((indicator, idx) => (
                              <li key={idx}>{indicator}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
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
                    <h4 className="font-medium mb-3">Redes Sociales Encontradas:</h4>
                    <div className="space-y-2">
                      {result.contentAnalysis.socialMediaLinks.map((link, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                          <div className="flex items-center gap-2">
                            {getSocialMediaIcon(link)}
                            <span className="text-sm font-medium">{getSocialMediaName(link)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 max-w-48 truncate">{link}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 p-0"
                              onClick={() => copyToClipboard(link)}
                              title="Copiar enlace"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 p-0"
                              onClick={() => openUrl(link)}
                              title="Abrir en nueva ventana"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {result.contentAnalysis.socialMediaLinks.length === 0 && (
                  <div className="mt-4 text-center text-gray-500 py-4">
                    <Globe className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No se encontraron enlaces a redes sociales</p>
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
      </CardContent>
    </Card>
  );
};
