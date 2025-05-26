
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

  // Función para combinar y ordenar todas las verificaciones por fecha
  const getAllVerificationsSorted = () => {
    const allVerifications = [
      ...recentVerifications.phones.map(v => ({ ...v, type: 'phone' as const })),
      ...recentVerifications.emails.map(v => ({ ...v, type: 'email' as const })),
      ...recentVerifications.websites.map(v => ({ ...v, type: 'website' as const }))
    ];

    // Ordenar por fecha de creación (más reciente primero)
    return allVerifications.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
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

  const sortedVerifications = getAllVerificationsSorted();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Verificaciones Recientes
        </CardTitle>
        <CardDescription>
          Últimas verificaciones realizadas ordenadas por fecha - Haz clic para ver análisis completo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasNoVerifications ? (
          <p className="text-center text-gray-500 py-8">
            No hay verificaciones recientes
          </p>
        ) : (
          <div className="space-y-3">
            {sortedVerifications.map((verification) => (
              <VerificationListItem
                key={`${verification.type}-${verification.id}`}
                verification={verification}
                type={verification.type}
                onItemClick={handleItemClick}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
