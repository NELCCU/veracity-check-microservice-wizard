
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Mail, Globe, History, Eye, TrendingUp, Shield, Lock, Clock, Server, FileText, ExternalLink, Facebook, Instagram, Linkedin, Twitter, Youtube, CheckCircle, XCircle } from "lucide-react";
import { WebsiteVerificationResult } from "@/types/verification";

interface RecentVerificationsProps {
  recentVerifications: {
    phones: any[];
    emails: any[];
    websites: any[];
  };
}

export const RecentVerifications = ({ recentVerifications }: RecentVerificationsProps) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  const hasNoVerifications = 
    recentVerifications.phones.length === 0 && 
    recentVerifications.emails.length === 0 && 
    recentVerifications.websites.length === 0;

  const handleItemClick = (item: any, type: 'phone' | 'email' | 'website') => {
    setSelectedItem({ ...item, type });
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedItem(null);
    setViewMode('list');
  };

  const getSocialMediaIcon = (url: string) => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('facebook')) return <Facebook className="h-4 w-4" />;
    if (lowerUrl.includes('twitter') || lowerUrl.includes('x.com')) return <Twitter className="h-4 w-4" />;
    if (lowerUrl.includes('linkedin')) return <Linkedin className="h-4 w-4" />;
    if (lowerUrl.includes('instagram')) return <Instagram className="h-4 w-4" />;
    if (lowerUrl.includes('youtube')) return <Youtube className="h-4 w-4" />;
    return <Globe className="h-4 w-4" />;
  };

  const getSocialMediaName = (url: string) => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('facebook')) return 'Facebook';
    if (lowerUrl.includes('twitter') || lowerUrl.includes('x.com')) return 'Twitter/X';
    if (lowerUrl.includes('linkedin')) return 'LinkedIn';
    if (lowerUrl.includes('instagram')) return 'Instagram';
    if (lowerUrl.includes('youtube')) return 'YouTube';
    if (lowerUrl.includes('tiktok')) return 'TikTok';
    return 'Red Social';
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

  if (viewMode === 'detail' && selectedItem) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Detalle de Verificación
            </CardTitle>
            <Button variant="outline" onClick={handleBackToList}>
              Volver al Historial
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {selectedItem.type === 'phone' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">{selectedItem.phone_number}</h3>
                    <p className="text-sm text-gray-600">Verificación de Teléfono</p>
                  </div>
                </div>
                <Badge variant={selectedItem.status === 'valid' ? 'default' : 'destructive'}>
                  {selectedItem.status === 'valid' ? 'Válido' : 'Inválido'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">País:</span>
                  <span className="ml-2">{selectedItem.country || 'No disponible'}</span>
                </div>
                <div>
                  <span className="font-medium">Operador:</span>
                  <span className="ml-2">{selectedItem.carrier || 'No disponible'}</span>
                </div>
                <div>
                  <span className="font-medium">Tipo de Línea:</span>
                  <span className="ml-2">{selectedItem.line_type || 'No disponible'}</span>
                </div>
                <div>
                  <span className="font-medium">Estado:</span>
                  <span className={`ml-2 ${selectedItem.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedItem.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {selectedItem.type === 'email' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold">{selectedItem.email}</h3>
                    <p className="text-sm text-gray-600">Verificación de Email</p>
                  </div>
                </div>
                <Badge variant={selectedItem.status === 'valid' ? 'default' : 'destructive'}>
                  {selectedItem.status === 'valid' ? 'Válido' : 'Inválido'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Dominio:</span>
                  <span className="ml-2">{selectedItem.domain || 'No disponible'}</span>
                </div>
                <div>
                  <span className="font-medium">Entregable:</span>
                  <span className={`ml-2 ${selectedItem.is_deliverable ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedItem.is_deliverable ? 'Sí' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Desechable:</span>
                  <span className={`ml-2 ${selectedItem.is_disposable ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedItem.is_disposable ? 'Sí' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Registros MX:</span>
                  <span className={`ml-2 ${selectedItem.mx_records ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedItem.mx_records ? 'Válidos' : 'Inválidos'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {selectedItem.type === 'website' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-purple-600" />
                  <div>
                    <h3 className="font-semibold">{selectedItem.url}</h3>
                    <p className="text-sm text-gray-600">Verificación de Sitio Web</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedItem.trust_score && (
                    <Badge className={`px-3 py-1 ${getTrustScoreColor(selectedItem.trust_score)}`}>
                      Score: {selectedItem.trust_score}/100
                    </Badge>
                  )}
                  <Badge variant={selectedItem.status === 'valid' ? 'default' : 'destructive'}>
                    {selectedItem.status === 'valid' ? 'Válido' : 'Inválido'}
                  </Badge>
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Resumen</TabsTrigger>
                  <TabsTrigger value="security">Seguridad</TabsTrigger>
                  <TabsTrigger value="traffic">Tráfico</TabsTrigger>
                  <TabsTrigger value="technical">Técnico</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Estado HTTP:</span>
                      <span className="ml-2">{selectedItem.http_status}</span>
                    </div>
                    <div>
                      <span className="font-medium">Tiempo Respuesta:</span>
                      <span className="ml-2">{selectedItem.response_time}ms</span>
                    </div>
                    <div>
                      <span className="font-medium">SSL/TLS:</span>
                      <Badge className={`ml-2 ${selectedItem.ssl_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {selectedItem.ssl_enabled ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Duplicado:</span>
                      <Badge className={`ml-2 ${selectedItem.is_duplicate ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                        {selectedItem.is_duplicate ? 'Sí' : 'No'}
                      </Badge>
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
                        {selectedItem.reputation_score && (
                          <div>
                            <span className="font-medium">Score de Reputación:</span>
                            <span className="ml-2">{selectedItem.reputation_score}/100</span>
                          </div>
                        )}
                        {selectedItem.risk_level && (
                          <div>
                            <span className="font-medium">Nivel de Riesgo:</span>
                            <Badge className={`ml-2 ${getRiskLevelColor(selectedItem.risk_level)}`}>
                              {selectedItem.risk_level}
                            </Badge>
                          </div>
                        )}
                        {selectedItem.ssl_grade && (
                          <div>
                            <span className="font-medium">Grado SSL:</span>
                            <span className="ml-2">{selectedItem.ssl_grade}</span>
                          </div>
                        )}
                        {selectedItem.domain_age_days && (
                          <div>
                            <span className="font-medium">Edad del Dominio:</span>
                            <span className="ml-2">{Math.floor(selectedItem.domain_age_days / 365)} años</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="traffic" className="space-y-4">
                  {(selectedItem.monthly_visits || selectedItem.ranking) && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          Métricas de Tráfico
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {selectedItem.monthly_visits && (
                            <div>
                              <span className="font-medium">Visitas Mensuales:</span>
                              <span className="ml-2">{selectedItem.monthly_visits.toLocaleString()}</span>
                            </div>
                          )}
                          {selectedItem.ranking && (
                            <div>
                              <span className="font-medium">Ranking Global:</span>
                              <span className="ml-2">#{selectedItem.ranking.toLocaleString()}</span>
                            </div>
                          )}
                          {selectedItem.category && (
                            <div>
                              <span className="font-medium">Categoría:</span>
                              <span className="ml-2">{selectedItem.category}</span>
                            </div>
                          )}
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
                          <span className="font-medium">Estado HTTP:</span>
                          <span className="ml-2">{selectedItem.http_status}</span>
                        </div>
                        <div>
                          <span className="font-medium">Tiempo de Respuesta:</span>
                          <span className="ml-2">{selectedItem.response_time}ms</span>
                        </div>
                        <div>
                          <span className="font-medium">SSL Habilitado:</span>
                          <span className={`ml-2 ${selectedItem.ssl_enabled ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedItem.ssl_enabled ? 'Sí' : 'No'}
                          </span>
                        </div>
                        {selectedItem.content_score && (
                          <div>
                            <span className="font-medium">Score de Contenido:</span>
                            <span className="ml-2">{selectedItem.content_score}/100</span>
                          </div>
                        )}
                      </div>
                      
                      {(selectedItem.has_privacy_policy || selectedItem.has_terms_of_service || selectedItem.has_contact_info) && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Políticas y Contacto:</h4>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            {selectedItem.has_contact_info !== null && (
                              <Badge variant={selectedItem.has_contact_info ? "default" : "secondary"}>
                                Info. Contacto
                              </Badge>
                            )}
                            {selectedItem.has_privacy_policy !== null && (
                              <Badge variant={selectedItem.has_privacy_policy ? "default" : "secondary"}>
                                Política Privacidad
                              </Badge>
                            )}
                            {selectedItem.has_terms_of_service !== null && (
                              <Badge variant={selectedItem.has_terms_of_service ? "default" : "secondary"}>
                                Términos Servicio
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
            <Clock className="h-3 w-3" />
            Verificado el {new Date(selectedItem.created_at).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Verificaciones Recientes
        </CardTitle>
        <CardDescription>
          Últimas 5 verificaciones realizadas - Haz clic para ver detalles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasNoVerifications ? (
          <p className="text-center text-gray-500 py-8">
            No hay verificaciones recientes
          </p>
        ) : (
          <div className="space-y-3">
            {recentVerifications.phones.map((verification: any) => (
              <div 
                key={verification.id} 
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => handleItemClick(verification, 'phone')}
              >
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="font-mono">{verification.phone_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={verification.status === 'valid' ? 'default' : 'destructive'}>
                    {verification.status === 'valid' ? 'Válido' : 'Inválido'}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(verification.created_at).toLocaleDateString()}
                  </span>
                  <Eye className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}

            {recentVerifications.emails.map((verification: any) => (
              <div 
                key={verification.id} 
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                onClick={() => handleItemClick(verification, 'email')}
              >
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-green-600" />
                  <span>{verification.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={verification.status === 'valid' ? 'default' : 'destructive'}>
                    {verification.status === 'valid' ? 'Válido' : 'Inválido'}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(verification.created_at).toLocaleDateString()}
                  </span>
                  <Eye className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}

            {recentVerifications.websites.map((verification: any) => (
              <div 
                key={verification.id} 
                className="flex items-center justify-between p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
                onClick={() => handleItemClick(verification, 'website')}
              >
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-purple-600" />
                  <span>{verification.url}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={verification.status === 'valid' ? 'default' : 'destructive'}>
                    {verification.status === 'valid' ? 'Válido' : 'Inválido'}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(verification.created_at).toLocaleDateString()}
                  </span>
                  <Eye className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
