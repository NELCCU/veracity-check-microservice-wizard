
/**
 * Cache Manager - Optimización de rendimiento según ISO/IEC 25010
 * Implementa estrategias de cache avanzadas para mejorar la eficiencia
 */
export class CacheManager {
  private static instance: CacheManager;
  private cache = new Map<string, { data: any; timestamp: number; ttl: number; accessCount: number }>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos
  private readonly MAX_CACHE_SIZE = 100; // Límite de entradas en cache
  private cleanupInterval: NodeJS.Timeout | null = null;

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
      CacheManager.instance.startCleanupScheduler();
    }
    return CacheManager.instance;
  }

  private startCleanupScheduler(): void {
    // Limpieza automática cada 2 minutos
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 2 * 60 * 1000);
  }

  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    // Si el cache está lleno, remover el elemento menos accedido
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictLeastAccessed();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 0
    });
    
    console.log(`💾 Cache actualizado para: ${key}`);
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      console.log(`🗑️ Cache expirado removido: ${key}`);
      return null;
    }

    // Incrementar contador de acceso
    item.accessCount++;
    return item.data;
  }

  // Remover elemento específico
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      console.log(`🗑️ Cache removido manualmente: ${key}`);
    }
    return deleted;
  }

  // Limpiar todo el cache
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`🗑️ Cache completo limpiado (${size} entradas removidas)`);
  }

  // Limpieza automática de entradas expiradas
  cleanup(): void {
    const now = Date.now();
    let removedCount = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
        removedCount++;
      }
    }
    
    if (removedCount > 0) {
      console.log(`🧹 Limpieza automática: ${removedCount} entradas expiradas removidas`);
    }
  }

  // Estrategia LFU (Least Frequently Used) para evicción
  private evictLeastAccessed(): void {
    let leastAccessedKey = '';
    let minAccessCount = Infinity;

    for (const [key, item] of this.cache.entries()) {
      if (item.accessCount < minAccessCount) {
        minAccessCount = item.accessCount;
        leastAccessedKey = key;
      }
    }

    if (leastAccessedKey) {
      this.cache.delete(leastAccessedKey);
      console.log(`🗑️ Cache evictado (LFU): ${leastAccessedKey}`);
    }
  }

  // Obtener estadísticas del cache
  getStats(): { size: number; maxSize: number; hitRate: number } {
    const totalAccess = Array.from(this.cache.values())
      .reduce((sum, item) => sum + item.accessCount, 0);
    
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      hitRate: totalAccess / Math.max(this.cache.size, 1)
    };
  }

  // Destructor para limpiar intervalos
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}
