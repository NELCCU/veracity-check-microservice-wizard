
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ApiKeyData {
  id?: string;
  service_name: string;
  api_key: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<Record<string, ApiKeyData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const loadApiKeys = async () => {
    try {
      const storedKeys = localStorage.getItem('api_keys');
      if (storedKeys) {
        const parsedKeys = JSON.parse(storedKeys);
        setApiKeys(parsedKeys);
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las claves API",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = async (serviceName: string, apiKey: string, isActive: boolean = true) => {
    setIsSaving(true);
    try {
      const newKey: ApiKeyData = {
        id: Date.now().toString(),
        service_name: serviceName,
        api_key: apiKey,
        is_active: isActive,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const updatedKeys = {
        ...apiKeys,
        [serviceName]: newKey
      };

      setApiKeys(updatedKeys);
      localStorage.setItem('api_keys', JSON.stringify(updatedKeys));

      toast({
        title: "Clave API guardada",
        description: `La clave para ${serviceName} se ha guardado correctamente`
      });
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la clave API",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteApiKey = async (serviceName: string) => {
    try {
      const updatedKeys = { ...apiKeys };
      delete updatedKeys[serviceName];
      
      setApiKeys(updatedKeys);
      localStorage.setItem('api_keys', JSON.stringify(updatedKeys));

      toast({
        title: "Clave API eliminada",
        description: `La clave para ${serviceName} se ha eliminado`
      });
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la clave API",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadApiKeys();
  }, []);

  return {
    apiKeys,
    isLoading,
    isSaving,
    saveApiKey,
    deleteApiKey,
    reloadApiKeys: loadApiKeys
  };
};
