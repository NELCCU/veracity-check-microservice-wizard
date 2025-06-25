
// Servicio para cargar la API de Google Maps
class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private loadPromise: Promise<void> | null = null;
  private isLoaded = false;

  private constructor() {}

  static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  async loadGoogleMaps(apiKey?: string): Promise<void> {
    if (this.isLoaded) {
      return Promise.resolve();
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      // Verificar si Google Maps ya está cargado
      if (typeof google !== 'undefined' && google.maps) {
        this.isLoaded = true;
        resolve();
        return;
      }

      // Usar la clave proporcionada
      if (!apiKey || apiKey.trim() === '') {
        console.error('❌ Google Maps API key no proporcionada');
        reject(new Error('Google Maps API key es requerida para verificar direcciones'));
        return;
      }

      console.log('🗺️ Cargando Google Maps API...');

      // Crear el script para cargar Google Maps con callback y async
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places&loading=async&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;

      // Crear función de callback global
      (window as any).initGoogleMaps = () => {
        console.log('✅ Google Maps API cargada exitosamente');
        this.isLoaded = true;
        delete (window as any).initGoogleMaps; // Limpiar callback
        resolve();
      };

      script.onerror = (error) => {
        console.error('❌ Error cargando Google Maps API:', error);
        delete (window as any).initGoogleMaps; // Limpiar callback en caso de error
        reject(new Error('Error cargando Google Maps API. Verifica que la clave sea válida y que el dominio esté autorizado.'));
      };

      // Agregar el script al documento
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  isGoogleMapsLoaded(): boolean {
    return this.isLoaded && typeof google !== 'undefined' && !!google.maps;
  }

  // Método para reset en caso de errores
  reset() {
    this.isLoaded = false;
    this.loadPromise = null;
  }
}

export const googleMapsLoader = GoogleMapsLoader.getInstance();
