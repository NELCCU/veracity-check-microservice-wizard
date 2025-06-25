
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
      console.log('✅ Google Maps ya está cargado');
      return Promise.resolve();
    }

    if (this.loadPromise) {
      console.log('🔄 Ya hay una carga en proceso, esperando...');
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      // Verificar si Google Maps ya está cargado
      if (typeof google !== 'undefined' && google.maps) {
        console.log('✅ Google Maps ya disponible globalmente');
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

      // Timeout para evitar que se quede cargando indefinidamente
      const timeoutId = setTimeout(() => {
        console.error('⏰ Timeout cargando Google Maps API');
        this.cleanup();
        reject(new Error('Timeout al cargar Google Maps API. Verifica tu conexión e inténtalo de nuevo.'));
      }, 15000); // 15 segundos timeout

      // Crear función de callback global
      const callbackName = 'initGoogleMaps_' + Date.now();
      (window as any)[callbackName] = () => {
        console.log('✅ Google Maps API cargada exitosamente');
        clearTimeout(timeoutId);
        this.isLoaded = true;
        delete (window as any)[callbackName]; // Limpiar callback
        resolve();
      };

      // Crear el script para cargar Google Maps
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places&loading=async&callback=${callbackName}`;
      script.async = true;
      script.defer = true;

      script.onerror = (error) => {
        console.error('❌ Error cargando Google Maps API:', error);
        clearTimeout(timeoutId);
        delete (window as any)[callbackName]; // Limpiar callback en caso de error
        this.cleanup();
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
    console.log('🔄 Reseteando Google Maps Loader');
    this.cleanup();
  }

  private cleanup() {
    this.isLoaded = false;
    this.loadPromise = null;
  }
}

export const googleMapsLoader = GoogleMapsLoader.getInstance();
