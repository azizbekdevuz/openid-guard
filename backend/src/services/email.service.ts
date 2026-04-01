import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join } from 'path';
import { FastifyLoggerInstance } from 'fastify';

// Ensure environment variables are loaded
config({ path: join(__dirname, '../../.env') });

// Validate required environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Initialize Supabase client with service key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Interface for OTP data
export interface OtpData {
  email: string;
  code: string;
  expires: Date;
}

// In-memory OTP storage (use Redis or database in production)
const otpStore = new Map<string, OtpData>();

/**
 * Email Service for sending verification emails using Supabase
 */
export class EmailService {
  private logger: FastifyLoggerInstance;

  constructor(logger: FastifyLoggerInstance) {
    this.logger = logger;
  }

  /**
   * Generate a random OTP code
   * @returns A 6-digit numeric OTP code
   */
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP verification email
   * @param email Recipient email address
   * @returns Object containing success status and message
   */
  async sendOtpEmail(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Generate new OTP code
      const otpCode = this.generateOtp();
      
      // Set expiration time (10 minutes from now)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      
      // Store OTP data
      otpStore.set(email, {
        email,
        code: otpCode,
        expires: expiresAt
      });

      // Send email using Supabase
      const { error } = await supabase.auth.admin.sendRawEmail({
        email,
        subject: 'Your OpenID Guard Verification Code',
        body: `
          <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #3b82f6;">OpenID Guard</h1>
                <p style="font-size: 16px;">Privacy-Respecting Identity Verification</p>
              </div>
              
              <div style="background-color: #f5f7fa; border-radius: 8px; padding: 25px; border-left: 4px solid #3b82f6;">
                <h2 style="margin-top: 0;">Your Verification Code</h2>
                <p style="font-size: 15px; line-height: 1.6;">
                  Please use the following code to verify your identity:
                </p>
                
                <p style="font-size: 24px; font-weight: bold; letter-spacing: 3px; text-align: center; margin: 25px 0; padding: 10px; background-color: #e9eef6; border-radius: 4px;">
                  ${otpCode}
                </p>
                
                <p style="font-size: 14px; color: #666;">
                  This code will expire in 10 minutes. If you didn't request this code, you can safely ignore this email.
                </p>
              </div>
              
              <div style="margin-top: 30px; font-size: 13px; color: #666; text-align: center;">
                <p>This is an automated message from OpenID Guard. Please do not reply to this email.</p>
                <p>&copy; ${new Date().getFullYear()} OpenID Guard - Secure Identity Verification</p>
              </div>
            </body>
          </html>
        `
      });

      if (error) {
        this.logger.error({ error, email }, 'Failed to send OTP email');
        return { success: false, message: 'Failed to send verification email' };
      }

      this.logger.info({ email }, 'OTP email sent successfully');
      return { success: true, message: 'Verification email sent successfully' };
    } catch (error) {
      this.logger.error({ error, email }, 'Error in sendOtpEmail');
      return { success: false, message: 'An error occurred while sending the verification email' };
    }
  }

  /**
   * Verify an OTP code
   * @param email Email address to verify
   * @param otpCode OTP code to verify
   * @returns Object containing verification result
   */
  verifyOtp(email: string, otpCode: string): { 
    verified: boolean; 
    message: string;
  } {
    // Get stored OTP data
    const otpData = otpStore.get(email);

    // If no OTP found for this email
    if (!otpData) {
      return { 
        verified: false, 
        message: 'No verification code found. Please request a new one.' 
      };
    }

    // Check if OTP has expired
    if (new Date() > otpData.expires) {
      // Remove expired OTP
      otpStore.delete(email);
      
      return { 
        verified: false, 
        message: 'Verification code has expired. Please request a new one.' 
      };
    }

    // Check if OTP matches
    if (otpData.code !== otpCode) {
      return { 
        verified: false, 
        message: 'Invalid verification code. Please try again.' 
      };
    }

    // OTP verified successfully, remove it from store
    otpStore.delete(email);

    this.logger.info({ email }, 'OTP verification successful');
    return { 
      verified: true, 
      message: 'Email verified successfully' 
    };
  }
}

export default EmailService;