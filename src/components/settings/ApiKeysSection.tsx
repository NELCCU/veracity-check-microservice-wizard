
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ApiKeyForm } from "./ApiKeyForm";
import { useApiKeys } from "@/hooks/useApiKeys";

interface ApiKeyConfig {
  name: string;
  description: string;
  required: boolean;
  value: string;
  isVisible: boolean;
}

interface ApiKeysSectionProps {
  apiKeyConfigs: Record<string, ApiKeyConfig>;
  onToggleVisibility: (keyName: string) => void;
  onUpdateValue: (keyName: string, value: string) => void;
  onSave: (keyName: string) => void;
  onDelete: (keyName: string) => void;
}

export const ApiKeysSection = ({
  apiKeyConfigs,
  onToggleVisibility,
  onUpdateValue,
  onSave,
  onDelete
}: ApiKeysSectionProps) => {
  const { apiKeys, isSaving } = useApiKeys();

  return (
    <div className="space-y-4">
      {Object.entries(apiKeyConfigs).map(([keyName, config]) => (
        <ApiKeyForm
          key={keyName}
          keyName={keyName}
          config={config}
          hasApiKey={!!apiKeys[keyName]}
          isSaving={isSaving}
          onToggleVisibility={onToggleVisibility}
          onUpdateValue={onUpdateValue}
          onSave={onSave}
          onDelete={onDelete}
        />
      ))}
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Las claves API se almacenan de forma segura y encriptada. Solo tú tienes acceso a ellas.
        </AlertDescription>
      </Alert>
    </div>
  );
};
