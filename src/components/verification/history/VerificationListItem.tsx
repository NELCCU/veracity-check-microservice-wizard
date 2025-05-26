
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Phone, Mail, Globe } from "lucide-react";

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
      case 'phone': return 'bg-blue-50 hover:bg-blue-100';
      case 'email': return 'bg-green-50 hover:bg-green-100';
      case 'website': return 'bg-purple-50 hover:bg-purple-100';
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

  return (
    <div 
      className={`flex items-center justify-between p-3 ${getBgColor()} rounded-lg cursor-pointer transition-colors`}
      onClick={() => onItemClick(verification, type)}
    >
      <div className="flex items-center gap-3">
        {getIcon()}
        <span className={`${type === 'phone' ? 'font-mono' : ''} ${type === 'website' ? 'truncate max-w-xs' : ''}`}>
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
        <span className="text-sm text-gray-500">
          {new Date(verification.created_at).toLocaleDateString()}
        </span>
        <Eye className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};
