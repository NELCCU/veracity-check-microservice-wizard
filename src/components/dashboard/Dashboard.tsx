
import { DashboardStats } from "./DashboardStats";
import { DashboardTabs } from "./DashboardTabs";
import { useQuery } from "@tanstack/react-query";
import { optimizedVerificationStorage } from "@/services/storage/OptimizedVerificationStorage";
import { dashboardService } from "@/services/dashboardService";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { useEffect } from "react";

export const Dashboard = () => {
  const { refreshAll, enableAutoRefresh } = useAutoRefresh();

  // Cargar estadísticas de verificaciones con cache optimizado
  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ['verification-stats'],
    queryFn: () => optimizedVerificationStorage.getVerificationStats(),
    staleTime: 1 * 60 * 1000, // 1 minuto (reducido para mejor actualización)
    gcTime: 3 * 60 * 1000, // 3 minutos
    refetchOnWindowFocus: true, // Refrescar al enfocar ventana
  });

  // Cargar verificaciones recientes con cache optimizado
  const { data: recentVerifications, refetch: refetchRecent } = useQuery({
    queryKey: ['recent-verifications'],
    queryFn: () => optimizedVerificationStorage.getRecentVerifications(10),
    staleTime: 30 * 1000, // 30 segundos (muy reducido para actualizaciones inmediatas)
    gcTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: true, // Refrescar al enfocar ventana
  });

  // Cargar estadísticas avanzadas
  const { data: advancedStats, refetch: refetchAdvanced, isLoading: loadingAdvanced } = useQuery({
    queryKey: ['advanced-stats'],
    queryFn: () => dashboardService.getAdvancedStats(),
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });

  // Habilitar auto-refresh cada 30 segundos
  useEffect(() => {
    const cleanup = enableAutoRefresh(30000);
    return cleanup;
  }, [enableAutoRefresh]);

  const handleRefreshStats = () => {
    console.log('🔄 Refrescando estadísticas manualmente...');
    refetchStats();
    refetchRecent();
  };

  const handleLoadAdvancedStats = () => {
    console.log('📊 Cargando estadísticas avanzadas...');
    refetchAdvanced();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Gestiona y monitorea tus verificaciones de datos
          </p>
        </div>
      </div>

      <div className="w-full">
        <DashboardStats stats={stats || { today: { phones: 0, emails: 0, websites: 0, total: 0 } }} />
      </div>

      <DashboardTabs 
        recentVerifications={recentVerifications || { phones: [], emails: [], websites: [] }}
        advancedStats={advancedStats || {}}
        loadingAdvanced={loadingAdvanced}
        onRefreshStats={handleRefreshStats}
        onLoadAdvancedStats={handleLoadAdvancedStats}
      />
    </div>
  );
};
