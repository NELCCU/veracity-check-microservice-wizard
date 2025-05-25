
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Save, Trash2, CheckCircle, AlertCircle } from "lucide-react";

interface ApiKeyConfig {
  name: string;
  description: string;
  required: boolean;
  value: string;
  isVisible: boolean;
}

interface ApiKeyFormProps {
  keyName: string;
  config: ApiKeyConfig;
  hasApiKey: boolean;
  isSaving: boolean;
  onToggleVisibility: (keyName: string) => void;
  onUpdateValue: (keyName: string, value: string) => void;
  onSave: (keyName: string) => void;
  onDelete: (keyName: string) => void;
}

export const ApiKeyForm = ({
  keyName,
  config,
  hasApiKey,
  isSaving,
  onToggleVisibility,
  onUpdateValue,
  onSave,
  onDelete
}: ApiKeyFormProps) => {
  return (
    <Card className="p-4">
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
            {hasApiKey && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            {config.required && !hasApiKey && (
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
              onChange={(e) => onUpdateValue(keyName, e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onToggleVisibility(keyName)}
          >
            {config.isVisible ? 
              <EyeOff className="h-4 w-4" /> : 
              <Eye className="h-4 w-4" />
            }
          </Button>
          <Button
            onClick={() => onSave(keyName)}
            disabled={!config.value.trim() || isSaving}
            size="sm"
          >
            <Save className="h-4 w-4" />
          </Button>
          {hasApiKey && (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(keyName)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
