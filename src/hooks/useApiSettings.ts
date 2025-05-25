
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ApiSettings {
  phoneApiProvider: 'numverify' | 'twilio';
  emailApiProvider: 'zerobounce' | 'hunter';
  websiteApiProvider: 'similar_web' | 'builtwith';
  dailyVerificationLimit: number;
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
          dailyVerificationLimit: data.daily_verification_limit || 100
        });
      } else {
        // Crear configuración por defecto
        const defaultSettings = {
          phoneApiProvider: 'numverify' as const,
          emailApiProvider: 'zerobounce' as const,
          websiteApiProvider: 'similar_web' as const,
          dailyVerificationLimit: 100
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

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          phone_api_provider: newSettings.phoneApiProvider,
          email_api_provider: newSettings.emailApiProvider,
          website_api_provider: newSettings.websiteApiProvider,
          daily_verification_limit: newSettings.dailyVerificationLimit,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSettings(newSettings);
      toast({
        title: "Configuración guardada",
        description: "Las configuraciones se han actualizado correctamente"
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar las configuraciones",
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
