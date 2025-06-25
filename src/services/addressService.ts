
import { errorHandlingService } from './errorHandlingService';
import { googleMapsLoader } from './googleMapsLoader';

export interface AddressVerificationResult {
  status: 'valid' | 'invalid';
  formattedAddress?: string;
  confidenceScore: number;
  locationType?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  placeId?: string;
  components: {
    streetNumber?: string;
    route?: string;
    locality?: string;
    administrativeAreaLevel1?: string;
    administrativeAreaLevel2?: string;
    country?: string;
    postalCode?: string;
  };
  types: string[];
  timestamp: string;
}

class AddressService {
  private geocoder: google.maps.Geocoder | null = null;

  private async initializeGeocoder(apiKey?: string): Promise<google.maps.Geocoder> {
    if (!this.geocoder) {
      // Asegurar que Google Maps esté cargado
      await googleMapsLoader.loadGoogleMaps(apiKey);
      
      // Verificar si Google Maps está disponible
      if (!googleMapsLoader.isGoogleMapsLoaded()) {
        throw new Error('Google Maps API no está disponible. Verifica que se haya cargado correctamente.');
      }
      
      this.geocoder = new google.maps.Geocoder();
    }
    return this.geocoder;
  }

  async verifyAddress(address: string, apiKey?: string): Promise<AddressVerificationResult> {
    try {
      console.log(`🏠 Iniciando verificación de dirección: ${address}`);
      
      const geocoder = await this.initializeGeocoder(apiKey);

      return new Promise((resolve, reject) => {
        geocoder.geocode(
          { address: address },
          (results, status) => {
            console.log(`📍 Estado de geocodificación: ${status}`);
            
            if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
              const result = results[0];
              
              // Extraer componentes de la dirección
              const components: any = {};
              result.address_components.forEach(component => {
                const types = component.types;
                if (types.includes('street_number')) {
                  components.streetNumber = component.long_name;
                } else if (types.includes('route')) {
                  components.route = component.long_name;
                } else if (types.includes('locality')) {
                  components.locality = component.long_name;
                } else if (types.includes('administrative_area_level_1')) {
                  components.administrativeAreaLevel1 = component.long_name;
                } else if (types.includes('administrative_area_level_2')) {
                  components.administrativeAreaLevel2 = component.long_name;
                } else if (types.includes('country')) {
                  components.country = component.long_name;
                } else if (types.includes('postal_code')) {
                  components.postalCode = component.long_name;
                }
              });

              // Calcular puntuación de confianza basada en la precisión
              let confidenceScore = 100;
              const locationType = result.geometry.location_type;
              
              switch (locationType) {
                case google.maps.GeocoderLocationType.ROOFTOP:
                  confidenceScore = 100;
                  break;
                case google.maps.GeocoderLocationType.RANGE_INTERPOLATED:
                  confidenceScore = 85;
                  break;
                case google.maps.GeocoderLocationType.GEOMETRIC_CENTER:
                  confidenceScore = 70;
                  break;
                case google.maps.GeocoderLocationType.APPROXIMATE:
                  confidenceScore = 50;
                  break;
                default:
                  confidenceScore = 30;
              }

              const verificationResult: AddressVerificationResult = {
                status: 'valid',
                formattedAddress: result.formatted_address,
                confidenceScore,
                locationType: locationType.toString(),
                coordinates: {
                  lat: result.geometry.location.lat(),
                  lng: result.geometry.location.lng()
                },
                placeId: result.place_id,
                components,
                types: result.types,
                timestamp: new Date().toISOString()
              };

              console.log('✅ Dirección verificada exitosamente:', verificationResult);
              resolve(verificationResult);
            } else {
              console.log('❌ Error en geocodificación:', status);
              
              // Manejar errores específicos de Google Maps
              let errorMessage = 'No se pudo verificar la dirección';
              
              switch (status) {
                case google.maps.GeocoderStatus.ZERO_RESULTS:
                  errorMessage = 'No se encontraron resultados para esta dirección';
                  break;
                case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
                  errorMessage = 'Se ha excedido el límite de consultas de Google Maps';
                  break;
                case google.maps.GeocoderStatus.REQUEST_DENIED:
                  errorMessage = 'Solicitud denegada. Verifica que el Geocoding API esté activado en Google Cloud Console';
                  break;
                case google.maps.GeocoderStatus.INVALID_REQUEST:
                  errorMessage = 'Solicitud inválida. Verifica el formato de la dirección';
                  break;
                case google.maps.GeocoderStatus.UNKNOWN_ERROR:
                  errorMessage = 'Error del servidor de Google Maps. Intenta de nuevo más tarde';
                  break;
                case google.maps.GeocoderStatus.ERROR:
                  errorMessage = 'Error de conexión con Google Maps';
                  break;
              }
              
              reject(new Error(errorMessage));
            }
          }
        );
      });
    } catch (error) {
      console.error('💥 Error en verificación de dirección:', error);
      
      // Manejar errores específicos de carga de API
      if (error instanceof Error) {
        if (error.message.includes('ApiNotActivatedMapError')) {
          throw new Error('El Geocoding API no está activado. Ve a Google Cloud Console → APIs & Services → Library → busca "Geocoding API" y actívalo.');
        }
      }
      
      throw errorHandlingService.handleError(error, 'google-maps');
    }
  }
}

export const addressService = new AddressService();
