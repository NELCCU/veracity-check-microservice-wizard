
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";
import { VerificationListItem } from "@/components/verification/history/VerificationListItem";
import { VerificationDetail } from "@/components/verification/history/VerificationDetail";
import { verificationStorage } from "@/services/verificationStorage";

interface RecentVerificationsProps {
  recentVerifications: {
    phones: any[];
    emails: any[];
    websites: any[];
  };
  onRefresh?: () => void;
}

export const RecentVerifications = ({ recentVerifications: initialVerifications, onRefresh }: RecentVerificationsProps) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [recentVerifications, setRecentVerifications] = useState(initialVerifications);

  useEffect(() => {
    setRecentVerifications(initialVerifications);
  }, [initialVerifications]);

  const hasNoVerifications = 
    recentVerifications.phones.length === 0 && 
    recentVerifications.emails.length === 0 && 
    recentVerifications.websites.length === 0;

  const handleItemClick = (item: any, type: 'phone' | 'email' | 'website') => {
    setSelectedItem({ ...item, type });
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedItem(null);
    setViewMode('list');
  };

  const handleVerificationDeleted = async () => {
    // Refrescar la lista de verificaciones
    try {
      const updatedVerifications = await verificationStorage.getRecentVerifications();
      setRecentVerifications(updatedVerifications);
      onRefresh?.();
    } catch (error) {
      console.error('Error refrescando verificaciones:', error);
    }
  };

  if (viewMode === 'detail' && selectedItem) {
    return (
      <VerificationDetail 
        selectedItem={selectedItem} 
        onBackToList={handleBackToList}
        onVerificationDeleted={handleVerificationDeleted}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Verificaciones Recientes
        </CardTitle>
        <CardDescription>
          Últimas 5 verificaciones realizadas - Haz clic para ver análisis completo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasNoVerifications ? (
          <p className="text-center text-gray-500 py-8">
            No hay verificaciones recientes
          </p>
        ) : (
          <div className="space-y-3">
            {recentVerifications.phones.map((verification: any) => (
              <VerificationListItem
                key={verification.id}
                verification={verification}
                type="phone"
                onItemClick={handleItemClick}
              />
            ))}

            {recentVerifications.emails.map((verification: any) => (
              <VerificationListItem
                key={verification.id}
                verification={verification}
                type="email"
                onItemClick={handleItemClick}
              />
            ))}

            {recentVerifications.websites.map((verification: any) => (
              <VerificationListItem
                key={verification.id}
                verification={verification}
                type="website"
                onItemClick={handleItemClick}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
