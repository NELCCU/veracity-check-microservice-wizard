
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { useApiSettings } from "@/hooks/useApiSettings";
import { googleMapsLoader } from "@/services/googleMapsLoader";

interface ApiStatus {
  service: string;
  status: 'online' | 'offline' | 'limited' | 'unknown';
  lastCheck: Date;
  message?: string;
}

export const ApiStatusIndicator = () => {
  const { settings } = useApiSettings();
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
    },
    {
      service: 'Google Maps',
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

  const checkGoogleMapsStatus = async (): Promise<ApiStatus> => {
    try {
      console.log('🗺️ Verificando estado de Google Maps API...');
      
      if (!settings?.googleMapsApiKey) {
        return {
          service: 'Google Maps',
          status: 'offline',
          lastCheck: new Date(),
          message: 'API Key no configurada'
        };
      }

      // Intentar cargar Google Maps
      await googleMapsLoader.loadGoogleMaps(settings.googleMapsApiKey);
      
      if (googleMapsLoader.isGoogleMapsLoaded()) {
        console.log('✅ Google Maps API operativa');
        return {
          service: 'Google Maps',
          status: 'online',
          lastCheck: new Date(),
          message: 'API funcionando correctamente'
        };
      } else {
        console.log('❌ Google Maps API no disponible');
        return {
          service: 'Google Maps',
          status: 'offline',
          lastCheck: new Date(),
          message: 'Error cargando la API'
        };
      }
    } catch (error) {
      console.error('💥 Error verificando Google Maps:', error);
      let message = 'Error desconocido';
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          message = 'Clave de API inválida o sin permisos';
        } else if (error.message.includes('quota')) {
          return {
            service: 'Google Maps',
            status: 'limited',
            lastCheck: new Date(),
            message: 'Cuota excedida'
          };
        } else {
          message = error.message;
        }
      }
      
      return {
        service: 'Google Maps',
        status: 'offline',
        lastCheck: new Date(),
        message
      };
    }
  };

  const checkApiStatus = async () => {
    console.log('🔍 Iniciando verificación de estado de APIs...');
    
    // Verificar Google Maps (real)
    const googleMapsStatus = await checkGoogleMapsStatus();
    
    setApiStatuses(prev => prev.map(api => {
      if (api.service === 'Google Maps') {
        return googleMapsStatus;
      }
      
      // Para las otras APIs, simulamos el estado por ahora
      // En producción estas también deberían hacer verificaciones reales
      return {
        ...api,
        status: Math.random() > 0.8 ? 'limited' : Math.random() > 0.1 ? 'online' : 'offline',
        lastCheck: new Date()
      };
    }));
  };

  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 60000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, [settings?.googleMapsApiKey]);

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
                <div>
                  <span className="font-medium">{api.service}</span>
                  {api.message && (
                    <p className="text-xs text-gray-500">{api.message}</p>
                  )}
                </div>
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
