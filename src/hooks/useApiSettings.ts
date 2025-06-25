
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ApiSettings {
  phoneApiProvider: 'numverify' | 'twilio';
  emailApiProvider: 'zerobounce' | 'hunter';
  websiteApiProvider: 'similar_web' | 'builtwith';
  dailyVerificationLimit: number;
  googleMapsApiKey?: string;
}

export const useApiSettings = () => {
  const [settings, setSettings] = useState<ApiSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          phoneApiProvider: data.phone_api_provider as 'numverify' | 'twilio',
          emailApiProvider: data.email_api_provider as 'zerobounce' | 'hunter',
          websiteApiProvider: data.website_api_provider as 'similar_web' | 'builtwith',
          dailyVerificationLimit: data.daily_verification_limit || 100,
          googleMapsApiKey: (data as any).google_maps_api_key || ''
        });
      } else {
        // Crear configuración por defecto
        const defaultSettings = {
          phoneApiProvider: 'numverify' as const,
          emailApiProvider: 'zerobounce' as const,
          websiteApiProvider: 'similar_web' as const,
          dailyVerificationLimit: 100,
          googleMapsApiKey: ''
        };
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las configuraciones",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: ApiSettings) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      console.log('💾 Guardando configuraciones para usuario:', user.id);

      // Verificar si ya existe una configuración para este usuario
      const { data: existingSettings } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      const updateData: any = {
        user_id: user.id,
        phone_api_provider: newSettings.phoneApiProvider,
        email_api_provider: newSettings.emailApiProvider,
        website_api_provider: newSettings.websiteApiProvider,
        daily_verification_limit: newSettings.dailyVerificationLimit,
        updated_at: new Date().toISOString()
      };

      // Solo agregar google_maps_api_key si está definido
      if (newSettings.googleMapsApiKey !== undefined) {
        updateData.google_maps_api_key = newSettings.googleMapsApiKey;
      }

      let result;
      if (existingSettings) {
        // Actualizar configuración existente
        result = await supabase
          .from('user_settings')
          .update(updateData)
          .eq('user_id', user.id);
      } else {
        // Crear nueva configuración
        result = await supabase
          .from('user_settings')
          .insert(updateData);
      }

      if (result.error) {
        console.error('Error en la base de datos:', result.error);
        throw result.error;
      }

      setSettings(newSettings);
      console.log('✅ Configuraciones guardadas exitosamente');
      toast({
        title: "Configuración guardada",
        description: "Las configuraciones se han actualizado correctamente"
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      let errorMessage = "No se pudieron guardar las configuraciones";
      
      if (error instanceof Error) {
        if (error.message.includes('duplicate key')) {
          errorMessage = "Error de duplicación en la base de datos. Intenta recargar la página.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    isLoading,
    isSaving,
    saveSettings,
    reloadSettings: loadSettings
  };
};
