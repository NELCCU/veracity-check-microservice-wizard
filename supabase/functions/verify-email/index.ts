
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
    const { email } = await req.json()
    
    if (!email) {
      throw new Error('Email requerido')
    }

    const apiKey = Deno.env.get('ZEROBOUNCE_API_KEY')
    if (!apiKey) {
      throw new Error('API key de ZeroBounce no configurada')
    }

    console.log(`Verificando email con ZeroBounce: ${email}`)

    // Call ZeroBounce API
    const response = await fetch(
      `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${encodeURIComponent(email)}`
    )

    if (!response.ok) {
      throw new Error('Error al llamar a la API de ZeroBounce')
    }

    const data = await response.json()
    console.log('Respuesta de ZeroBounce:', data)

    const domain = email.split('@')[1]
    const isValid = data.status === 'valid'
    const isDeliverable = ['valid', 'catch-all'].includes(data.status)

    // Transform ZeroBounce response to our format
    const result = {
      status: isValid ? 'valid' : 'invalid',
      details: {
        isDeliverable: isDeliverable,
        isDisposable: data.status === 'disposable',
        domain: domain,
        mxRecords: data.mx_found || false,
        smtpCheck: data.smtp_provider !== null
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
        await supabase.from('email_verifications').insert({
          user_id: user.id,
          email: email,
          status: result.status,
          domain: result.details.domain,
          is_deliverable: result.details.isDeliverable,
          is_disposable: result.details.isDisposable,
          mx_records: result.details.mxRecords,
          smtp_check: result.details.smtpCheck
        })
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error en verify-email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
