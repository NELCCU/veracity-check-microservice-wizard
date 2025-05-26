
import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook para gestión automática de actualizaciones del historial
 */
export const useAutoRefresh = () => {
  const queryClient = useQueryClient();

  // Función para refrescar todas las queries relacionadas
  const refreshAll = useCallback(() => {
    console.log('🔄 Refrescando todas las queries...');
    queryClient.invalidateQueries({ queryKey: ['verification-stats'] });
    queryClient.invalidateQueries({ queryKey: ['recent-verifications'] });
    queryClient.invalidateQueries({ queryKey: ['advanced-stats'] });
  }, [queryClient]);

  // Función para refrescar solo estadísticas
  const refreshStats = useCallback(() => {
    console.log('📊 Refrescando estadísticas...');
    queryClient.invalidateQueries({ queryKey: ['verification-stats'] });
    queryClient.invalidateQueries({ queryKey: ['advanced-stats'] });
  }, [queryClient]);

  // Función para refrescar solo historial
  const refreshHistory = useCallback(() => {
    console.log('📋 Refrescando historial...');
    queryClient.invalidateQueries({ queryKey: ['recent-verifications'] });
  }, [queryClient]);

  // Auto-refresh periódico (opcional)
  const enableAutoRefresh = useCallback((intervalMs: number = 30000) => {
    const interval = setInterval(() => {
      refreshStats();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [refreshStats]);

  return {
    refreshAll,
    refreshStats,
    refreshHistory,
    enableAutoRefresh
  };
};
