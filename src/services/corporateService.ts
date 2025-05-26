
import { supabase } from "@/integrations/supabase/client";
import { CorporateVerificationResult } from "@/types/corporate";

export class CorporateService {
  async verifyCorporateEntity(
    companyName: string,
    taxId: string,
    country: string
  ): Promise<CorporateVerificationResult> {
    try {
      console.log(`🏢 Iniciando verificación corporativa: ${companyName} (${taxId})`);
      
      const { data, error } = await supabase.functions.invoke('verify-corporate', {
        body: { 
          company_name: companyName,
          tax_id: taxId,
          country: country
        }
      });

      if (error) {
        console.error('Error from Edge Function:', error);
        throw new Error(error.message || 'Error al verificar la entidad corporativa');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      console.log('✅ Verificación corporativa completada:', data);
      return data;
    } catch (error) {
      console.error('Error verificando entidad corporativa:', error);
      throw new Error(error.message || 'Error al verificar la entidad corporativa');
    }
  }

  async getCorporateVerifications(limit: number = 10) {
    try {
      const user = await this.getAuthenticatedUser();
      
      const { data, error } = await supabase
        .from('corporate_verifications')
        .select(`
          *,
          corporate_registry_info(*),
          corporate_structure(*),
          pep_sanctions_checks(*),
          geographic_risk_analysis(*),
          business_activity_analysis(*),
          continuous_monitoring(*),
          risk_scoring(*),
          regulatory_reports(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Error obteniendo verificaciones corporativas:', error);
        return [];
      }

      console.log(`📊 Verificaciones corporativas encontradas: ${data?.length || 0}`);
      return data || [];
    } catch (error) {
      console.error('💥 Error obteniendo verificaciones corporativas:', error);
      return [];
    }
  }

  async updateRiskScore(verificationId: string, category: string, score: number, factors: any) {
    try {
      const user = await this.getAuthenticatedUser();
      
      const { data, error } = await supabase
        .from('risk_scoring')
        .insert({
          corporate_verification_id: verificationId,
          category,
          score,
          factors,
          decision_matrix: this.getDecisionMatrix(score),
          decision_reason: this.getDecisionReason(score, category)
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error actualizando score de riesgo:', error);
        throw error;
      }

      // Actualizar el score general
      await this.updateOverallRiskScore(verificationId);
      
      return data;
    } catch (error) {
      console.error('💥 Error actualizando score de riesgo:', error);
      throw error;
    }
  }

  private async updateOverallRiskScore(verificationId: string) {
    try {
      // Obtener todos los scores de riesgo
      const { data: scores, error } = await supabase
        .from('risk_scoring')
        .select('score, weight, category')
        .eq('corporate_verification_id', verificationId);

      if (error || !scores) return;

      // Calcular score ponderado
      const totalWeight = scores.reduce((sum, s) => sum + (s.weight || 1), 0);
      const weightedScore = scores.reduce((sum, s) => sum + (s.score * (s.weight || 1)), 0);
      const overallScore = Math.round(weightedScore / totalWeight);

      // Actualizar la verificación principal
      await supabase
        .from('corporate_verifications')
        .update({ 
          overall_risk_score: overallScore,
          status: this.getStatusFromScore(overallScore)
        })
        .eq('id', verificationId);

    } catch (error) {
      console.error('Error calculando score general:', error);
    }
  }

  private getDecisionMatrix(score: number): string {
    if (score >= 80) return 'auto_approve';
    if (score >= 60) return 'manual_review';
    return 'auto_reject';
  }

  private getDecisionReason(score: number, category: string): string {
    if (score >= 80) return `Score alto en ${category} (${score}/100) - Aprobación automática`;
    if (score >= 60) return `Score medio en ${category} (${score}/100) - Revisión manual requerida`;
    return `Score bajo en ${category} (${score}/100) - Rechazo automático`;
  }

  private getStatusFromScore(score: number): string {
    if (score >= 80) return 'approved';
    if (score >= 60) return 'under_review';
    return 'rejected';
  }

  private async getAuthenticatedUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error('Usuario no autenticado');
    }
    return user;
  }
}

export const corporateService = new CorporateService();
