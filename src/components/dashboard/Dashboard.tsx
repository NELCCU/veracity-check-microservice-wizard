
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Globe, BarChart3, History, Database, TrendingUp } from "lucide-react";
import { PhoneVerification } from "@/components/verification/PhoneVerification";
import { EmailVerification } from "@/components/verification/EmailVerification";
import { WebsiteVerification } from "@/components/verification/WebsiteVerification";
import { BatchVerification } from "@/components/verification/BatchVerification";
import { VerificationCharts } from "@/components/dashboard/VerificationCharts";
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
      {/* Estadísticas del día */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teléfonos Hoy</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today.phones}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Hoy</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today.emails}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sitios Web Hoy</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today.websites}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hoy</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today.total}</div>
          </CardContent>
        </Card>
      </div>

      {/* Área principal con pestañas */}
      <Tabs defaultValue="phone" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Teléfonos
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Emails
          </TabsTrigger>
          <TabsTrigger value="website" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Sitios Web
          </TabsTrigger>
          <TabsTrigger value="batch" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Lote
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="phone">
          <PhoneVerification onVerificationComplete={refreshStats} />
        </TabsContent>

        <TabsContent value="email">
          <EmailVerification onVerificationComplete={refreshStats} />
        </TabsContent>

        <TabsContent value="website">
          <WebsiteVerification onVerificationComplete={refreshStats} />
        </TabsContent>

        <TabsContent value="batch">
          <BatchVerification />
        </TabsContent>

        <TabsContent value="analytics">
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
                    onClick={loadAdvancedStats}
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
                      onClick={loadAdvancedStats}
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
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Verificaciones Recientes
              </CardTitle>
              <CardDescription>
                Últimas 5 verificaciones realizadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentVerifications.phones.length === 0 && 
               recentVerifications.emails.length === 0 && 
               recentVerifications.websites.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No hay verificaciones recientes
                </p>
              ) : (
                <div className="space-y-3">
                  {recentVerifications.phones.map((verification: any) => (
                    <div key={verification.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <span className="font-mono">{verification.phone_number}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={verification.status === 'valid' ? 'default' : 'destructive'}>
                          {verification.status === 'valid' ? 'Válido' : 'Inválido'}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(verification.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}

                  {recentVerifications.emails.map((verification: any) => (
                    <div key={verification.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-green-600" />
                        <span>{verification.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={verification.status === 'valid' ? 'default' : 'destructive'}>
                          {verification.status === 'valid' ? 'Válido' : 'Inválido'}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(verification.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}

                  {recentVerifications.websites.map((verification: any) => (
                    <div key={verification.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-purple-600" />
                        <span>{verification.url}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={verification.status === 'valid' ? 'default' : 'destructive'}>
                          {verification.status === 'valid' ? 'Válido' : 'Inválido'}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(verification.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
