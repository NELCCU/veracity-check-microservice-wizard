
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";

interface VerificationResult {
  status: string;
  details: any;
  isDuplicate?: boolean;
}

interface BatchVerificationResultListProps {
  title: string;
  results: VerificationResult[];
  originalInputs: string[];
  getDisplayValue: (result: VerificationResult, index: number) => string;
}

export const BatchVerificationResultList = ({ 
  title, 
  results, 
  originalInputs, 
  getDisplayValue 
}: BatchVerificationResultListProps) => {
  if (results.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-60 overflow-y-auto">
        {results.map((result, index) => (
          <div key={index} className="text-sm p-2 border rounded space-y-1">
            <div className="flex items-center justify-between">
              <span className={`truncate ${title === 'Teléfonos' ? 'font-mono' : ''} ${title === 'Sitios Web' ? 'text-xs' : ''}`}>
                {getDisplayValue(result, index)}
              </span>
              <span className={`px-2 py-1 rounded text-xs ${
                result.status === 'valid' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {result.status === 'valid' ? 'Válido' : 'Inválido'}
              </span>
            </div>
            {result.isDuplicate && (
              <div className="text-xs text-orange-600 flex items-center gap-1">
                <Copy className="h-3 w-3" />
                Duplicado
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
