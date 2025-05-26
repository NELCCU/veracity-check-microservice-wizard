
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
}

export const verificationStorage = new VerificationStorage();
