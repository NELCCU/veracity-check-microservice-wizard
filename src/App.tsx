
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/components/dashboard/Dashboard";
import Index from "./pages/Index";
import ApiDocs from "./pages/ApiDocs";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/api-docs" element={<ApiDocs />} />
              <Route path="/legacy" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
