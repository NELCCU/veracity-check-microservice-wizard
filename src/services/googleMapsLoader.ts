
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

  async loadGoogleMaps(): Promise<void> {
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

      // Obtener la clave de API desde las variables de entorno
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        console.error('Google Maps API key no encontrada. Asegúrate de configurar VITE_GOOGLE_MAPS_API_KEY');
        reject(new Error('Google Maps API key no configurada'));
        return;
      }

      // Crear el script para cargar Google Maps
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log('✅ Google Maps API cargada exitosamente');
        this.isLoaded = true;
        resolve();
      };

      script.onerror = (error) => {
        console.error('❌ Error cargando Google Maps API:', error);
        reject(new Error('Error cargando Google Maps API'));
      };

      // Agregar el script al documento
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  isGoogleMapsLoaded(): boolean {
    return this.isLoaded && typeof google !== 'undefined' && google.maps;
  }
}

export const googleMapsLoader = GoogleMapsLoader.getInstance();
