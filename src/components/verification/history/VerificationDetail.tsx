
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, Phone, Mail, Globe, Clock } from "lucide-react";
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
        <div className="space-y-4">
          <div className={`flex items-center justify-between p-4 rounded-lg ${
            selectedItem.type === 'phone' ? 'bg-blue-50' : 
            selectedItem.type === 'email' ? 'bg-green-50' : 'bg-purple-50'
          }`}>
            <div className="flex items-center gap-3">
              {getIcon()}
              <div>
                <h3 className="font-semibold">
                  {selectedItem.phone_number || selectedItem.email || selectedItem.url}
                </h3>
                <p className="text-sm text-gray-600">{getTitle()}</p>
              </div>
            </div>
            <Badge variant={selectedItem.status === 'valid' ? 'default' : 'destructive'}>
              {selectedItem.status === 'valid' ? 'Válido' : 'Inválido'}
            </Badge>
          </div>

          {renderDetailContent()}

          <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
            <Clock className="h-3 w-3" />
            Verificado el {new Date(selectedItem.created_at).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
