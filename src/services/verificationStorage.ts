
import { PhoneVerificationResult, EmailVerificationResult, WebsiteVerificationResult } from "@/types/verification";
import { PhoneVerificationStorage } from "./storage/PhoneVerificationStorage";
import { EmailVerificationStorage } from "./storage/EmailVerificationStorage";
import { WebsiteVerificationStorage } from "./storage/WebsiteVerificationStorage";

export class VerificationStorage {
  private phoneStorage: PhoneVerificationStorage;
  private emailStorage: EmailVerificationStorage;
  private websiteStorage: WebsiteVerificationStorage;

  constructor() {
    this.phoneStorage = new PhoneVerificationStorage();
    this.emailStorage = new EmailVerificationStorage();
    this.websiteStorage = new WebsiteVerificationStorage();
  }

  async savePhoneVerification(phone: string, result: PhoneVerificationResult) {
    return this.phoneStorage.savePhoneVerification(phone, result);
  }

  async saveEmailVerification(email: string, result: EmailVerificationResult) {
    return this.emailStorage.saveEmailVerification(email, result);
  }

  async saveWebsiteVerification(url: string, result: WebsiteVerificationResult) {
    return this.websiteStorage.saveWebsiteVerification(url, result);
  }

  async getRecentVerifications(limit: number = 10) {
    try {
      const [phoneData, emailData, websiteData] = await Promise.all([
        this.phoneStorage.getRecentPhoneVerifications(limit),
        this.emailStorage.getRecentEmailVerifications(limit),
        this.websiteStorage.getRecentWebsiteVerifications(limit)
      ]);

      return {
        phones: phoneData,
        emails: emailData,
        websites: websiteData
      };
    } catch (error) {
      console.error('Error obteniendo verificaciones recientes:', error);
      return { phones: [], emails: [], websites: [] };
    }
  }

  async getVerificationStats() {
    try {
      const today = new Date().toISOString().split('T')[0];

      const [phoneCount, emailCount, websiteCount] = await Promise.all([
        this.phoneStorage.getPhoneVerificationStats(today),
        this.emailStorage.getEmailVerificationStats(today),
        this.websiteStorage.getWebsiteVerificationStats(today)
      ]);

      return {
        today: {
          phones: phoneCount,
          emails: emailCount,
          websites: websiteCount,
          total: phoneCount + emailCount + websiteCount
        }
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return { today: { phones: 0, emails: 0, websites: 0, total: 0 } };
    }
  }

  async deleteVerificationByCaseNumber(caseNumber: string) {
    try {
      console.log(`🗑️ Intentando eliminar verificación con número de caso: ${caseNumber}`);
      
      // Intentar eliminar de cada tabla
      const [phoneDeleted, emailDeleted, websiteDeleted] = await Promise.all([
        this.phoneStorage.deletePhoneVerificationByCaseNumber(caseNumber).catch(() => false),
        this.emailStorage.deleteEmailVerificationByCaseNumber(caseNumber).catch(() => false),
        this.websiteStorage.deleteWebsiteVerificationByCaseNumber(caseNumber).catch(() => false)
      ]);

      const totalDeleted = phoneDeleted || emailDeleted || websiteDeleted;
      
      if (totalDeleted) {
        console.log(`✅ Verificación eliminada exitosamente - Caso: ${caseNumber}`);
        const deletedFrom = [];
        if (phoneDeleted) deletedFrom.push('teléfonos');
        if (emailDeleted) deletedFrom.push('emails');
        if (websiteDeleted) deletedFrom.push('sitios web');
        console.log(`📊 Eliminado de: ${deletedFrom.join(', ')}`);
      } else {
        console.log(`⚠️ No se encontró ninguna verificación con el caso: ${caseNumber}`);
      }

      return totalDeleted;
    } catch (error) {
      console.error('💥 Error eliminando verificación:', error);
      throw error;
    }
  }
}

export const verificationStorage = new VerificationStorage();
