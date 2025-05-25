
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Key, Save, AlertCircle, CheckCircle, Settings, Eye, EyeOff } from "lucide-react";
import { useApiSettings } from "@/hooks/useApiSettings";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ApiKeyConfig {
  name: string;
  description: string;
  required: boolean;
  value: string;
  isVisible: boolean;
}

export const ApiKeySettings = () => {
  const { settings, isLoading, isSaving, saveSettings } = useApiSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  // Estado para las claves API
  const [apiKeys, setApiKeys] = useState<Record<string, ApiKeyConfig>>({
    numverify: {
      name: "NumVerify API Key",
      description: "Clave para verificación de números de teléfono",
      required: true,
      value: "",
      isVisible: false
    },
    zerobounce: {
      name: "ZeroBounce API Key", 
      description: "Clave para verificación de correos electrónicos",
      required: true,
      value: "",
      isVisible: false
    },
    similarweb: {
      name: "SimilarWeb API Key",
      description: "Clave para análisis de sitios web",
      required: true,
      value: "",
      isVisible: false
    },
    twilio: {
      name: "Twilio API Key",
      description: "Clave alternativa para verificación de teléfonos",
      required: false,
      value: "",
      isVisible: false
    },
    hunter: {
      name: "Hunter API Key",
      description: "Clave alternativa para verificación de emails",
      required: false,
      value: "",
      isVisible: false
    }
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleApiKeyVisibility = (keyName: string) => {
    setApiKeys(prev => ({
      ...prev,
      [keyName]: {
        ...prev[keyName],
        isVisible: !prev[keyName].isVisible
      }
    }));
  };

  const updateApiKey = (keyName: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [keyName]: {
        ...prev[keyName],
        value
      }
    }));
  };

  const handleSave = async () => {
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
          
          {/* Configuración de Proveedores */}
          <Collapsible 
            open={expandedSections.providers} 
            onOpenChange={() => toggleSection('providers')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Proveedores de API
                </span>
                <span className="text-sm text-gray-500">
                  {expandedSections.providers ? 'Contraer' : 'Expandir'}
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Proveedor de Verificación de Teléfonos</Label>
                  <Select 
                    value={localSettings?.phoneApiProvider} 
                    onValueChange={(value) => setLocalSettings(prev => prev ? {...prev, phoneApiProvider: value as any} : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="numverify">NumVerify</SelectItem>
                      <SelectItem value="twilio">Twilio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Proveedor de Verificación de Emails</Label>
                  <Select 
                    value={localSettings?.emailApiProvider} 
                    onValueChange={(value) => setLocalSettings(prev => prev ? {...prev, emailApiProvider: value as any} : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zerobounce">ZeroBounce</SelectItem>
                      <SelectItem value="hunter">Hunter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Proveedor de Análisis Web</Label>
                  <Select 
                    value={localSettings?.websiteApiProvider} 
                    onValueChange={(value) => setLocalSettings(prev => prev ? {...prev, websiteApiProvider: value as any} : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="similar_web">SimilarWeb</SelectItem>
                      <SelectItem value="builtwith">BuiltWith</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Límite Diario de Verificaciones</Label>
                  <Input
                    type="number"
                    value={localSettings?.dailyVerificationLimit || 100}
                    onChange={(e) => setLocalSettings(prev => prev ? {...prev, dailyVerificationLimit: parseInt(e.target.value)} : null)}
                    min="1"
                    max="10000"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Configuración de Claves API */}
          <Collapsible 
            open={expandedSections.apiKeys} 
            onOpenChange={() => toggleSection('apiKeys')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Claves API
                </span>
                <span className="text-sm text-gray-500">
                  {expandedSections.apiKeys ? 'Contraer' : 'Expandir'}
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              {Object.entries(apiKeys).map(([keyName, config]) => (
                <Card key={keyName} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {config.name}
                          {config.required && (
                            <span className="text-red-500 text-sm">*</span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600">{config.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {config.value && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {config.required && !config.value && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          type={config.isVisible ? "text" : "password"}
                          placeholder={`Ingresa tu ${config.name}`}
                          value={config.value}
                          onChange={(e) => updateApiKey(keyName, e.target.value)}
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleApiKeyVisibility(keyName)}
                      >
                        {config.isVisible ? 
                          <EyeOff className="h-4 w-4" /> : 
                          <Eye className="h-4 w-4" />
                        }
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Las claves API se almacenan de forma segura y encriptada. Solo tú tienes acceso a ellas.
                </AlertDescription>
              </Alert>
            </CollapsibleContent>
          </Collapsible>

          {/* Botón de Guardado */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="min-w-[120px]"
            >
              {isSaving ? (
                <Settings className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
