
import { supabase } from "@/integrations/supabase/client";

export class DashboardService {
  async getAdvancedStats() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      // Obtener datos de los últimos 7 días
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      // Consultas paralelas para obtener todos los datos
      const [phoneData, emailData, websiteData, phoneDataPrevious, emailDataPrevious, websiteDataPrevious] = await Promise.all([
        // Datos actuales (últimos 7 días)
        supabase
          .from('phone_verifications')
          .select('created_at, status')
          .eq('user_id', user.id)
          .gte('created_at', sevenDaysAgo.toISOString()),
        
        supabase
          .from('email_verifications')
          .select('created_at, status')
          .eq('user_id', user.id)
          .gte('created_at', sevenDaysAgo.toISOString()),
        
        supabase
          .from('website_verifications')
          .select('created_at, status')
          .eq('user_id', user.id)
          .gte('created_at', sevenDaysAgo.toISOString()),

        // Datos del período anterior (7-14 días atrás)
        supabase
          .from('phone_verifications')
          .select('id, status')
          .eq('user_id', user.id)
          .gte('created_at', fourteenDaysAgo.toISOString())
          .lt('created_at', sevenDaysAgo.toISOString()),
        
        supabase
          .from('email_verifications')
          .select('id, status')
          .eq('user_id', user.id)
          .gte('created_at', fourteenDaysAgo.toISOString())
          .lt('created_at', sevenDaysAgo.toISOString()),
        
        supabase
          .from('website_verifications')
          .select('id, status')
          .eq('user_id', user.id)
          .gte('created_at', fourteenDaysAgo.toISOString())
          .lt('created_at', sevenDaysAgo.toISOString())
      ]);

      // Procesar datos diarios
      const dailyStats = this.processDailyStats(
        phoneData.data || [],
        emailData.data || [],
        websiteData.data || []
      );

      // Calcular distribución por estado
      const statusDistribution = this.calculateStatusDistribution(
        phoneData.data || [],
        emailData.data || [],
        websiteData.data || []
      );

      // Calcular distribución por tipo
      const typeDistribution = this.calculateTypeDistribution(
        phoneData.data || [],
        emailData.data || [],
        websiteData.data || []
      );

      // Calcular tendencias
      const trends = this.calculateTrends(
        phoneData.data || [],
        emailData.data || [],
        websiteData.data || [],
        phoneDataPrevious.data || [],
        emailDataPrevious.data || [],
        websiteDataPrevious.data || []
      );

      return {
        daily: dailyStats,
        statusDistribution,
        typeDistribution,
        trends
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas avanzadas:', error);
      return this.getDefaultStats();
    }
  }

  private processDailyStats(phones: any[], emails: any[], websites: any[]) {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const datePhones = phones.filter(p => p.created_at.startsWith(date)).length;
      const dateEmails = emails.filter(e => e.created_at.startsWith(date)).length;
      const dateWebsites = websites.filter(w => w.created_at.startsWith(date)).length;

      return {
        date,
        phones: datePhones,
        emails: dateEmails,
        websites: dateWebsites,
        total: datePhones + dateEmails + dateWebsites
      };
    });
  }

  private calculateStatusDistribution(phones: any[], emails: any[], websites: any[]) {
    const allVerifications = [...phones, ...emails, ...websites];
    const valid = allVerifications.filter(v => v.status === 'valid').length;
    const invalid = allVerifications.filter(v => v.status === 'invalid').length;

    return [
      { name: 'Válidos', value: valid, color: '#10b981' },
      { name: 'Inválidos', value: invalid, color: '#ef4444' }
    ];
  }

  private calculateTypeDistribution(phones: any[], emails: any[], websites: any[]) {
    const total = phones.length + emails.length + websites.length;
    
    if (total === 0) {
      return [
        { type: 'Teléfonos', count: 0, percentage: 0 },
        { type: 'Emails', count: 0, percentage: 0 },
        { type: 'Sitios Web', count: 0, percentage: 0 }
      ];
    }

    return [
      { 
        type: 'Teléfonos', 
        count: phones.length, 
        percentage: Math.round((phones.length / total) * 100) 
      },
      { 
        type: 'Emails', 
        count: emails.length, 
        percentage: Math.round((emails.length / total) * 100) 
      },
      { 
        type: 'Sitios Web', 
        count: websites.length, 
        percentage: Math.round((websites.length / total) * 100) 
      }
    ];
  }

  private calculateTrends(
    currentPhones: any[], 
    currentEmails: any[], 
    currentWebsites: any[],
    previousPhones: any[], 
    previousEmails: any[], 
    previousWebsites: any[]
  ) {
    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      phonesTrend: calculateTrend(currentPhones.length, previousPhones.length),
      emailsTrend: calculateTrend(currentEmails.length, previousEmails.length),
      websitesTrend: calculateTrend(currentWebsites.length, previousWebsites.length),
      totalTrend: calculateTrend(
        currentPhones.length + currentEmails.length + currentWebsites.length,
        previousPhones.length + previousEmails.length + previousWebsites.length
      )
    };
  }

  private getDefaultStats() {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split('T')[0],
        phones: 0,
        emails: 0,
        websites: 0,
        total: 0
      };
    });

    return {
      daily: last7Days,
      statusDistribution: [
        { name: 'Válidos', value: 0, color: '#10b981' },
        { name: 'Inválidos', value: 0, color: '#ef4444' }
      ],
      typeDistribution: [
        { type: 'Teléfonos', count: 0, percentage: 0 },
        { type: 'Emails', count: 0, percentage: 0 },
        { type: 'Sitios Web', count: 0, percentage: 0 }
      ],
      trends: {
        phonesTrend: 0,
        emailsTrend: 0,
        websitesTrend: 0,
        totalTrend: 0
      }
    };
  }
}

export const dashboardService = new DashboardService();
