
/**
 * Security Audit Service - Cumplimiento ISO 27001
 * Registra y audita todas las operaciones de seguridad
 */
export interface AuditEvent {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  metadata?: Record<string, any>;
}

export class SecurityAudit {
  private static instance: SecurityAudit;
  private auditLog: AuditEvent[] = [];

  static getInstance(): SecurityAudit {
    if (!SecurityAudit.instance) {
      SecurityAudit.instance = new SecurityAudit();
    }
    return SecurityAudit.instance;
  }

  logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
    const auditEvent: AuditEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };

    this.auditLog.push(auditEvent);
    
    // Log crítico inmediato
    if (event.riskLevel === 'CRITICAL' || event.riskLevel === 'HIGH') {
      console.warn('🚨 SECURITY ALERT:', auditEvent);
    }

    // Cleanup automático para no acumular logs infinitamente
    if (this.auditLog.length > 1000) {
      this.auditLog = this.auditLog.slice(-500);
    }
  }

  getAuditLog(): AuditEvent[] {
    return [...this.auditLog];
  }

  logVerificationAttempt(userId: string, type: string, target: string, success: boolean): void {
    this.logEvent({
      userId,
      action: 'VERIFICATION_ATTEMPT',
      resource: `${type}:${target}`,
      success,
      riskLevel: success ? 'LOW' : 'MEDIUM'
    });
  }
}
