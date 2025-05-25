
import { toast } from "@/components/ui/sonner";

export interface ApiError {
  type: 'network' | 'authentication' | 'quota_exceeded' | 'api_unavailable' | 'validation' | 'unknown';
  message: string;
  originalError?: Error;
  statusCode?: number;
  service?: 'numverify' | 'zerobounce' | 'similarweb' | 'general';
}

export class ErrorHandlingService {
  
  static analyzeError(error: any, service?: string): ApiError {
    console.error(`Error in ${service || 'unknown service'}:`, error);

    // Error de red
    if (error.name === 'TypeError' || error.message?.includes('fetch')) {
      return {
        type: 'network',
        message: 'Error de conexión. Verifica tu conexión a internet.',
        originalError: error,
        service: service as any
      };
    }

    // Error de API con código de estado
    if (error.status || error.statusCode) {
      const statusCode = error.status || error.statusCode;
      
      switch (statusCode) {
        case 401:
        case 403:
          return {
            type: 'authentication',
            message: 'Error de autenticación. Verifica las credenciales de la API.',
            statusCode,
            service: service as any
          };
        
        case 429:
          return {
            type: 'quota_exceeded',
            message: 'Límite de solicitudes excedido. Plan de API agotado.',
            statusCode,
            service: service as any
          };
        
        case 500:
        case 502:
        case 503:
        case 504:
          return {
            type: 'api_unavailable',
            message: 'Servicio de API temporalmente no disponible.',
            statusCode,
            service: service as any
          };
        
        default:
          return {
            type: 'unknown',
            message: `Error del servidor (${statusCode}). Inténtalo más tarde.`,
            statusCode,
            service: service as any
          };
      }
    }

    // Errores específicos por mensaje
    const errorMessage = error.message?.toLowerCase() || '';
    
    if (errorMessage.includes('quota') || errorMessage.includes('limit') || errorMessage.includes('credits')) {
      return {
        type: 'quota_exceeded',
        message: 'Plan de API agotado. Contacta al administrador para renovar.',
        originalError: error,
        service: service as any
      };
    }

    if (errorMessage.includes('api key') || errorMessage.includes('unauthorized') || errorMessage.includes('forbidden')) {
      return {
        type: 'authentication',
        message: 'Error de autenticación. Verifica la configuración de la API.',
        originalError: error,
        service: service as any
      };
    }

    if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
      return {
        type: 'network',
        message: 'Tiempo de espera agotado. Verifica tu conexión.',
        originalError: error,
        service: service as any
      };
    }

    // Error genérico
    return {
      type: 'unknown',
      message: error.message || 'Error desconocido. Inténtalo más tarde.',
      originalError: error,
      service: service as any
    };
  }

  static handleError(error: any, service?: string): ApiError {
    const apiError = this.analyzeError(error, service);
    this.showErrorNotification(apiError);
    return apiError;
  }

  static showErrorNotification(apiError: ApiError) {
    const serviceNames = {
      numverify: 'NumVerify (Teléfonos)',
      zerobounce: 'ZeroBounce (Emails)',
      similarweb: 'SimilarWeb (Sitios Web)',
      general: 'Sistema'
    };

    const serviceName = apiError.service ? serviceNames[apiError.service] || apiError.service : 'Servicio';

    let title = '';
    let description = apiError.message;
    let variant: 'default' | 'destructive' = 'destructive';

    switch (apiError.type) {
      case 'quota_exceeded':
        title = `⚠️ Límite de ${serviceName} Agotado`;
        description = `${apiError.message} Contacta al administrador para renovar el plan.`;
        break;
      
      case 'authentication':
        title = `🔑 Error de Autenticación - ${serviceName}`;
        description = `${apiError.message} Contacta al administrador del sistema.`;
        break;
      
      case 'api_unavailable':
        title = `🔧 ${serviceName} No Disponible`;
        description = `${apiError.message} Inténtalo en unos minutos.`;
        break;
      
      case 'network':
        title = `🌐 Error de Conexión`;
        description = apiError.message;
        break;
      
      case 'validation':
        title = `📝 Error de Validación`;
        description = apiError.message;
        variant = 'default';
        break;
      
      default:
        title = `❌ Error en ${serviceName}`;
        description = apiError.message;
    }

    toast(title, {
      description,
      duration: apiError.type === 'quota_exceeded' ? 10000 : 5000,
    });

    // Log adicional para errores críticos
    if (apiError.type === 'quota_exceeded' || apiError.type === 'authentication') {
      console.warn(`CRITICAL ERROR - ${apiError.type}:`, {
        service: apiError.service,
        message: apiError.message,
        statusCode: apiError.statusCode,
        timestamp: new Date().toISOString()
      });
    }
  }

  static isRecoverableError(apiError: ApiError): boolean {
    return apiError.type === 'network' || apiError.type === 'api_unavailable';
  }

  static getRetryDelay(apiError: ApiError): number {
    switch (apiError.type) {
      case 'network':
        return 2000; // 2 segundos
      case 'api_unavailable':
        return 5000; // 5 segundos
      default:
        return 0; // No reintentar
    }
  }
}

export const errorHandlingService = ErrorHandlingService;
