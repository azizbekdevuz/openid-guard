import { FastifyRequest, FastifyLoggerInstance } from 'fastify';
import { randomBytes } from 'crypto';

// Score factors and their weights (adjust as needed)
const SCORE_WEIGHTS = {
  EMAIL_VERIFIED: 0.4,
  CAPTCHA_PASSED: 0.2,
  IP_TRUST: 0.15,
  ACCOUNT_AGE: 0.1,
  DEVICE_TRUST: 0.15
};

// Trust score risk levels
export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// Trust score result interface
export interface TrustScore {
  score: number;
  riskLevel: RiskLevel;
  labels: string[];
  factors: {
    [key: string]: {
      score: number;
      weight: number;
      description: string;
    }
  };
  sessionId: string;
  timestamp: string;
}

/**
 * Service for calculating user trust scores
 */
export class TrustScoreService {
  private logger: FastifyLoggerInstance;
  
  // In-memory store of email verification status
  private verifiedEmails: Set<string> = new Set();
  
  constructor(logger: FastifyLoggerInstance) {
    this.logger = logger;
  }

  /**
   * Mark an email as verified
   * @param email Email address
   */
  markEmailVerified(email: string): void {
    this.verifiedEmails.add(email);
  }
  
  /**
   * Check if an email is verified
   * @param email Email address
   * @returns Boolean indicating if email is verified
   */
  isEmailVerified(email: string): boolean {
    return this.verifiedEmails.has(email);
  }

  /**
   * Calculate trust score for a verification request
   * @param request Fastify request object
   * @param options Additional options for score calculation
   * @returns Calculated trust score
   */
  calculateTrustScore(
    request: FastifyRequest, 
    options: {
      email?: string;
      captchaPassed?: boolean;
      userId?: string;
      deviceInfo?: any;
    }
  ): TrustScore {
    const { email, captchaPassed, userId, deviceInfo } = options;
    
    // Generate a unique session ID
    const sessionId = randomBytes(8).toString('hex');
    
    // Initialize factors object for detailed breakdown
    const factors: TrustScore['factors'] = {};
    const labels: string[] = [];
    
    // 1. Email verification factor
    const emailVerified = email ? this.isEmailVerified(email) : false;
    factors.emailVerification = {
      score: emailVerified ? 1 : 0,
      weight: SCORE_WEIGHTS.EMAIL_VERIFIED,
      description: emailVerified ? 'Email verified' : 'Email not verified'
    };
    
    if (emailVerified) labels.push('email_verified');
    
    // 2. CAPTCHA factor
    factors.captcha = {
      score: captchaPassed ? 1 : 0,
      weight: SCORE_WEIGHTS.CAPTCHA_PASSED,
      description: captchaPassed ? 'CAPTCHA verified' : 'CAPTCHA not completed'
    };
    
    if (captchaPassed) labels.push('captcha_passed');
    
    // 3. IP Trust factor (simplified for demo)
    // In a real implementation, you would check IP reputation services
    const ipAddress = request.ip;
    const ipTrustScore = this.calculateIpTrustScore(ipAddress);
    factors.ipReputation = {
      score: ipTrustScore,
      weight: SCORE_WEIGHTS.IP_TRUST,
      description: ipTrustScore > 0.7 ? 'Trusted IP' : 'Neutral IP reputation'
    };
    
    if (ipTrustScore > 0.7) labels.push('trusted_ip');
    if (ipTrustScore < 0.3) labels.push('suspicious_ip');
    
    // 4. Account age factor (simplified for demo)
    // In a real implementation, you would check user registration date
    const accountAgeScore = userId ? Math.random() : 0;
    factors.accountAge = {
      score: accountAgeScore,
      weight: SCORE_WEIGHTS.ACCOUNT_AGE,
      description: 'Account age and history'
    };
    
    if (accountAgeScore > 0.7) labels.push('established_account');
    
    // 5. Device trust factor (simplified for demo)
    // In a real implementation, you would analyze device fingerprint
    const deviceScore = deviceInfo ? 0.85 : 0.5;
    factors.deviceTrust = {
      score: deviceScore,
      weight: SCORE_WEIGHTS.DEVICE_TRUST,
      description: 'Device reputation'
    };
    
    if (deviceScore > 0.7) labels.push('trusted_device');
    
    // Calculate total score (weighted average)
    let totalScore = 0;
    Object.keys(factors).forEach(key => {
      const factor = factors[key];
      totalScore += factor.score * factor.weight;
    });
    
    // Round to 2 decimal places
    totalScore = Math.round(totalScore * 100) / 100;
    
    // Determine risk level
    const riskLevel = this.determineRiskLevel(totalScore);
    
    // Add risk level label
    labels.push(`risk_${riskLevel}`);
    
    // Add bot detection label
    if (totalScore > 0.7) {
      labels.push('not_a_bot');
    } else if (totalScore < 0.3) {
      labels.push('likely_bot');
    }
    
    this.logger.info({ 
      totalScore, 
      riskLevel, 
      sessionId, 
      email, 
      ip: request.ip 
    }, 'Trust score calculated');
    
    return {
      score: totalScore,
      riskLevel,
      labels,
      factors,
      sessionId,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Calculate IP trust score (simplified for demo)
   * @param ip IP address
   * @returns Score between 0 and 1
   */
  private calculateIpTrustScore(ip: string): number {
    // This is a simplified demo implementation
    // In production, you would use IP reputation services
    
    // For demo purposes, base score on IP characteristics
    let score = 0.5; // Neutral starting point
    
    // Local IP addresses are trusted
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      score = 0.9;
    }
    
    // Add random variance for demo purposes
    score += (Math.random() * 0.2) - 0.1;
    
    // Clamp score between 0 and 1
    return Math.max(0, Math.min(1, score));
  }
  
  /**
   * Determine risk level based on trust score
   * @param score Trust score (0-1)
   * @returns Risk level
   */
  private determineRiskLevel(score: number): RiskLevel {
    if (score >= 0.7) {
      return RiskLevel.LOW;
    } else if (score >= 0.4) {
      return RiskLevel.MEDIUM;
    } else {
      return RiskLevel.HIGH;
    }
  }
}

export default TrustScoreService;