
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhoneVerification } from "@/components/verification/PhoneVerification";
import { EmailVerification } from "@/components/verification/EmailVerification";
import { WebsiteVerification } from "@/components/verification/WebsiteVerification";
import { CorporateVerification } from "@/components/verification/CorporateVerification";
import { BatchVerification } from "@/components/verification/BatchVerification";
import { RecentVerifications } from "./RecentVerifications";
import { Phone, Mail, Globe, Building2, FileSpreadsheet, History } from "lucide-react";

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
    <Tabs defaultValue="phone" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="phone" className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Teléfono
        </TabsTrigger>
        <TabsTrigger value="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email
        </TabsTrigger>
        <TabsTrigger value="website" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Sitio Web
        </TabsTrigger>
        <TabsTrigger value="corporate" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Corporativo
        </TabsTrigger>
        <TabsTrigger value="batch" className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Lotes
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Historial
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="phone" className="mt-6">
        <PhoneVerification />
      </TabsContent>
      
      <TabsContent value="email" className="mt-6">
        <EmailVerification />
      </TabsContent>
      
      <TabsContent value="website" className="mt-6">
        <WebsiteVerification />
      </TabsContent>

      <TabsContent value="corporate" className="mt-6">
        <CorporateVerification />
      </TabsContent>
      
      <TabsContent value="batch" className="mt-6">
        <BatchVerification />
      </TabsContent>
      
      <TabsContent value="history" className="mt-6">
        <RecentVerifications 
          recentVerifications={recentVerifications}
          onRefresh={onRefreshStats}
        />
      </TabsContent>
    </Tabs>
  );
};
