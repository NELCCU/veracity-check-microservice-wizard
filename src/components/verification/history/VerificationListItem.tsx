
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Phone, Mail, Globe, Calendar, Hash } from "lucide-react";

interface VerificationListItemProps {
  verification: any;
  type: 'phone' | 'email' | 'website';
  onItemClick: (item: any, type: 'phone' | 'email' | 'website') => void;
}

export const VerificationListItem = ({ verification, type, onItemClick }: VerificationListItemProps) => {
  const getIcon = () => {
    switch (type) {
      case 'phone': return <Phone className="h-4 w-4 text-blue-600" />;
      case 'email': return <Mail className="h-4 w-4 text-green-600" />;
      case 'website': return <Globe className="h-4 w-4 text-purple-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'phone': return 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-300';
      case 'email': return 'bg-green-50 hover:bg-green-100 border-l-4 border-green-300';
      case 'website': return 'bg-purple-50 hover:bg-purple-100 border-l-4 border-purple-300';
    }
  };

  const getDisplayText = () => {
    switch (type) {
      case 'phone': return verification.phone_number;
      case 'email': return verification.email;
      case 'website': return verification.url;
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
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
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    
    return {
      date: date.toLocaleDateString('es-ES', dateOptions),
      time: date.toLocaleTimeString('es-ES', timeOptions)
    };
  };

  const caseNumber = generateCaseNumber(verification.id, verification.created_at);
  const { date, time } = formatDateTime(verification.created_at);

  return (
    <div 
      className={`flex flex-col gap-2 p-4 ${getBgColor()} rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md`}
      onClick={() => onItemClick(verification, type)}
    >
      {/* Header con ícono, texto principal y estado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {getIcon()}
          <span className={`${type === 'phone' ? 'font-mono' : ''} ${type === 'website' ? 'truncate' : ''} font-medium`}>
            {getDisplayText()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {type === 'website' && verification.trust_score && (
            <Badge className={`px-2 py-1 text-xs ${getTrustScoreColor(verification.trust_score)}`}>
              {verification.trust_score}/100
            </Badge>
          )}
          {type === 'website' && verification.is_duplicate && (
            <Badge className="bg-orange-100 text-orange-800 text-xs">
              Duplicado
            </Badge>
          )}
          <Badge variant={verification.status === 'valid' ? 'default' : 'destructive'}>
            {verification.status === 'valid' ? 'Válido' : 'Inválido'}
          </Badge>
        </div>
      </div>

      {/* Footer con información del caso y fecha/hora */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Hash className="h-3 w-3" />
            <span className="font-mono font-medium">{caseNumber}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{date} • {time}</span>
          </div>
        </div>
        <Eye className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};
