
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Globe, History } from "lucide-react";

interface RecentVerificationsProps {
  recentVerifications: {
    phones: any[];
    emails: any[];
    websites: any[];
  };
}

export const RecentVerifications = ({ recentVerifications }: RecentVerificationsProps) => {
  const hasNoVerifications = 
    recentVerifications.phones.length === 0 && 
    recentVerifications.emails.length === 0 && 
    recentVerifications.websites.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Verificaciones Recientes
        </CardTitle>
        <CardDescription>
          Últimas 5 verificaciones realizadas
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
              <div key={verification.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
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
                </div>
              </div>
            ))}

            {recentVerifications.emails.map((verification: any) => (
              <div key={verification.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
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
                </div>
              </div>
            ))}

            {recentVerifications.websites.map((verification: any) => (
              <div key={verification.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
