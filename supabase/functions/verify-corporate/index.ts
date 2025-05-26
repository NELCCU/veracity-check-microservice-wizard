
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { company_name, tax_id, country } = await req.json()
    
    // Verificar autenticación
    const authHeader = req.headers.get('Authorization')!
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('No autorizado')
    }

    console.log(`🏢 Verificando entidad corporativa: ${company_name} (${tax_id}) en ${country}`)

    // Crear verificación principal
    const { data: verification, error: verificationError } = await supabase
      .from('corporate_verifications')
      .insert({
        user_id: user.id,
        company_name,
        tax_id,
        country,
        status: 'pending'
      })
      .select()
      .single()

    if (verificationError) {
      throw new Error(`Error creando verificación: ${verificationError.message}`)
    }

    // Simular verificación del registro mercantil
    const registryData = await simulateRegistryVerification(company_name, tax_id, country)
    
    const { data: registryInfo, error: registryError } = await supabase
      .from('corporate_registry_info')
      .insert({
        corporate_verification_id: verification.id,
        ...registryData
      })
      .select()
      .single()

    if (registryError) {
      console.error('Error guardando info de registro:', registryError)
    }

    // Simular estructura societaria
    const structureData = await simulateCorporateStructure(verification.id)
    
    const { data: structure, error: structureError } = await supabase
      .from('corporate_structure')
      .insert(structureData)
      .select()

    if (structureError) {
      console.error('Error guardando estructura societaria:', structureError)
    }

    // Verificaciones PEP y sanciones para cada persona
    if (structure) {
      for (const person of structure) {
        const pepCheck = await simulatePepSanctionsCheck(verification.id, person.id, person.person_name)
        
        await supabase
          .from('pep_sanctions_checks')
          .insert({
            corporate_verification_id: verification.id,
            person_id: person.id,
            ...pepCheck
          })
      }
    }

    // Análisis geográfico
    const geoAnalysis = await simulateGeographicRiskAnalysis(country, verification.id)
    
    await supabase
      .from('geographic_risk_analysis')
      .insert({
        corporate_verification_id: verification.id,
        ...geoAnalysis
      })

    // Análisis de actividad comercial
    const businessAnalysis = await simulateBusinessActivityAnalysis(verification.id, registryData.business_activity)
    
    await supabase
      .from('business_activity_analysis')
      .insert({
        corporate_verification_id: verification.id,
        ...businessAnalysis
      })

    // Calcular scores de riesgo
    const riskScores = await calculateRiskScores(
      registryData,
      geoAnalysis,
      businessAnalysis,
      verification.id
    )

    for (const score of riskScores) {
      await supabase
        .from('risk_scoring')
        .insert({
          corporate_verification_id: verification.id,
          ...score
        })
    }

    // Calcular score general
    const overallScore = riskScores.reduce((sum, s) => sum + s.score, 0) / riskScores.length
    const finalStatus = overallScore >= 80 ? 'approved' : overallScore >= 60 ? 'under_review' : 'rejected'

    // Actualizar verificación con resultado final
    await supabase
      .from('corporate_verifications')
      .update({
        overall_risk_score: Math.round(overallScore),
        status: finalStatus
      })
      .eq('id', verification.id)

    // Obtener resultado completo
    const { data: result, error: resultError } = await supabase
      .from('corporate_verifications')
      .select(`
        *,
        corporate_registry_info(*),
        corporate_structure(*),
        pep_sanctions_checks(*),
        geographic_risk_analysis(*),
        business_activity_analysis(*),
        risk_scoring(*)
      `)
      .eq('id', verification.id)
      .single()

    if (resultError) {
      throw new Error(`Error obteniendo resultado: ${resultError.message}`)
    }

    console.log('✅ Verificación corporativa completada')

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Error en verificación corporativa:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// Funciones de simulación
async function simulateRegistryVerification(companyName: string, taxId: string, country: string) {
  return {
    legal_status: 'active',
    registration_date: '2020-01-15',
    registration_number: `REG-${taxId}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    legal_form: 'Sociedad Anónima',
    share_capital: 1000000,
    registered_address: `123 Main Street, ${country}`,
    business_activity: 'Servicios Financieros',
    verification_status: 'verified'
  }
}

async function simulateCorporateStructure(verificationId: string) {
  return [
    {
      corporate_verification_id: verificationId,
      person_name: 'Juan Carlos Pérez',
      person_type: 'director',
      identification_number: '12345678',
      nationality: 'Colombian',
      ownership_percentage: 0,
      position: 'CEO',
      appointment_date: '2020-01-15',
      is_pep: false
    },
    {
      corporate_verification_id: verificationId,
      person_name: 'María González López',
      person_type: 'shareholder',
      identification_number: '87654321',
      nationality: 'Colombian',
      ownership_percentage: 65,
      position: 'Accionista Mayoritario',
      appointment_date: '2020-01-15',
      is_pep: false
    }
  ]
}

async function simulatePepSanctionsCheck(verificationId: string, personId: string, personName: string) {
  return {
    check_type: 'pep',
    check_result: 'clear',
    risk_level: 'low',
    details: {
      person_name: personName,
      sources_consulted: ['OFAC', 'UN', 'EU', 'Local PEP Lists'],
      last_update: new Date().toISOString()
    },
    sources_checked: ['OFAC', 'UN', 'EU']
  }
}

async function simulateGeographicRiskAnalysis(country: string, verificationId: string) {
  const countryRiskScores = {
    'Colombia': 75,
    'Chile': 85,
    'Peru': 70,
    'Mexico': 65,
    'Spain': 90,
    'USA': 95
  }

  return {
    country_code: country,
    country_risk_score: countryRiskScores[country] || 60,
    jurisdiction_type: (countryRiskScores[country] || 60) >= 80 ? 'low_risk' : 'standard',
    regulatory_compliance: {
      aml_compliance: true,
      fatf_member: true,
      tax_transparency: true
    },
    address_verification_status: 'verified'
  }
}

async function simulateBusinessActivityAnalysis(verificationId: string, businessActivity: string) {
  const restrictedActivities = ['Casinos', 'Criptomonedas', 'Armas', 'Cannabis']
  const isRestricted = restrictedActivities.some(activity => 
    businessActivity.toLowerCase().includes(activity.toLowerCase())
  )

  return {
    industry_sector: businessActivity,
    business_model: 'B2B',
    is_restricted_activity: isRestricted,
    restricted_activity_details: isRestricted ? 'Actividad en sector regulado' : null,
    licenses_required: ['Licencia Financiera', 'Registro CNBV'],
    licenses_verified: {
      'Licencia Financiera': 'verified',
      'Registro CNBV': 'pending'
    },
    credit_score: 75,
    financial_status: 'good'
  }
}

async function calculateRiskScores(registryData: any, geoAnalysis: any, businessAnalysis: any, verificationId: string) {
  return [
    {
      category: 'corporate',
      score: registryData.legal_status === 'active' ? 85 : 40,
      weight: 1.0,
      factors: {
        legal_status: registryData.legal_status,
        registration_verified: true,
        share_capital: registryData.share_capital
      },
      decision_matrix: 'auto_approve',
      decision_reason: 'Empresa activa con registro verificado'
    },
    {
      category: 'geographic',
      score: geoAnalysis.country_risk_score,
      weight: 0.8,
      factors: {
        country: geoAnalysis.country_code,
        jurisdiction_type: geoAnalysis.jurisdiction_type
      },
      decision_matrix: geoAnalysis.country_risk_score >= 80 ? 'auto_approve' : 'manual_review',
      decision_reason: `Riesgo país: ${geoAnalysis.jurisdiction_type}`
    },
    {
      category: 'business',
      score: businessAnalysis.is_restricted_activity ? 45 : 80,
      weight: 1.2,
      factors: {
        industry: businessAnalysis.industry_sector,
        restricted: businessAnalysis.is_restricted_activity,
        credit_score: businessAnalysis.credit_score
      },
      decision_matrix: businessAnalysis.is_restricted_activity ? 'manual_review' : 'auto_approve',
      decision_reason: businessAnalysis.is_restricted_activity ? 'Actividad restringida requiere revisión' : 'Actividad comercial estándar'
    }
  ]
}
