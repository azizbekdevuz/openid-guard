import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { EmailService } from '../services/email.service';

// Request type definitions
interface SendOtpRequest {
  Body: {
    email: string;
  };
}

interface VerifyOtpRequest {
  Body: {
    email: string;
    code: string;
  };
}

/**
 * Register OTP authentication routes
 * @param server Fastify server instance
 */
export async function otpRoutes(server: FastifyInstance): Promise<void> {
  // Initialize email service
  const emailService = new EmailService(server.log);

  // Send OTP endpoint
  server.post<SendOtpRequest>('/auth/send-otp', {
    schema: {
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { email } = request.body;

    // Validate email format
    if (!email || !email.includes('@')) {
      return reply.status(400).send({
        success: false,
        message: 'Invalid email address'
      });
    }

    // Send OTP email
    const result = await emailService.sendOtpEmail(email);
    
    if (!result.success) {
      return reply.status(500).send({
        success: false,
        message: result.message
      });
    }

    return {
      success: true,
      message: 'Verification code sent to your email'
    };
  });

  // Verify OTP endpoint
  server.post<VerifyOtpRequest>('/auth/verify-otp', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'code'],
        properties: {
          email: { type: 'string', format: 'email' },
          code: { type: 'string', minLength: 6, maxLength: 6 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            verified: { type: 'boolean' },
            message: { type: 'string' },
            email: { type: 'string' },
            verifiedAt: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { email, code } = request.body;

    // Verify OTP
    const result = emailService.verifyOtp(email, code);

    if (!result.verified) {
      return reply.status(400).send({
        success: false,
        verified: false,
        message: result.message
      });
    }

    return {
      success: true,
      verified: true,
      message: 'Email verification successful',
      email,
      verifiedAt: new Date().toISOString()
    };
  });
}