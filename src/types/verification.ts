
export interface PhoneVerificationResult {
  status: 'valid' | 'invalid';
  details: {
    country?: string;
    carrier?: string;
    lineType?: string;
    isActive?: boolean;
    format?: string;
  };
  timestamp: string;
}

export interface EmailVerificationResult {
  status: 'valid' | 'invalid';
  details: {
    isDeliverable?: boolean;
    isDisposable?: boolean;
    domain?: string;
    mxRecords?: boolean;
    smtpCheck?: boolean;
  };
  timestamp: string;
}

export interface WebsiteVerificationResult {
  status: 'valid' | 'invalid';
  isDuplicate: boolean;
  trustScore: number;
  traffic?: {
    monthlyVisits?: number;
    ranking?: number;
    category?: string;
    bounceRate?: number;
    avgVisitDuration?: number;
    pagesPerVisit?: number;
  };
  details: {
    httpStatus?: number;
    responseTime?: number;
    ssl?: boolean;
    contentLength?: number;
  };
  sslInfo: {
    enabled: boolean;
    valid: boolean;
    issuer: string;
    expiryDate?: string;
    grade: string;
  };
  domainInfo: {
    domain: string;
    registrar: string;
    registrationDate?: string;
    expiryDate?: string;
    nameServers: string[];
    whoisPrivacy: boolean;
    ageInDays: number;
  };
  contentAnalysis: {
    title: string;
    description: string;
    keywords: string[];
    language: string;
    hasContactInfo: boolean;
    hasTermsOfService: boolean;
    hasPrivacyPolicy: boolean;
    hasCookiePolicy: boolean;
    socialMediaLinks: string[];
    contentScore: number;
  };
  technologyStack: {
    framework: string;
    cms: string;
    server: string;
    analytics: string[];
    technologies: string[];
    jsLibraries: string[];
  };
  securityAnalysis: {
    blacklisted: boolean;
    malwareDetected: boolean;
    phishingRisk: boolean;
    reputationScore: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    securityHeaders: {
      hasXFrameOptions: boolean;
      hasCSP: boolean;
      hasHSTS: boolean;
    };
  };
  responseHeaders: {
    server: string;
    contentType: string;
    lastModified?: string;
    cacheControl?: string;
    xFrameOptions?: string;
    contentSecurityPolicy?: string;
    strictTransportSecurity?: string;
  };
  timestamp: string;
}

export interface BatchVerificationRequest {
  phones?: string[];
  emails?: string[];
  websites?: string[];
}

export interface BatchVerificationResult {
  phones: PhoneVerificationResult[];
  emails: EmailVerificationResult[];
  websites: WebsiteVerificationResult[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
  };
}
