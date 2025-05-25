
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const keysMap: Record<string, ApiKeyData> = {};
      data?.forEach(key => {
        keysMap[key.service_name] = key;
      });

      setApiKeys(keysMap);
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const existingKey = apiKeys[serviceName];

      if (existingKey) {
        // Actualizar clave existente
        const { error } = await supabase
          .from('api_keys')
          .update({
            api_key: apiKey,
            is_active: isActive,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingKey.id);

        if (error) throw error;
      } else {
        // Crear nueva clave
        const { error } = await supabase
          .from('api_keys')
          .insert({
            user_id: user.id,
            service_name: serviceName,
            api_key: apiKey,
            is_active: isActive
          });

        if (error) throw error;
      }

      // Actualizar estado local
      setApiKeys(prev => ({
        ...prev,
        [serviceName]: {
          ...prev[serviceName],
          service_name: serviceName,
          api_key: apiKey,
          is_active: isActive
        }
      }));

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
      const existingKey = apiKeys[serviceName];
      if (!existingKey?.id) return;

      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', existingKey.id);

      if (error) throw error;

      setApiKeys(prev => {
        const newKeys = { ...prev };
        delete newKeys[serviceName];
        return newKeys;
      });

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
