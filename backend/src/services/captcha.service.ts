import axios from 'axios';
import { FastifyLoggerInstance } from 'fastify';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(__dirname, '../../.env') });

// Get hCaptcha secret key
const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET;

// Define verification response type
interface CaptchaVerificationResponse {
  success: boolean;
  message?: string;
  score?: number;
}

/**
 * Service for verifying hCaptcha responses
 */
export class CaptchaService {
  private logger: FastifyLoggerInstance;
  
  constructor(logger: FastifyLoggerInstance) {
    this.logger = logger;
    
    // Log warning if hCaptcha secret is not configured
    if (!HCAPTCHA_SECRET) {
      this.logger.warn('HCAPTCHA_SECRET is not configured. Captcha verification will fail.');
    }
  }

  /**
   * Verify an hCaptcha token
   * @param token hCaptcha response token from client
   * @param remoteIp Optional client IP address
   * @returns Verification result with success status
   */
  async verifyCaptcha(
    token: string, 
    remoteIp?: string
  ): Promise<CaptchaVerificationResponse> {
    try {
      // If hCaptcha is not configured, fail verification
      if (!HCAPTCHA_SECRET) {
        return {
          success: false,
          message: 'hCaptcha is not configured on the server'
        };
      }

      // Validate token format
      if (!token || typeof token !== 'string') {
        return {
          success: false,
          message: 'Invalid captcha token'
        };
      }

      // Prepare verification request
      const verificationUrl = 'https://hcaptcha.com/siteverify';
      const params = new URLSearchParams();
      params.append('secret', HCAPTCHA_SECRET);
      params.append('response', token);
      
      // Add remote IP if available
      if (remoteIp) {
        params.append('remoteip', remoteIp);
      }

      // Send verification request to hCaptcha
      const response = await axios.post(verificationUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      // Extract verification result
      const { success, score, 'error-codes': errorCodes } = response.data;

      if (!success) {
        this.logger.warn({ token, errorCodes }, 'hCaptcha verification failed');
        return {
          success: false,
          message: 'Captcha verification failed',
        };
      }

      this.logger.info({ token, score }, 'hCaptcha verification succeeded');
      return {
        success: true,
        score: score || 1.0, // Default to 1.0 if score is not provided
      };
    } catch (error) {
      this.logger.error({ error, token }, 'Error verifying hCaptcha');
      return {
        success: false,
        message: 'Error verifying captcha',
      };
    }
  }

  /**
   * Get hCaptcha site key
   * @returns hCaptcha site key or null if not configured
   */
  getSiteKey(): string | null {
    return process.env.HCAPTCHA_SITE_KEY || null;
  }
}

export default CaptchaService;