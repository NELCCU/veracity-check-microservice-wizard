
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, Phone, Mail, Globe, Clock, Hash, Calendar } from "lucide-react";
import { PhoneVerificationDetail } from "./PhoneVerificationDetail";
import { EmailVerificationDetail } from "./EmailVerificationDetail";
import { WebsiteVerificationDetail } from "./WebsiteVerificationDetail";

interface VerificationDetailProps {
  selectedItem: any;
  onBackToList: () => void;
}

export const VerificationDetail = ({ selectedItem, onBackToList }: VerificationDetailProps) => {
  const getIcon = () => {
    switch (selectedItem.type) {
      case 'phone': return <Phone className="h-5 w-5 text-blue-600" />;
      case 'email': return <Mail className="h-5 w-5 text-green-600" />;
      case 'website': return <Globe className="h-5 w-5 text-purple-600" />;
    }
  };

  const getTitle = () => {
    switch (selectedItem.type) {
      case 'phone': return 'Verificación de Teléfono';
      case 'email': return 'Verificación de Email';
      case 'website': return 'Análisis Completo de Debida Diligencia';
    }
  };

  const getBgColor = () => {
    switch (selectedItem.type) {
      case 'phone': return 'bg-blue-50 border-l-4 border-blue-300';
      case 'email': return 'bg-green-50 border-l-4 border-green-300';
      case 'website': return 'bg-purple-50 border-l-4 border-purple-300';
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

  // Generar número de caso basado en el ID y timestamp
  const generateCaseNumber = (id: string, createdAt: string) => {
    const shortId = id.substring(0, 8).toUpperCase();
    const date = new Date(createdAt);
    const dateStr = date.toISOString().slice(2, 10).replace(/-/g, '');
    return `${dateStr}-${shortId}`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      fullDate: date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }),
      relativeTime: getRelativeTime(date)
    };
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Hace menos de un minuto';
    if (diffMinutes < 60) return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    return date.toLocaleDateString('es-ES');
  };

  const caseNumber = generateCaseNumber(selectedItem.id, selectedItem.created_at);
  const { fullDate, relativeTime } = formatDateTime(selectedItem.created_at);

  const renderDetailContent = () => {
    switch (selectedItem.type) {
      case 'phone':
        return <PhoneVerificationDetail verification={selectedItem} />;
      case 'email':
        return <EmailVerificationDetail verification={selectedItem} />;
      case 'website':
        return <WebsiteVerificationDetail verification={selectedItem} />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Detalle Completo del Análisis de Debida Diligencia
          </CardTitle>
          <Button variant="outline" onClick={onBackToList}>
            Volver al Historial
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Información del caso */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Número de Caso:</span>
                <span className="font-mono font-bold text-blue-600">{caseNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Fecha de Análisis:</span>
                <span>{relativeTime}</span>
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Timestamp Completo:</span>
                <span className="text-gray-600">{fullDate}</span>
              </div>
            </div>
          </div>

          {/* Información principal del análisis */}
          <div className={`flex items-center justify-between p-4 rounded-lg ${getBgColor()}`}>
            <div className="flex items-center gap-3">
              {getIcon()}
              <div>
                <h3 className="font-semibold text-lg">
                  {selectedItem.phone_number || selectedItem.email || selectedItem.url}
                </h3>
                <p className="text-sm text-gray-600">{getTitle()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedItem.type === 'website' && selectedItem.trust_score && (
                <Badge className={`px-3 py-1 ${getTrustScoreColor(selectedItem.trust_score)}`}>
                  Score: {selectedItem.trust_score}/100
                </Badge>
              )}
              {selectedItem.type === 'website' && selectedItem.risk_level && (
                <Badge className={getRiskLevelColor(selectedItem.risk_level)}>
                  Riesgo: {selectedItem.risk_level}
                </Badge>
              )}
              {selectedItem.type === 'website' && selectedItem.is_duplicate && (
                <Badge className="bg-orange-100 text-orange-800">
                  Duplicado
                </Badge>
              )}
              <Badge variant={selectedItem.status === 'valid' ? 'default' : 'destructive'} className="text-sm px-3 py-1">
                {selectedItem.status === 'valid' ? 'Válido' : 'Inválido'}
              </Badge>
            </div>
          </div>

          {/* Contenido específico del análisis */}
          {renderDetailContent()}
        </div>
      </CardContent>
    </Card>
  );
};
