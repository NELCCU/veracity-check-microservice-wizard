
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Mail, Globe, Database, TrendingUp, History } from "lucide-react";
import { PhoneVerification } from "@/components/verification/PhoneVerification";
import { EmailVerification } from "@/components/verification/EmailVerification";
import { WebsiteVerification } from "@/components/verification/WebsiteVerification";
import { BatchVerification } from "@/components/verification/BatchVerification";
import { RecentVerifications } from "./RecentVerifications";
import { AdvancedAnalytics } from "./AdvancedAnalytics";

interface DashboardTabsProps {
  recentVerifications: {
    phones: any[];
    emails: any[];
    websites: any[];
  };
  advancedStats: any;
  loadingAdvanced: boolean;
  onRefreshStats: () => void;
  onLoadAdvancedStats: () => void;
}

export const DashboardTabs = ({ 
  recentVerifications, 
  advancedStats, 
  loadingAdvanced, 
  onRefreshStats, 
  onLoadAdvancedStats 
}: DashboardTabsProps) => {
  return (
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
        <PhoneVerification onVerificationComplete={onRefreshStats} />
      </TabsContent>

      <TabsContent value="email">
        <EmailVerification onVerificationComplete={onRefreshStats} />
      </TabsContent>

      <TabsContent value="website">
        <WebsiteVerification onVerificationComplete={onRefreshStats} />
      </TabsContent>

      <TabsContent value="batch">
        <BatchVerification />
      </TabsContent>

      <TabsContent value="analytics">
        <AdvancedAnalytics 
          advancedStats={advancedStats}
          loadingAdvanced={loadingAdvanced}
          onLoadAdvancedStats={onLoadAdvancedStats}
        />
      </TabsContent>

      <TabsContent value="history">
        <RecentVerifications 
          recentVerifications={recentVerifications}
          onRefresh={onRefreshStats}
        />
      </TabsContent>
    </Tabs>
  );
};
