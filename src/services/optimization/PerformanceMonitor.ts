
/**
 * Performance Monitor - ISO/IEC 25010 Performance Efficiency
 * Monitorea y optimiza el rendimiento de la aplicación
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics = new Map<string, number[]>();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(operation: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.metrics.has(operation)) {
        this.metrics.set(operation, []);
      }
      
      const operationMetrics = this.metrics.get(operation)!;
      operationMetrics.push(duration);
      
      // Mantener solo las últimas 100 mediciones
      if (operationMetrics.length > 100) {
        operationMetrics.shift();
      }
      
      // Log si la operación es lenta
      if (duration > 2000) {
        console.warn(`⚠️ Operación lenta detectada: ${operation} tomó ${duration.toFixed(2)}ms`);
      }
    };
  }

  getMetrics(operation: string): { avg: number; min: number; max: number } | null {
    const metrics = this.metrics.get(operation);
    if (!metrics || metrics.length === 0) return null;

    return {
      avg: metrics.reduce((a, b) => a + b, 0) / metrics.length,
      min: Math.min(...metrics),
      max: Math.max(...metrics)
    };
  }
}
