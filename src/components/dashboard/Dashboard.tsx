
import { DashboardStats } from "./DashboardStats";
import { DashboardTabs } from "./DashboardTabs";
import { ApiStatusIndicator } from "@/components/settings/ApiStatusIndicator";
import { useQuery } from "@tanstack/react-query";
import { verificationStorage } from "@/services/verificationStorage";
import { dashboardService } from "@/services/dashboardService";

export const Dashboard = () => {
  // Cargar estadísticas de verificaciones
  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ['verification-stats'],
    queryFn: () => verificationStorage.getVerificationStats(),
  });

  // Cargar verificaciones recientes
  const { data: recentVerifications, refetch: refetchRecent } = useQuery({
    queryKey: ['recent-verifications'],
    queryFn: () => verificationStorage.getRecentVerifications(10),
  });

  // Cargar estadísticas avanzadas
  const { data: advancedStats, refetch: refetchAdvanced, isLoading: loadingAdvanced } = useQuery({
    queryKey: ['advanced-stats'],
    queryFn: () => dashboardService.getAdvancedStats(),
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardStats stats={stats || { today: { phones: 0, emails: 0, websites: 0, total: 0 } }} />
        </div>
        <div>
          <ApiStatusIndicator />
        </div>
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
