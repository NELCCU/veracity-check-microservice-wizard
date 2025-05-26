
import { Card, CardContent } from "@/components/ui/card";

interface BatchVerificationSummaryProps {
  total: number;
  valid: number;
  invalid: number;
}

export const BatchVerificationSummary = ({ total, valid, invalid }: BatchVerificationSummaryProps) => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="pt-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{valid}</div>
            <div className="text-sm text-gray-600">Válidos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{invalid}</div>
            <div className="text-sm text-gray-600">Inválidos</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
