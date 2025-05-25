
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Save, Settings } from "lucide-react";
import { ApiSettings } from "@/hooks/useApiSettings";

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
