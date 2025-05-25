
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Settings, CheckCircle } from "lucide-react";
import { useApiSettings } from "@/hooks/useApiSettings";
import { useApiKeys } from "@/hooks/useApiKeys";
import { ApiStatusIndicator } from "./ApiStatusIndicator";
import { CollapsibleSection } from "./CollapsibleSection";
import { ProviderSettings } from "./ProviderSettings";
import { ApiKeysSection } from "./ApiKeysSection";

interface ApiKeyConfig {
  name: string;
  description: string;
  required: boolean;
  value: string;
  isVisible: boolean;
}

export const ApiKeySettings = () => {
  const { settings, isLoading, isSaving, saveSettings } = useApiSettings();
  const { apiKeys, saveApiKey, deleteApiKey } = useApiKeys();
  const [localSettings, setLocalSettings] = useState(settings);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    providers: true,
    apiKeys: true,
    status: true
  });
  
  const [apiKeyConfigs, setApiKeyConfigs] = useState<Record<string, ApiKeyConfig>>({
    numverify: {
      name: "NumVerify API Key",
      description: "Clave para verificación de números de teléfono",
      required: true,
      value: apiKeys.numverify?.api_key || "",
      isVisible: false
    },
    zerobounce: {
      name: "ZeroBounce API Key", 
      description: "Clave para verificación de correos electrónicos",
      required: true,
      value: apiKeys.zerobounce?.api_key || "",
      isVisible: false
    },
    similarweb: {
      name: "SimilarWeb API Key",
      description: "Clave para análisis de sitios web",
      required: true,
      value: apiKeys.similarweb?.api_key || "",
      isVisible: false
    },
    twilio: {
      name: "Twilio API Key",
      description: "Clave alternativa para verificación de teléfonos",
      required: false,
      value: apiKeys.twilio?.api_key || "",
      isVisible: false
    },
    hunter: {
      name: "Hunter API Key",
      description: "Clave alternativa para verificación de emails",
      required: false,
      value: apiKeys.hunter?.api_key || "",
      isVisible: false
    }
  });

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    setApiKeyConfigs(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        if (apiKeys[key]) {
          updated[key].value = apiKeys[key].api_key;
        }
      });
      return updated;
    });
  }, [apiKeys]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleApiKeyVisibility = (keyName: string) => {
    setApiKeyConfigs(prev => ({
      ...prev,
      [keyName]: {
        ...prev[keyName],
        isVisible: !prev[keyName].isVisible
      }
    }));
  };

  const updateApiKey = (keyName: string, value: string) => {
    setApiKeyConfigs(prev => ({
      ...prev,
      [keyName]: {
        ...prev[keyName],
        value
      }
    }));
  };

  const handleSaveApiKey = async (keyName: string) => {
    const config = apiKeyConfigs[keyName];
    if (config.value.trim()) {
      await saveApiKey(keyName, config.value.trim());
    }
  };

  const handleDeleteApiKey = async (keyName: string) => {
    await deleteApiKey(keyName);
    setApiKeyConfigs(prev => ({
      ...prev,
      [keyName]: {
        ...prev[keyName],
        value: ""
      }
    }));
  };

  const handleSaveSettings = async () => {
    if (!localSettings) return;
    await saveSettings(localSettings);
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Settings className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Cargando configuraciones...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <CollapsibleSection
        title="Estado de Servicios"
        icon={<CheckCircle className="h-4 w-4" />}
        isOpen={expandedSections.status}
        onToggle={() => toggleSection('status')}
      >
        <ApiStatusIndicator />
      </CollapsibleSection>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Configuración de APIs de Terceros
          </CardTitle>
          <CardDescription>
            Gestiona las claves API y proveedores para los servicios de verificación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <CollapsibleSection
            title="Proveedores de API"
            icon={<Settings className="h-4 w-4" />}
            isOpen={expandedSections.providers}
            onToggle={() => toggleSection('providers')}
          >
            <ProviderSettings
              settings={localSettings}
              isSaving={isSaving}
              onSettingsChange={setLocalSettings}
              onSave={handleSaveSettings}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Claves API"
            icon={<Key className="h-4 w-4" />}
            isOpen={expandedSections.apiKeys}
            onToggle={() => toggleSection('apiKeys')}
          >
            <ApiKeysSection
              apiKeyConfigs={apiKeyConfigs}
              onToggleVisibility={toggleApiKeyVisibility}
              onUpdateValue={updateApiKey}
              onSave={handleSaveApiKey}
              onDelete={handleDeleteApiKey}
            />
          </CollapsibleSection>
        </CardContent>
      </Card>
    </div>
  );
};
