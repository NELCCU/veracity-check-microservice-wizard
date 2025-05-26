
import { Badge } from "@/components/ui/badge";

interface PhoneVerificationDetailProps {
  verification: any;
}

export const PhoneVerificationDetail = ({ verification }: PhoneVerificationDetailProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span className="font-medium">País:</span>
        <span className="ml-2">{verification.country || 'No disponible'}</span>
      </div>
      <div>
        <span className="font-medium">Operador:</span>
        <span className="ml-2">{verification.carrier || 'No disponible'}</span>
      </div>
      <div>
        <span className="font-medium">Tipo de Línea:</span>
        <span className="ml-2">{verification.line_type || 'No disponible'}</span>
      </div>
      <div>
        <span className="font-medium">Estado:</span>
        <span className={`ml-2 ${verification.is_active ? 'text-green-600' : 'text-red-600'}`}>
          {verification.is_active ? 'Activo' : 'Inactivo'}
        </span>
      </div>
    </div>
  );
};
