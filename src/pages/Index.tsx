
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhoneVerification } from "@/components/verification/PhoneVerification";
import { EmailVerification } from "@/components/verification/EmailVerification";
import { WebsiteVerification } from "@/components/verification/WebsiteVerification";
import { BatchVerification } from "@/components/verification/BatchVerification";
import { Shield, Phone, Mail, Globe, Database } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Veracity Check</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Microservicio seguro para verificación de números de teléfono, correos electrónicos y sitios web
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>ISO/IEC 27001 & 25010 Compliant</span>
          </div>
        </div>

        <Tabs defaultValue="phone" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
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
            <TabsTrigger value="batch" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Lote
            </TabsTrigger>
          </TabsList>

          <TabsContent value="phone">
            <PhoneVerification />
          </TabsContent>

          <TabsContent value="email">
            <EmailVerification />
          </TabsContent>

          <TabsContent value="website">
            <WebsiteVerification />
          </TabsContent>

          <TabsContent value="batch">
            <BatchVerification />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
