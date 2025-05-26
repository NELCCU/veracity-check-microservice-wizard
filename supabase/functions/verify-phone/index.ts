
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { phone } = await req.json()
    
    if (!phone) {
      throw new Error('Número de teléfono requerido')
    }

    const apiKey = Deno.env.get('NUMVERIFY_API_KEY')
    if (!apiKey) {
      console.error('CRITICAL: NumVerify API key not configured')
      throw new Error('API key de NumVerify no configurada - Contacta al administrador')
    }

    console.log(`Verificando teléfono con NumVerify: ${phone}`)

    // Call NumVerify API with timeout and error handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 segundos

    let response
    try {
      response = await fetch(
        `http://apilayer.net/api/validate?access_key=${apiKey}&number=${phone}&country_code=&format=1`,
        {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Veracity-Check/1.0'
          }
        }
      )
      clearTimeout(timeoutId)
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error('NumVerify API request failed:', fetchError)
      
      if (fetchError.name === 'AbortError') {
        throw new Error('TIMEOUT: NumVerify API no responde - Inténtalo más tarde')
      }
      
      throw new Error('NETWORK_ERROR: Error de conexión con NumVerify')
    }

    if (!response.ok) {
      console.error(`NumVerify API returned ${response.status}: ${response.statusText}`)
      
      if (response.status === 429) {
        throw new Error('QUOTA_EXCEEDED: Límite de solicitudes de NumVerify excedido')
      }
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('AUTH_ERROR: Credenciales de NumVerify inválidas')
      }
      
      if (response.status >= 500) {
        throw new Error('API_UNAVAILABLE: NumVerify temporalmente no disponible')
      }
      
      throw new Error(`NumVerify API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Respuesta de NumVerify:', data)

    // Check for API-specific errors
    if (data.error) {
      console.error('NumVerify returned error:', data.error)
      
      if (data.error.code === 104) {
        throw new Error('QUOTA_EXCEEDED: Plan mensual de NumVerify agotado')
      }
      
      if (data.error.code === 101) {
        throw new Error('AUTH_ERROR: API key de NumVerify inválida')
      }
      
      throw new Error(`NumVerify error: ${data.error.info || 'Error desconocido'}`)
    }

    // Transform NumVerify response to our format
    const result = {
      status: data.valid ? 'valid' : 'invalid',
      details: {
        country: data.country_name || 'Desconocido',
        carrier: data.carrier || 'Desconocido',
        lineType: data.line_type || 'Desconocido',
        isActive: data.valid || false,
        format: data.international_format || phone
      },
      timestamp: new Date().toISOString()
    }

    // NOTE: Removed database saving from edge function to prevent duplicates
    // The frontend hook will handle saving to the database

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error en verify-phone:', error)
    
    // Estructura de error consistente
    const errorResponse = {
      error: error.message,
      type: error.message.includes('QUOTA_EXCEEDED') ? 'quota_exceeded' :
            error.message.includes('AUTH_ERROR') ? 'authentication' :
            error.message.includes('NETWORK_ERROR') ? 'network' :
            error.message.includes('TIMEOUT') ? 'network' :
            error.message.includes('API_UNAVAILABLE') ? 'api_unavailable' : 'unknown',
      timestamp: new Date().toISOString(),
      service: 'numverify'
    }
    
    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
