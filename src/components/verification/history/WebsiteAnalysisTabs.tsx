
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Globe, 
  FileText, 
  TrendingUp, 
  Server, 
  Target,
  Link2,
  AlertTriangle,
  Eye,
  Copy,
  ExternalLink,
  Lock,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WebsiteAnalysisTabsProps {
  verification: any;
}

export const WebsiteAnalysisTabs = ({ verification }: WebsiteAnalysisTabsProps) => {
  const { toast } = useToast();

  // Parse JSON fields safely
  const parseJsonField = (field: any, defaultValue: any) => {
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch (e) {
        console.warn('Error parsing JSON field:', e);
        return defaultValue;
      }
    }
    return field || defaultValue;
  };

  const similarSites = parseJsonField(verification.similar_sites, []);
  const duplicateDetails = parseJsonField(verification.duplicate_details, {});
  const imitationAnalysis = parseJsonField(verification.imitation_analysis, {});

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
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="overview">Resumen</TabsTrigger>
        <TabsTrigger value="duplicates">
          <div className="flex items-center gap-1">
            Duplicados
            {(verification.is_duplicate || (similarSites && similarSites.length > 0)) && (
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
            <Badge className={`ml-2 ${verification.status === 'valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {verification.status === 'valid' ? 'Válido' : 'Inválido'}
            </Badge>
          </div>
          <div>
            <span className="font-medium">Duplicado:</span>
            <Badge className={`ml-2 ${verification.is_duplicate ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
              {verification.is_duplicate ? 'Sí' : 'No'}
            </Badge>
          </div>
          <div>
            <span className="font-medium">Código HTTP:</span>
            <span className="ml-2">{verification.http_status}</span>
          </div>
          <div>
            <span className="font-medium">Tiempo Respuesta:</span>
            <span className="ml-2">{verification.response_time}ms</span>
          </div>
          <div>
            <span className="font-medium">SSL/TLS:</span>
            <Badge className={`ml-2 ${verification.ssl_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {verification.ssl_enabled ? 'Activo' : 'Inactivo'}
            </Badge>
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
            {verification.is_duplicate && (
              <div className="p-4 bg-red-100 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  Sitio Duplicado Detectado
                </h4>
                <div className="text-sm space-y-2">
                  {duplicateDetails?.exact_match && (
                    <div>
                      <span className="font-medium">Tipo:</span> Coincidencia exacta
                    </div>
                  )}
                  {duplicateDetails?.original_url && (
                    <div className="flex items-center justify-between p-2 bg-white rounded border">
                      <span className="text-xs break-all">{duplicateDetails.original_url}</span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(duplicateDetails.original_url)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0"
                          onClick={() => openUrl(duplicateDetails.original_url)}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {similarSites && similarSites.length > 0 ? (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-blue-600" />
                  Sitios Similares Encontrados ({similarSites.length})
                </h4>
                <div className="space-y-3">
                  {similarSites.map((site: any, index: number) => (
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
                    </div>
                  ))}
                </div>
              </div>
            ) : !verification.is_duplicate && (
              <div className="text-center text-gray-500 py-8">
                <Globe className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No se encontraron sitios duplicados o similares</p>
                <p className="text-sm">Este sitio web parece ser único en nuestra base de datos</p>
              </div>
            )}

            {imitationAnalysis?.is_potential_imitation && (
              <div className="p-4 bg-orange-100 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-orange-600" />
                  Análisis de Imitación
                </h4>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-medium">Score de imitación:</span> {imitationAnalysis.imitation_score}/100
                  </div>
                  {imitationAnalysis.target_brand && (
                    <div>
                      <span className="font-medium">Posible marca imitada:</span> {imitationAnalysis.target_brand}
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
                <span className="font-medium">SSL/TLS:</span>
                <Badge className={`ml-2 ${verification.ssl_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {verification.ssl_enabled ? 'Activo' : 'Inactivo'}
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
                <span className="ml-2">{new URL(verification.url).hostname}</span>
              </div>
              <div>
                <span className="font-medium">URL Completa:</span>
                <span className="ml-2 text-xs break-all">{verification.url}</span>
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
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Título:</span>
                <p className="text-gray-600 text-xs mt-1">{verification.content_fingerprint || 'No disponible'}</p>
              </div>
              <div>
                <span className="font-medium">Dominio:</span>
                <p className="text-gray-600 text-xs mt-1">{verification.visual_fingerprint || 'No disponible'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="traffic" className="space-y-4">
        {(verification.monthly_visits || verification.ranking) && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Métricas de Tráfico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {verification.monthly_visits && (
                  <div>
                    <span className="font-medium">Visitas Mensuales:</span>
                    <span className="ml-2">{verification.monthly_visits.toLocaleString()}</span>
                  </div>
                )}
                {verification.ranking && (
                  <div>
                    <span className="font-medium">Ranking Global:</span>
                    <span className="ml-2">#{verification.ranking.toLocaleString()}</span>
                  </div>
                )}
                {verification.category && (
                  <div>
                    <span className="font-medium">Categoría:</span>
                    <span className="ml-2">{verification.category}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        {!verification.monthly_visits && !verification.ranking && (
          <div className="text-center text-gray-500 py-8">
            No se encontraron datos de tráfico para este sitio web
          </div>
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
                <span className="font-medium">Estado HTTP:</span>
                <span className="ml-2">{verification.http_status}</span>
              </div>
              <div>
                <span className="font-medium">Tiempo de Respuesta:</span>
                <span className="ml-2">{verification.response_time}ms</span>
              </div>
              <div>
                <span className="font-medium">SSL Habilitado:</span>
                <span className={`ml-2 ${verification.ssl_enabled ? 'text-green-600' : 'text-red-600'}`}>
                  {verification.ssl_enabled ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
            
            {verification.ssl_enabled && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-600" />
                  Certificado SSL
                </h4>
                <div className="text-xs space-y-1">
                  <div>Estado: Activo</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
