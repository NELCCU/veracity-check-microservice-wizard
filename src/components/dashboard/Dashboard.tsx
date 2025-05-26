
import { DashboardStats } from "./DashboardStats";
import { DashboardTabs } from "./DashboardTabs";
import { useQuery } from "@tanstack/react-query";
import { optimizedVerificationStorage } from "@/services/storage/OptimizedVerificationStorage";
import { dashboardService } from "@/services/dashboardService";

export const Dashboard = () => {
  // Cargar estadísticas de verificaciones con cache optimizado
  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ['verification-stats'],
    queryFn: () => optimizedVerificationStorage.getVerificationStats(),
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos (antes cacheTime)
  });

  // Cargar verificaciones recientes con cache optimizado
  const { data: recentVerifications, refetch: refetchRecent } = useQuery({
    queryKey: ['recent-verifications'],
    queryFn: () => optimizedVerificationStorage.getRecentVerifications(10),
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 3 * 60 * 1000, // 3 minutos (antes cacheTime)
  });

  // Cargar estadísticas avanzadas
  const { data: advancedStats, refetch: refetchAdvanced, isLoading: loadingAdvanced } = useQuery({
    queryKey: ['advanced-stats'],
    queryFn: () => dashboardService.getAdvancedStats(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)
  });

  const handleRefreshStats = () => {
    refetchStats();
    refetchRecent();
  };

  const handleLoadAdvancedStats = () => {
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
