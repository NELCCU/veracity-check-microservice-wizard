
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  Shield,
  Clock,
  Globe,
  FileText,
  Users,
  Lock
} from "lucide-react";
import { WebsiteVerificationResult } from "@/types/verification";

interface RiskCriteriaExplanationProps {
  result: WebsiteVerificationResult;
}

export const RiskCriteriaExplanation = ({ result }: RiskCriteriaExplanationProps) => {
  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Bajo', color: 'text-green-600 bg-green-50', icon: CheckCircle };
    if (score >= 60) return { level: 'Medio', color: 'text-yellow-600 bg-yellow-50', icon: AlertTriangle };
    return { level: 'Alto', color: 'text-red-600 bg-red-50', icon: XCircle };
  };

  const risk = getRiskLevel(result.trustScore);
  const RiskIcon = risk.icon;

  // Calcular factores positivos y negativos
  const positiveFactors = [];
  const negativeFactors = [];
  
  // Factores positivos
  if (result.status === 'valid') {
    positiveFactors.push({ 
      factor: 'Sitio accesible', 
      points: 25, 
      icon: Globe,
      description: 'El sitio web responde correctamente y es accesible'
    });
  }
  
  if (result.sslInfo.enabled && result.sslInfo.valid) {
    positiveFactors.push({ 
      factor: 'Certificado SSL válido', 
      points: 20, 
      icon: Lock,
      description: `Conexión segura habilitada (Grado: ${result.sslInfo.grade})`
    });
  }
  
  if (result.domainInfo.ageInDays > 365) {
    positiveFactors.push({ 
      factor: 'Dominio establecido', 
      points: 15, 
      icon: Clock,
      description: `Dominio registrado hace ${Math.floor(result.domainInfo.ageInDays / 365)} años`
    });
  }
  
  if (result.contentAnalysis.contentScore > 70) {
    positiveFactors.push({ 
      factor: 'Contenido de calidad', 
      points: 15, 
      icon: FileText,
      description: `Score de contenido: ${result.contentAnalysis.contentScore}/100`
    });
  }
  
  if (result.securityAnalysis.reputationScore > 70) {
    positiveFactors.push({ 
      factor: 'Buena reputación', 
      points: 15, 
      icon: Users,
      description: `Score de reputación: ${result.securityAnalysis.reputationScore}/100`
    });
  }
  
  if (!result.isDuplicate && !result.imitationAnalysis.is_potential_imitation) {
    positiveFactors.push({ 
      factor: 'Sitio único', 
      points: 10, 
      icon: Shield,
      description: 'No se detectaron duplicados ni imitaciones'
    });
  }

  // Factores negativos
  if (result.status === 'invalid') {
    negativeFactors.push({
      factor: 'Sitio inaccesible',
      impact: 'Alto',
      icon: XCircle,
      description: `Error HTTP ${result.details.httpStatus || 'desconocido'}`
    });
  }
  
  if (!result.sslInfo.enabled) {
    negativeFactors.push({
      factor: 'Sin certificado SSL',
      impact: 'Medio',
      icon: AlertTriangle,
      description: 'Conexión no segura (HTTP en lugar de HTTPS)'
    });
  }
  
  if (result.domainInfo.ageInDays <= 365) {
    negativeFactors.push({
      factor: 'Dominio reciente',
      impact: 'Medio',
      icon: Clock,
      description: `Dominio registrado hace solo ${result.domainInfo.ageInDays} días`
    });
  }
  
  if (result.isDuplicate) {
    negativeFactors.push({
      factor: 'Sitio duplicado',
      impact: 'Alto',
      icon: AlertTriangle,
      description: 'Este sitio ya fue verificado anteriormente'
    });
  }
  
  if (result.imitationAnalysis.is_potential_imitation) {
    negativeFactors.push({
      factor: 'Posible imitación',
      impact: 'Muy Alto',
      icon: XCircle,
      description: `Score de imitación: ${result.imitationAnalysis.imitation_score}/100`
    });
  }
  
  if (result.securityAnalysis.phishingRisk) {
    negativeFactors.push({
      factor: 'Riesgo de phishing',
      impact: 'Muy Alto',
      icon: XCircle,
      description: 'Se detectaron indicadores de posible phishing'
    });
  }
  
  if (result.securityAnalysis.reputationScore < 30) {
    negativeFactors.push({
      factor: 'Mala reputación',
      impact: 'Alto',
      icon: XCircle,
      description: `Score de reputación muy bajo: ${result.securityAnalysis.reputationScore}/100`
    });
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Análisis Detallado de Riesgo
        </CardTitle>
        <CardDescription>
          Criterios utilizados para determinar el nivel de riesgo y score de confianza
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Resumen del riesgo */}
        <Alert className={`border-2 ${risk.color.includes('green') ? 'border-green-200 bg-green-50' : 
                           risk.color.includes('yellow') ? 'border-yellow-200 bg-yellow-50' : 
                           'border-red-200 bg-red-50'}`}>
          <RiskIcon className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>Nivel de Riesgo: {risk.level}</strong>
                <div className="text-sm mt-1">
                  Score de Confianza: <strong>{result.trustScore}/100</strong>
                </div>
              </div>
              <Badge className={risk.color}>
                {risk.level}
              </Badge>
            </div>
          </AlertDescription>
        </Alert>

        {/* Explicación de rangos */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Rangos de Riesgo:</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">Bajo</Badge>
              <span>80-100 puntos - Sitio confiable con pocos riesgos</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-800">Medio</Badge>
              <span>60-79 puntos - Precaución recomendada</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800">Alto</Badge>
              <span>0-59 puntos - Riesgo significativo detectado</span>
            </div>
          </div>
        </div>

        {/* Factores positivos */}
        {positiveFactors.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Factores Positivos ({positiveFactors.reduce((sum, f) => sum + f.points, 0)} puntos)
            </h4>
            <div className="space-y-2">
              {positiveFactors.map((factor, index) => {
                const Icon = factor.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium text-green-800">{factor.factor}</div>
                        <div className="text-sm text-green-600">{factor.description}</div>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white">+{factor.points}</Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Factores negativos */}
        {negativeFactors.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Factores de Riesgo Detectados
            </h4>
            <div className="space-y-2">
              {negativeFactors.map((factor, index) => {
                const Icon = factor.icon;
                const impactColor = factor.impact === 'Muy Alto' ? 'bg-red-600' :
                                  factor.impact === 'Alto' ? 'bg-red-500' :
                                  factor.impact === 'Medio' ? 'bg-orange-500' : 'bg-yellow-500';
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-red-600" />
                      <div>
                        <div className="font-medium text-red-800">{factor.factor}</div>
                        <div className="text-sm text-red-600">{factor.description}</div>
                      </div>
                    </div>
                    <Badge className={`${impactColor} text-white`}>
                      {factor.impact}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recomendaciones */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600" />
            Recomendaciones
          </h4>
          <div className="text-sm text-blue-800 space-y-1">
            {result.trustScore >= 80 && (
              <p>✅ Este sitio presenta un bajo nivel de riesgo y puede considerarse confiable.</p>
            )}
            {result.trustScore >= 60 && result.trustScore < 80 && (
              <p>⚠️ Se recomienda precaución. Verifica información adicional antes de proceder.</p>
            )}
            {result.trustScore < 60 && (
              <p>🚨 Alto riesgo detectado. Se recomienda evitar transacciones o intercambio de información sensible.</p>
            )}
            {result.imitationAnalysis.is_potential_imitation && (
              <p>🔍 Posible imitación detectada. Verifica la legitimidad del sitio con fuentes oficiales.</p>
            )}
            {!result.sslInfo.enabled && (
              <p>🔒 Falta certificado SSL. Evita ingresar información personal.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
