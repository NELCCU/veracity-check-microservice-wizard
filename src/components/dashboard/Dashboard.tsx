
import { DashboardStats } from "./DashboardStats";
import { DashboardTabs } from "./DashboardTabs";
import { ApiStatusIndicator } from "@/components/settings/ApiStatusIndicator";

export const Dashboard = () => {
  // Mock data for now - in a real app this would come from API
  const mockStats = {
    totalVerifications: 0,
    successfulVerifications: 0,
    failedVerifications: 0,
    todayVerifications: 0
  };

  const mockRecentVerifications: any[] = [];
  const mockAdvancedStats = {};

  const handleRefreshStats = () => {
    // Implement refresh logic
  };

  const handleLoadAdvancedStats = () => {
    // Implement advanced stats loading
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
          <DashboardStats stats={mockStats} />
        </div>
        <div>
          <ApiStatusIndicator />
        </div>
      </div>

      <DashboardTabs 
        recentVerifications={mockRecentVerifications}
        advancedStats={mockAdvancedStats}
        loadingAdvanced={false}
        onRefreshStats={handleRefreshStats}
        onLoadAdvancedStats={handleLoadAdvancedStats}
      />
    </div>
  );
};
