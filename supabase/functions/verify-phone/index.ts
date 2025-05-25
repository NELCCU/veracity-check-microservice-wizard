
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
      throw new Error('API key de NumVerify no configurada')
    }

    console.log(`Verificando teléfono con NumVerify: ${phone}`)

    // Call NumVerify API
    const response = await fetch(
      `http://apilayer.net/api/validate?access_key=${apiKey}&number=${phone}&country_code=&format=1`
    )

    if (!response.ok) {
      throw new Error('Error al llamar a la API de NumVerify')
    }

    const data = await response.json()
    console.log('Respuesta de NumVerify:', data)

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

    // Save to database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      
      if (user) {
        await supabase.from('phone_verifications').insert({
          user_id: user.id,
          phone_number: phone,
          status: result.status,
          country: result.details.country,
          carrier: result.details.carrier,
          line_type: result.details.lineType,
          is_active: result.details.isActive
        })
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error en verify-phone:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
