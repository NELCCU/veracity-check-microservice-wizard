
import { useState, useEffect } from "react";
import { DashboardStats } from "./DashboardStats";
import { DashboardTabs } from "./DashboardTabs";
import { verificationStorage } from "@/services/verificationStorage";
import { dashboardService } from "@/services/dashboardService";

export const Dashboard = () => {
  const [stats, setStats] = useState({
    today: { phones: 0, emails: 0, websites: 0, total: 0 }
  });
  const [recentVerifications, setRecentVerifications] = useState({
    phones: [],
    emails: [],
    websites: []
  });
  const [advancedStats, setAdvancedStats] = useState(null);
  const [loadingAdvanced, setLoadingAdvanced] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const [statsData, recentData] = await Promise.all([
      verificationStorage.getVerificationStats(),
      verificationStorage.getRecentVerifications(5)
    ]);
    
    setStats(statsData);
    setRecentVerifications(recentData);
  };

  const loadAdvancedStats = async () => {
    setLoadingAdvanced(true);
    try {
      const data = await dashboardService.getAdvancedStats();
      setAdvancedStats(data);
    } catch (error) {
      console.error('Error cargando estadísticas avanzadas:', error);
    } finally {
      setLoadingAdvanced(false);
    }
  };

  const refreshStats = () => {
    loadDashboardData();
    if (advancedStats) {
      loadAdvancedStats();
    }
  };

  return (
    <div className="space-y-6">
      <DashboardStats stats={stats} />
      <DashboardTabs 
        recentVerifications={recentVerifications}
        advancedStats={advancedStats}
        loadingAdvanced={loadingAdvanced}
        onRefreshStats={refreshStats}
        onLoadAdvancedStats={loadAdvancedStats}
      />
    </div>
  );
};
