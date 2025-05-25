
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { VerificationCharts } from "@/components/dashboard/VerificationCharts";

interface AdvancedAnalyticsProps {
  advancedStats: any;
  loadingAdvanced: boolean;
  onLoadAdvancedStats: () => void;
}

export const AdvancedAnalytics = ({ 
  advancedStats, 
  loadingAdvanced, 
  onLoadAdvancedStats 
}: AdvancedAnalyticsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Dashboard Avanzado
        </CardTitle>
        <CardDescription>
          Análisis detallado de tus verificaciones con gráficos y tendencias
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!advancedStats ? (
          <div className="text-center py-8">
            <button
              onClick={onLoadAdvancedStats}
              disabled={loadingAdvanced}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingAdvanced ? 'Cargando...' : 'Cargar Analytics'}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Haz clic para generar gráficos y estadísticas avanzadas
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Estadísticas de los últimos 7 días</h3>
              <button
                onClick={onLoadAdvancedStats}
                disabled={loadingAdvanced}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50"
              >
                {loadingAdvanced ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>
            <VerificationCharts stats={advancedStats} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
