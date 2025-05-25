
import { ApiKeySettings } from "@/components/settings/ApiKeySettings";

const Settings = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-gray-600 mt-2">
          Gestiona tus preferencias y configuraciones de API
        </p>
      </div>
      <ApiKeySettings />
    </div>
  );
};

export default Settings;
