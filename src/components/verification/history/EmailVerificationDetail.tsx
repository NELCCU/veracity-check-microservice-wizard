
import { Badge } from "@/components/ui/badge";

interface EmailVerificationDetailProps {
  verification: any;
}

export const EmailVerificationDetail = ({ verification }: EmailVerificationDetailProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span className="font-medium">Dominio:</span>
        <span className="ml-2">{verification.domain || 'No disponible'}</span>
      </div>
      <div>
        <span className="font-medium">Entregable:</span>
        <span className={`ml-2 ${verification.is_deliverable ? 'text-green-600' : 'text-red-600'}`}>
          {verification.is_deliverable ? 'Sí' : 'No'}
        </span>
      </div>
      <div>
        <span className="font-medium">Desechable:</span>
        <span className={`ml-2 ${verification.is_disposable ? 'text-red-600' : 'text-green-600'}`}>
          {verification.is_disposable ? 'Sí' : 'No'}
        </span>
      </div>
      <div>
        <span className="font-medium">Registros MX:</span>
        <span className={`ml-2 ${verification.mx_records ? 'text-green-600' : 'text-red-600'}`}>
          {verification.mx_records ? 'Válidos' : 'Inválidos'}
        </span>
      </div>
    </div>
  );
};
