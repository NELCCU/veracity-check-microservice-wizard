
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, Shield, Globe, Briefcase, TrendingUp, FileText, AlertTriangle } from 'lucide-react';
import { CorporateVerificationResult } from '@/types/corporate';

interface CorporateVerificationResultsProps {
  result: CorporateVerificationResult;
}

export const CorporateVerificationResults = ({ result }: CorporateVerificationResultsProps) => {
  const { corporate_verification, registry_info, corporate_structure, pep_sanctions_checks, 
          geographic_risk, business_activity, risk_scores } = result;

  const getRiskBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return 'Bajo';
    if (score >= 60) return 'Medio';
    return 'Alto';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Resumen de Verificación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{corporate_verification.company_name}</div>
              <div className="text-sm text-gray-500">Empresa</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{corporate_verification.tax_id}</div>
              <div className="text-sm text-gray-500">ID Fiscal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{corporate_verification.country}</div>
              <div className="text-sm text-gray-500">País</div>
            </div>
            <div className="text-center">
              <Badge className={`text-white ${getRiskBadgeColor(corporate_verification.overall_risk_score)}`}>
                {corporate_verification.overall_risk_score}/100
              </Badge>
              <div className="text-sm text-gray-500 mt-1">Score General</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="registry" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="registry">Registro</TabsTrigger>
          <TabsTrigger value="structure">Estructura</TabsTrigger>
          <TabsTrigger value="pep">PEP/Sanciones</TabsTrigger>
          <TabsTrigger value="geographic">Geográfico</TabsTrigger>
          <TabsTrigger value="business">Actividad</TabsTrigger>
          <TabsTrigger value="scoring">Scoring</TabsTrigger>
        </TabsList>

        {/* Información del Registro */}
        <TabsContent value="registry">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información del Registro Mercantil
              </CardTitle>
            </CardHeader>
            <CardContent>
              {registry_info ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Estado Legal</h4>
                    <Badge variant={registry_info.legal_status === 'active' ? 'default' : 'destructive'}>
                      {registry_info.legal_status === 'active' ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Forma Legal</h4>
                    <p>{registry_info.legal_form}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Fecha de Registro</h4>
                    <p>{formatDate(registry_info.registration_date)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Número de Registro</h4>
                    <p>{registry_info.registration_number}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Capital Social</h4>
                    <p>{formatCurrency(registry_info.share_capital)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Actividad Comercial</h4>
                    <p>{registry_info.business_activity}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-semibold mb-2">Dirección Registrada</h4>
                    <p>{registry_info.registered_address}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No hay información de registro disponible</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Estructura Societaria */}
        <TabsContent value="structure">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Estructura Societaria
              </CardTitle>
            </CardHeader>
            <CardContent>
              {corporate_structure && corporate_structure.length > 0 ? (
                <div className="space-y-4">
                  {corporate_structure.map((person, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{person.person_name}</h4>
                        <Badge variant="outline">{person.person_type}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="font-medium">ID:</span> {person.identification_number}
                        </div>
                        <div>
                          <span className="font-medium">Nacionalidad:</span> {person.nationality}
                        </div>
                        <div>
                          <span className="font-medium">Participación:</span> {person.ownership_percentage}%
                        </div>
                        <div>
                          <span className="font-medium">Cargo:</span> {person.position}
                        </div>
                      </div>
                      {person.is_pep && (
                        <div className="mt-2">
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Persona Expuesta Políticamente
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No hay información de estructura societaria disponible</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verificación PEP y Sanciones */}
        <TabsContent value="pep">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verificación PEP y Listas de Sanciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pep_sanctions_checks && pep_sanctions_checks.length > 0 ? (
                <div className="space-y-4">
                  {pep_sanctions_checks.map((check, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold capitalize">{check.check_type}</h4>
                        <Badge variant={check.check_result === 'clear' ? 'default' : 'destructive'}>
                          {check.check_result === 'clear' ? 'Sin coincidencias' : 'Coincidencia encontrada'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Nivel de Riesgo:</span>
                          <Badge variant="outline" className="ml-2">{check.risk_level}</Badge>
                        </div>
                        <div>
                          <span className="font-medium">Última Verificación:</span> {formatDate(check.last_checked)}
                        </div>
                        <div>
                          <span className="font-medium">Fuentes:</span> {check.sources_checked?.join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No hay verificaciones PEP/Sanciones disponibles</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Análisis Geográfico */}
        <TabsContent value="geographic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Análisis Geográfico y Riesgo País
              </CardTitle>
            </CardHeader>
            <CardContent>
              {geographic_risk ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Riesgo País</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-white ${getRiskBadgeColor(geographic_risk.country_risk_score)}`}>
                        {geographic_risk.country_risk_score}/100
                      </Badge>
                      <span>{getRiskLevel(geographic_risk.country_risk_score)}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Tipo de Jurisdicción</h4>
                    <Badge variant="outline">{geographic_risk.jurisdiction_type}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Verificación de Dirección</h4>
                    <Badge variant={geographic_risk.address_verification_status === 'verified' ? 'default' : 'destructive'}>
                      {geographic_risk.address_verification_status === 'verified' ? 'Verificada' : 'Pendiente'}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Cumplimiento Regulatorio</h4>
                    <div className="text-sm space-y-1">
                      {geographic_risk.regulatory_compliance && typeof geographic_risk.regulatory_compliance === 'object' && 
                        Object.entries(geographic_risk.regulatory_compliance).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span>{key}:</span>
                            <Badge variant={value ? 'default' : 'destructive'} className="text-xs">
                              {value ? 'Sí' : 'No'}
                            </Badge>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No hay información geográfica disponible</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Análisis de Actividad Comercial */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Análisis de Actividad Comercial
              </CardTitle>
            </CardHeader>
            <CardContent>
              {business_activity ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Sector Industrial</h4>
                    <p>{business_activity.industry_sector}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Modelo de Negocio</h4>
                    <p>{business_activity.business_model}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Actividad Restringida</h4>
                    <Badge variant={business_activity.is_restricted_activity ? 'destructive' : 'default'}>
                      {business_activity.is_restricted_activity ? 'Sí' : 'No'}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Estado Financiero</h4>
                    <Badge variant="outline">{business_activity.financial_status}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Score Crediticio</h4>
                    <Badge className={`text-white ${getRiskBadgeColor(business_activity.credit_score)}`}>
                      {business_activity.credit_score}/100
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Licencias Requeridas</h4>
                    <div className="space-y-1">
                      {business_activity.licenses_required?.map((license, idx) => (
                        <div key={idx} className="text-sm">{license}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No hay información de actividad comercial disponible</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scoring de Riesgo */}
        <TabsContent value="scoring">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Scoring de Riesgo Detallado
              </CardTitle>
            </CardHeader>
            <CardContent>
              {risk_scores && risk_scores.length > 0 ? (
                <div className="space-y-4">
                  {risk_scores.map((score, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold capitalize">{score.category}</h4>
                        <Badge className={`text-white ${getRiskBadgeColor(score.score)}`}>
                          {score.score}/100
                        </Badge>
                      </div>
                      <div className="text-sm space-y-2">
                        <div>
                          <span className="font-medium">Peso:</span> {score.weight}
                        </div>
                        <div>
                          <span className="font-medium">Decisión:</span>
                          <Badge variant="outline" className="ml-2">{score.decision_matrix}</Badge>
                        </div>
                        <div>
                          <span className="font-medium">Razón:</span> {score.decision_reason}
                        </div>
                        {score.factors && typeof score.factors === 'object' && (
                          <div>
                            <span className="font-medium">Factores:</span>
                            <div className="mt-1 pl-4 text-xs space-y-1">
                              {Object.entries(score.factors).map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium">{key}:</span> {String(value)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No hay información de scoring disponible</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
