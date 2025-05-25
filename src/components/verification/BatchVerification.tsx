
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Database, CheckCircle, XCircle, Loader2, Upload, Copy } from "lucide-react";
import { validatePhone, validateEmail, validateUrl, formatPhone, formatEmail, formatUrl } from "@/utils/validators";
import { BatchVerificationRequest, BatchVerificationResult } from "@/types/verification";
import { useToast } from "@/hooks/use-toast";

export const BatchVerification = () => {
  const [phones, setPhones] = useState("");
  const [emails, setEmails] = useState("");
  const [websites, setWebsites] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BatchVerificationResult | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleBatchVerify = async () => {
    const phoneList = phones.split('\n').filter(p => p.trim()).map(p => formatPhone(p.trim()));
    const emailList = emails.split('\n').filter(e => e.trim()).map(e => formatEmail(e.trim()));
    const websiteList = websites.split('\n').filter(w => w.trim()).map(w => formatUrl(w.trim()));

    if (phoneList.length === 0 && emailList.length === 0 && websiteList.length === 0) {
      setError("Debe proporcionar al menos un elemento para verificar");
      return;
    }

    // Validar formatos
    const invalidPhones = phoneList.filter(p => !validatePhone(p).isValid);
    const invalidEmails = emailList.filter(e => !validateEmail(e).isValid);
    const invalidWebsites = websiteList.filter(w => !validateUrl(w).isValid);

    if (invalidPhones.length > 0 || invalidEmails.length > 0 || invalidWebsites.length > 0) {
      setError(`Formatos inválidos encontrados: ${invalidPhones.length} teléfonos, ${invalidEmails.length} emails, ${invalidWebsites.length} sitios web`);
      return;
    }

    setError("");
    setIsLoading(true);
    
    try {
      // Simulación de verificación en lote
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const mockResult: BatchVerificationResult = {
        phones: phoneList.map(phone => ({
          status: Math.random() > 0.3 ? 'valid' : 'invalid',
          details: {
            country: "Estados Unidos",
            carrier: "Carrier",
            lineType: "Mobile",
            isActive: true,
            format: phone
          },
          timestamp: new Date().toISOString()
        })),
        emails: emailList.map(email => ({
          status: Math.random() > 0.2 ? 'valid' : 'invalid',
          details: {
            isDeliverable: true,
            isDisposable: false,
            domain: email.split('@')[1],
            mxRecords: true,
            smtpCheck: true
          },
          timestamp: new Date().toISOString()
        })),
        websites: websiteList.map(website => ({
          status: Math.random() > 0.1 ? 'valid' : 'invalid',
          isDuplicate: Math.random() > 0.7,
          traffic: {
            monthlyVisits: Math.floor(Math.random() * 1000000),
            ranking: Math.floor(Math.random() * 100000),
            category: "Technology"
          },
          details: {
            httpStatus: 200,
            responseTime: Math.floor(Math.random() * 2000),
            ssl: true
          },
          timestamp: new Date().toISOString()
        })),
        summary: {
          total: phoneList.length + emailList.length + websiteList.length,
          valid: 0,
          invalid: 0
        }
      };

      // Calcular resumen
      const allResults = [...mockResult.phones, ...mockResult.emails, ...mockResult.websites];
      mockResult.summary.valid = allResults.filter(r => r.status === 'valid').length;
      mockResult.summary.invalid = allResults.filter(r => r.status === 'invalid').length;
      
      setResult(mockResult);
      toast({
        title: "Verificación en lote completada",
        description: `${mockResult.summary.valid} válidos, ${mockResult.summary.invalid} inválidos`,
      });
      
    } catch (err) {
      setError("Error al realizar la verificación en lote");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Verificación en Lote
        </CardTitle>
        <CardDescription>
          Verifica múltiples teléfonos, emails y sitios web simultáneamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phones">Teléfonos (uno por línea)</Label>
            <Textarea
              id="phones"
              placeholder="+1234567890&#10;+0987654321"
              value={phones}
              onChange={(e) => setPhones(e.target.value)}
              className="min-h-[120px] font-mono text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="emails">Emails (uno por línea)</Label>
            <Textarea
              id="emails"
              placeholder="usuario1@ejemplo.com&#10;usuario2@ejemplo.com"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              className="min-h-[120px] text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="websites">Sitios Web (uno por línea)</Label>
            <Textarea
              id="websites"
              placeholder="https://ejemplo1.com&#10;https://ejemplo2.com"
              value={websites}
              onChange={(e) => setWebsites(e.target.value)}
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
          onClick={handleBatchVerify} 
          disabled={isLoading || (!phones && !emails && !websites)}
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

        {result && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Resultados de Verificación en Lote
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Resumen */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{result.summary.total}</div>
                      <div className="text-sm text-gray-600">Total</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{result.summary.valid}</div>
                      <div className="text-sm text-gray-600">Válidos</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{result.summary.invalid}</div>
                      <div className="text-sm text-gray-600">Inválidos</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resultados detallados */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.phones.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Teléfonos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                      {result.phones.map((phone, index) => (
                        <div key={index} className="flex items-center justify-between text-sm p-2 border rounded">
                          <span className="font-mono">{phone.details.format}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            phone.status === 'valid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {phone.status === 'valid' ? 'Válido' : 'Inválido'}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {result.emails.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Emails</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                      {result.emails.map((email, index) => (
                        <div key={index} className="flex items-center justify-between text-sm p-2 border rounded">
                          <span className="truncate">{emails.split('\n')[index]}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            email.status === 'valid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {email.status === 'valid' ? 'Válido' : 'Inválido'}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {result.websites.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Sitios Web</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                      {result.websites.map((website, index) => (
                        <div key={index} className="text-sm p-2 border rounded space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="truncate text-xs">{websites.split('\n')[index]}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              website.status === 'valid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {website.status === 'valid' ? 'Válido' : 'Inválido'}
                            </span>
                          </div>
                          {website.isDuplicate && (
                            <div className="text-xs text-orange-600 flex items-center gap-1">
                              <Copy className="h-3 w-3" />
                              Duplicado
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
