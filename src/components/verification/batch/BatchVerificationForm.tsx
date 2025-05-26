
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle, Loader2, Upload } from "lucide-react";

interface BatchVerificationFormProps {
  phones: string;
  emails: string;
  websites: string;
  isLoading: boolean;
  error: string;
  onPhonesChange: (value: string) => void;
  onEmailsChange: (value: string) => void;
  onWebsitesChange: (value: string) => void;
  onSubmit: () => void;
}

export const BatchVerificationForm = ({
  phones,
  emails,
  websites,
  isLoading,
  error,
  onPhonesChange,
  onEmailsChange,
  onWebsitesChange,
  onSubmit
}: BatchVerificationFormProps) => {
  const hasAnyInput = phones.trim() || emails.trim() || websites.trim();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phones">Teléfonos (uno por línea)</Label>
          <Textarea
            id="phones"
            placeholder="+1234567890&#10;+0987654321"
            value={phones}
            onChange={(e) => onPhonesChange(e.target.value)}
            className="min-h-[120px] font-mono text-sm"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="emails">Emails (uno por línea)</Label>
          <Textarea
            id="emails"
            placeholder="usuario1@ejemplo.com&#10;usuario2@ejemplo.com"
            value={emails}
            onChange={(e) => onEmailsChange(e.target.value)}
            className="min-h-[120px] text-sm"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="websites">Sitios Web (uno por línea)</Label>
          <Textarea
            id="websites"
            placeholder="https://ejemplo1.com&#10;https://ejemplo2.com"
            value={websites}
            onChange={(e) => onWebsitesChange(e.target.value)}
            className="min-h-[120px] text-sm"
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button 
        onClick={onSubmit} 
        disabled={isLoading || !hasAnyInput}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Procesando verificación en lote...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Verificar en Lote
          </>
        )}
      </Button>
    </div>
  );
};
