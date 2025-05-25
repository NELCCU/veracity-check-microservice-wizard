
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
  traffic?: {
    monthlyVisits?: number;
    ranking?: number;
    category?: string;
  };
  details: {
    httpStatus?: number;
    responseTime?: number;
    ssl?: boolean;
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
