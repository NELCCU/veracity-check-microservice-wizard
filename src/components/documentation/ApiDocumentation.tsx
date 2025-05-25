
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code } from "lucide-react";

export const ApiDocumentation = () => {
  const baseUrl = "https://blhjvrredizujcxvjmzm.supabase.co/functions/v1";

  const endpoints = [
    {
      method: "POST",
      path: "/verify-phone",
      description: "Verifica un número de teléfono",
      body: { phone: "string" },
      response: {
        status: "valid | invalid",
        details: {
          country: "string",
          carrier: "string", 
          lineType: "string",
          isActive: "boolean",
          format: "string"
        },
        timestamp: "string"
      }
    },
    {
      method: "POST", 
      path: "/verify-email",
      description: "Verifica una dirección de correo electrónico",
      body: { email: "string" },
      response: {
        status: "valid | invalid",
        details: {
          isDeliverable: "boolean",
          isDisposable: "boolean",
          domain: "string",
          mxRecords: "boolean",
          smtpCheck: "boolean"
        },
        timestamp: "string"
      }
    },
    {
      method: "POST",
      path: "/verify-website", 
      description: "Verifica un sitio web",
      body: { url: "string" },
      response: {
        status: "valid | invalid",
        isDuplicate: "boolean",
        traffic: {
          monthlyVisits: "number",
          ranking: "number",
          category: "string"
        },
        details: {
          httpStatus: "number",
          responseTime: "number",
          ssl: "boolean"
        },
        timestamp: "string"
      }
    },
    {
      method: "POST",
      path: "/batch-verify",
      description: "Verifica múltiples elementos en lote",
      body: {
        phones: "string[]",
        emails: "string[]", 
        websites: "string[]"
      },
      response: {
        phones: "PhoneVerificationResult[]",
        emails: "EmailVerificationResult[]",
        websites: "WebsiteVerificationResult[]",
        summary: {
          total: "number",
          valid: "number",
          invalid: "number"
        }
      }
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Documentación de la API</h1>
        <p className="text-muted-foreground">
          Endpoints disponibles para verificación de teléfonos, emails y sitios web
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            URL Base
          </CardTitle>
        </CardHeader>
        <CardContent>
          <code className="bg-muted p-2 rounded block">{baseUrl}</code>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Autenticación</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Todos los endpoints requieren autenticación mediante Bearer Token:</p>
          <div className="bg-muted p-4 rounded">
            <pre className="text-sm">
{`Headers:
Authorization: Bearer YOUR_SUPABASE_TOKEN
Content-Type: application/json`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="endpoints" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="examples">Ejemplos</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-6">
          {endpoints.map((endpoint, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant={endpoint.method === "POST" ? "default" : "secondary"}>
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm">{endpoint.path}</code>
                </div>
                <p className="text-sm text-muted-foreground">{endpoint.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Request Body:</h4>
                  <div className="bg-muted p-4 rounded">
                    <pre className="text-sm">{JSON.stringify(endpoint.body, null, 2)}</pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Response:</h4>
                  <div className="bg-muted p-4 rounded">
                    <pre className="text-sm">{JSON.stringify(endpoint.response, null, 2)}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ejemplo: Verificar Teléfono</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">cURL:</h4>
                  <div className="bg-muted p-4 rounded">
                    <pre className="text-sm">{`curl -X POST ${baseUrl}/verify-phone \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"phone": "+1234567890"}'`}</pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">JavaScript/Node.js:</h4>
                  <div className="bg-muted p-4 rounded">
                    <pre className="text-sm">{`const response = await fetch('${baseUrl}/verify-phone', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ phone: '+1234567890' })
});

const result = await response.json();
console.log(result);`}</pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Python:</h4>
                  <div className="bg-muted p-4 rounded">
                    <pre className="text-sm">{`import requests

response = requests.post(
    '${baseUrl}/verify-phone',
    headers={
        'Authorization': 'Bearer YOUR_TOKEN',
        'Content-Type': 'application/json'
    },
    json={'phone': '+1234567890'}
)

result = response.json()
print(result)`}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ejemplo: Verificación en Lote</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Request:</h4>
                  <div className="bg-muted p-4 rounded">
                    <pre className="text-sm">{`{
  "phones": ["+1234567890", "+0987654321"],
  "emails": ["test@example.com", "user@domain.com"],
  "websites": ["https://example.com", "https://test.com"]
}`}</pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Response:</h4>
                  <div className="bg-muted p-4 rounded">
                    <pre className="text-sm">{`{
  "phones": [
    {
      "status": "valid",
      "details": {
        "country": "United States",
        "carrier": "Verizon",
        "lineType": "mobile",
        "isActive": true,
        "format": "+1 (234) 567-890"
      },
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ],
  "emails": [...],
  "websites": [...],
  "summary": {
    "total": 6,
    "valid": 4,
    "invalid": 2
  }
}`}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Códigos de Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Badge variant="default">200</Badge>
                  <span>Verificación exitosa</span>
                </div>
                <div className="flex justify-between">
                  <Badge variant="destructive">400</Badge>
                  <span>Datos inválidos o faltantes</span>
                </div>
                <div className="flex justify-between">
                  <Badge variant="destructive">401</Badge>
                  <span>Token de autenticación inválido</span>
                </div>
                <div className="flex justify-between">
                  <Badge variant="destructive">500</Badge>
                  <span>Error interno del servidor</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Límites y Consideraciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>• <strong>Rate Limiting:</strong> Se aplican límites por usuario autenticado</p>
          <p>• <strong>Timeouts:</strong> Las verificaciones tienen un timeout de 10 segundos</p>
          <p>• <strong>Batch Size:</strong> Máximo 100 elementos por verificación en lote</p>
          <p>• <strong>Formato de URLs:</strong> Deben incluir protocolo (http:// o https://)</p>
          <p>• <strong>Formato de Teléfonos:</strong> Se recomienda formato internacional (+código país)</p>
        </CardContent>
      </Card>
    </div>
  );
};
