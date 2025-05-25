
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Wifi, WifiOff } from "lucide-react";

interface ApiStatus {
  service: string;
  status: 'online' | 'offline' | 'limited' | 'unknown';
  lastCheck: Date;
  message?: string;
}

export const ApiStatusIndicator = () => {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([
    {
      service: 'NumVerify',
      status: 'unknown',
      lastCheck: new Date()
    },
    {
      service: 'ZeroBounce', 
      status: 'unknown',
      lastCheck: new Date()
    },
    {
      service: 'SimilarWeb',
      status: 'unknown',
      lastCheck: new Date()
    }
  ]);

  const getStatusIcon = (status: ApiStatus['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'limited':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ApiStatus['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      case 'limited':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ApiStatus['status']) => {
    switch (status) {
      case 'online':
        return 'Operativo';
      case 'offline':
        return 'Fuera de línea';
      case 'limited':
        return 'Cuota limitada';
      default:
        return 'Desconocido';
    }
  };

  // Simulación de verificación de estado (en producción esto vendría de las APIs reales)
  useEffect(() => {
    const checkApiStatus = () => {
      setApiStatuses(prev => prev.map(api => ({
        ...api,
        status: Math.random() > 0.8 ? 'limited' : Math.random() > 0.1 ? 'online' : 'offline',
        lastCheck: new Date()
      })));
    };

    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000); // Verificar cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const hasIssues = apiStatuses.some(api => api.status === 'offline' || api.status === 'limited');

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Estado de APIs</h3>
          <div className="flex items-center gap-2">
            {hasIssues ? (
              <WifiOff className="h-4 w-4 text-red-500" />
            ) : (
              <Wifi className="h-4 w-4 text-green-500" />
            )}
            <span className="text-sm text-gray-500">
              Último chequeo: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {apiStatuses.map((api) => (
            <div key={api.service} className="flex items-center justify-between p-2 rounded border">
              <div className="flex items-center gap-2">
                {getStatusIcon(api.status)}
                <span className="font-medium">{api.service}</span>
              </div>
              <Badge className={getStatusColor(api.status)}>
                {getStatusText(api.status)}
              </Badge>
            </div>
          ))}
        </div>

        {hasIssues && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Algunos servicios tienen problemas. Las verificaciones pueden verse afectadas.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
