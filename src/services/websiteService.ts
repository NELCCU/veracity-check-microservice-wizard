
import { WebsiteVerificationResult } from "@/types/verification";

export class WebsiteService {
  private apiKey: string | null = null;

  constructor() {
    // Usar variables de entorno de Vite
    this.apiKey = import.meta.env.VITE_WEBSITE_API_KEY || null;
  }

  async verifyWebsite(url: string): Promise<WebsiteVerificationResult> {
    try {
      console.log(`Verificando sitio web: ${url}`);
      
      // Verificar accesibilidad del sitio
      const accessibility = await this.checkAccessibility(url);
      
      // Verificar si es duplicado (simulado)
      const isDuplicate = await this.checkDuplicate(url);
      
      // Obtener métricas de tráfico (simulado)
      const traffic = await this.getTrafficMetrics(url);
      
      const mockResult: WebsiteVerificationResult = {
        status: accessibility ? 'valid' : 'invalid',
        isDuplicate: isDuplicate,
        traffic: traffic,
        details: {
          httpStatus: accessibility ? 200 : 404,
          responseTime: Math.floor(Math.random() * 3000) + 200,
          ssl: this.checkSSL(url)
        },
        timestamp: new Date().toISOString()
      };

      return mockResult;
    } catch (error) {
      console.error('Error verificando sitio web:', error);
      throw new Error('Error al verificar el sitio web');
    }
  }

  private async checkAccessibility(url: string): Promise<boolean> {
    try {
      // En un entorno real, esto requeriría un proxy backend para evitar CORS
      // Por ahora, simulamos la verificación
      await new Promise(resolve => setTimeout(resolve, 2000));
      return Math.random() > 0.1; // 90% de sitios accesibles
    } catch {
      return false;
    }
  }

  private async checkDuplicate(url: string): Promise<boolean> {
    // En producción, esto consultaría la base de datos de Supabase
    await new Promise(resolve => setTimeout(resolve, 500));
    return Math.random() > 0.7; // 30% de duplicados
  }

  private async getTrafficMetrics(url: string) {
    // En producción, esto llamaría a SimilarWeb o Ahrefs API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      monthlyVisits: Math.floor(Math.random() * 10000000),
      ranking: Math.floor(Math.random() * 1000000),
      category: this.getRandomCategory()
    };
  }

  private checkSSL(url: string): boolean {
    return url.startsWith('https://');
  }

  private getRandomCategory(): string {
    const categories = [
      'Technology', 'Business', 'Education', 'Entertainment', 
      'News', 'E-commerce', 'Social Media', 'Healthcare'
    ];
    return categories[Math.floor(Math.random() * categories.length)];
  }
}

export const websiteService = new WebsiteService();
