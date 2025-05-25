
import { DashboardStats } from "./DashboardStats";
import { DashboardTabs } from "./DashboardTabs";
import { ApiStatusIndicator } from "@/components/settings/ApiStatusIndicator";

export const Dashboard = () => {
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

      {/* Indicador de estado de APIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardStats />
        </div>
        <div>
          <ApiStatusIndicator />
        </div>
      </div>

      <DashboardTabs />
    </div>
  );
};
