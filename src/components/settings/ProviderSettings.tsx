
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Save, Settings, Eye, EyeOff } from "lucide-react";
import { ApiSettings } from "@/hooks/useApiSettings";
import { useState } from "react";

interface ProviderSettingsProps {
  settings: ApiSettings | null;
  isSaving: boolean;
  onSettingsChange: (settings: ApiSettings) => void;
  onSave: () => void;
}

export const ProviderSettings = ({
  settings,
  isSaving,
  onSettingsChange,
  onSave
}: ProviderSettingsProps) => {
  const [showGoogleMapsKey, setShowGoogleMapsKey] = useState(false);

  if (!settings) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Proveedor de Verificación de Teléfonos</Label>
          <Select 
            value={settings.phoneApiProvider} 
            onValueChange={(value) => onSettingsChange({...settings, phoneApiProvider: value as any})}
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
            value={settings.emailApiProvider} 
            onValueChange={(value) => onSettingsChange({...settings, emailApiProvider: value as any})}
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
            value={settings.websiteApiProvider} 
            onValueChange={(value) => onSettingsChange({...settings, websiteApiProvider: value as any})}
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
            value={settings.dailyVerificationLimit || 100}
            onChange={(e) => onSettingsChange({...settings, dailyVerificationLimit: parseInt(e.target.value)})}
            min="1"
            max="10000"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Google Maps API Key</Label>
          <div className="flex gap-2">
            <Input
              type={showGoogleMapsKey ? "text" : "password"}
              placeholder="Ingresa tu Google Maps API Key"
              value={settings.googleMapsApiKey || ''}
              onChange={(e) => onSettingsChange({...settings, googleMapsApiKey: e.target.value})}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowGoogleMapsKey(!showGoogleMapsKey)}
            >
              {showGoogleMapsKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Necesaria para la verificación de direcciones. 
            <a 
              href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              Obtener API Key
            </a>
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={onSave} 
          disabled={isSaving}
          className="min-w-[120px]"
        >
          {isSaving ? (
            <Settings className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isSaving ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </div>
    </div>
  );
};
