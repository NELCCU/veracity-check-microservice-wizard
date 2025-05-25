
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, Calendar, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VerificationStats {
  daily: Array<{
    date: string;
    phones: number;
    emails: number;
    websites: number;
    total: number;
  }>;
  statusDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  typeDistribution: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  trends: {
    phonesTrend: number;
    emailsTrend: number;
    websitesTrend: number;
    totalTrend: number;
  };
}

interface VerificationChartsProps {
  stats: VerificationStats;
}

const chartConfig = {
  phones: {
    label: "Teléfonos",
    color: "#3b82f6"
  },
  emails: {
    label: "Emails", 
    color: "#10b981"
  },
  websites: {
    label: "Sitios Web",
    color: "#8b5cf6"
  },
  total: {
    label: "Total",
    color: "#f59e0b"
  }
};

export const VerificationCharts = ({ stats }: VerificationChartsProps) => {
  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-green-600";
    if (trend < 0) return "text-red-600";
    return "text-gray-500";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de barras - Verificaciones por día */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Verificaciones por Día (Últimos 7 días)
          </CardTitle>
          <CardDescription>
            Distribución de verificaciones por tipo en los últimos 7 días
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={stats.daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
              />
              <YAxis />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  day: '2-digit', 
                  month: 'long' 
                })}
              />
              <Legend />
              <Bar dataKey="phones" fill={chartConfig.phones.color} name="Teléfonos" />
              <Bar dataKey="emails" fill={chartConfig.emails.color} name="Emails" />
              <Bar dataKey="websites" fill={chartConfig.websites.color} name="Sitios Web" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico circular - Distribución por estado */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Verificaciones</CardTitle>
          <CardDescription>
            Distribución de resultados válidos vs inválidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <PieChart>
              <Pie
                data={stats.statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {stats.statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm text-gray-600">{data.value} verificaciones</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Métricas de tendencias */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencias</CardTitle>
          <CardDescription>
            Cambios respecto al período anterior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Teléfonos</span>
            <div className="flex items-center gap-2">
              {getTrendIcon(stats.trends.phonesTrend)}
              <span className={`text-sm font-medium ${getTrendColor(stats.trends.phonesTrend)}`}>
                {stats.trends.phonesTrend > 0 ? '+' : ''}{stats.trends.phonesTrend}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Emails</span>
            <div className="flex items-center gap-2">
              {getTrendIcon(stats.trends.emailsTrend)}
              <span className={`text-sm font-medium ${getTrendColor(stats.trends.emailsTrend)}`}>
                {stats.trends.emailsTrend > 0 ? '+' : ''}{stats.trends.emailsTrend}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sitios Web</span>
            <div className="flex items-center gap-2">
              {getTrendIcon(stats.trends.websitesTrend)}
              <span className={`text-sm font-medium ${getTrendColor(stats.trends.websitesTrend)}`}>
                {stats.trends.websitesTrend > 0 ? '+' : ''}{stats.trends.websitesTrend}%
              </span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">Total</span>
              <div className="flex items-center gap-2">
                {getTrendIcon(stats.trends.totalTrend)}
                <Badge variant={stats.trends.totalTrend > 0 ? "default" : stats.trends.totalTrend < 0 ? "destructive" : "secondary"}>
                  {stats.trends.totalTrend > 0 ? '+' : ''}{stats.trends.totalTrend}%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de líneas - Tendencia temporal */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Tendencia de Verificaciones</CardTitle>
          <CardDescription>
            Evolución del total de verificaciones en el tiempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <LineChart data={stats.daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
              />
              <YAxis />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  day: '2-digit', 
                  month: 'long' 
                })}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke={chartConfig.total.color} 
                strokeWidth={3}
                dot={{ fill: chartConfig.total.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: chartConfig.total.color, strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Distribución por tipo */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Distribución por Tipo de Verificación</CardTitle>
          <CardDescription>
            Porcentaje de uso de cada tipo de verificación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.typeDistribution.map((type, index) => (
              <div key={type.type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{type.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{type.count}</span>
                    <Badge variant="outline">{type.percentage}%</Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${type.percentage}%`,
                      backgroundColor: Object.values(chartConfig)[index]?.color || '#6b7280'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
