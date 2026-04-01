import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DidService } from '../services/did.service';
import { TrustScoreService } from '../services/trustScore.service';
import { CaptchaService } from '../services/captcha.service';
import { EmailService } from '../services/email.service';

// Request type definitions
interface VerifyUserRequest {
  Body: {
    userId: string;
    token: string;
    mode?: 'standard' | 'zero-knowledge';
    email?: string;
    captchaToken?: string;
    deviceInfo?: any;
  };
}

/**
 * Register enhanced authentication routes
 * @param server Fastify server instance
 */
export async function authRoutes(server: FastifyInstance): Promise<void> {
  // Initialize services
  const didService = new DidService(server.log);
  const trustScoreService = new TrustScoreService(server.log);
  const captchaService = new CaptchaService(server.log);
  const emailService = new EmailService(server.log);

    // Enhanced user verification endpoint with trust score
    server.post<VerifyUserRequest>('/auth/verify', async (request, reply) => {
      const { 
        userId, 
        token, 
        mode = 'standard', 
        email, 
        captchaToken,
        deviceInfo 
      } = request.body;
      
      try {
        // Log verification attempt
        server.log.info({
          event: 'verify_attempt',
          userId,
          mode,
          hasEmail: !!email,
          hasCaptcha: !!captchaToken,
          timestamp: new Date().toISOString(),
        });
  
        // 1. Verify captcha if provided
        let captchaPassed = false;
        if (captchaToken) {
          const captchaResult = await captchaService.verifyCaptcha(captchaToken, request.ip);
          captchaPassed = captchaResult.success;
        }
  
        // 2. Calculate trust score
        const trustScore = trustScoreService.calculateTrustScore(request, {
          email,
          captchaPassed,
          userId,
          deviceInfo
        });
  
        // 3. Generate or retrieve DID
        let did: string | null = didService.getDid(userId);
        
        // If DID doesn't exist, generate a new one
        let didInfo: any = null;
        if (!did) {
          didInfo = await didService.generateDid(userId);
          did = didInfo.did;
        }
  
        // 4. Create verification response
        const response = {
          success: true,
          userId,
          did,
          didInfo: mode === 'zero-knowledge' ? null : didInfo, // Only include DID details in standard mode
          verificationMode: mode,
          verifiedAt: new Date().toISOString(),
          trustScore: {
            score: trustScore.score,
            riskLevel: trustScore.riskLevel,
            labels: trustScore.labels,
          },
          tokenDetails: {
            valid: true,
            expires: new Date(Date.now() + 3600000).toISOString(), // Example: token valid for 1 hour
          },
        };
  
        // If trust score is very low, adjust success status
        if (trustScore.score < 0.2) {
          response.success = false;
          return reply.status(403).send({
            ...response,
            message: 'Verification failed due to suspicious activity'
          });
        }
  
        return response;
      } catch (error) {
        server.log.error(error);
        return reply.status(401).send({
          success: false,
          error: 'Verification failed',
          message: 'The provided information could not be verified',
        });
      }
    });
  
    // User authentication endpoint (with additional security enhancements)
    server.post('/auth/login', async (request: FastifyRequest<{
      Body: {
        username: string;
        password: string;
        captchaToken?: string;
      }
    }>, reply: FastifyReply) => {
      const { username, password, captchaToken } = request.body;
      
      try {
        // Verify captcha if provided
        if (captchaToken) {
          const captchaResult = await captchaService.verifyCaptcha(captchaToken, request.ip);
          if (!captchaResult.success) {
            return reply.status(400).send({
              success: false,
              error: 'Captcha verification failed',
              message: 'Please complete the captcha correctly'
            });
          }
        }
        
        // In a real implementation, you would:
        // 1. Validate credentials against a database
        // 2. Use proper password hashing
        // 3. Generate a secure JWT or other token
        // This is just a simulation
        
        if (username && password) {
          // Generate random user ID for demo
          const randomUserId = `user_${Math.floor(Math.random() * 10000)}`;
          
          // Generate a DID for this user
          const didInfo = await didService.generateDid(randomUserId);
          
          return {
            success: true,
            userId: randomUserId,
            did: didInfo.did,
            token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(
              JSON.stringify({ username, iat: Date.now() / 1000 })
            ).toString('base64')}.example-signature`,
            expiresIn: 3600,
          };
        }
        
        return reply.status(401).send({
          success: false,
          error: 'Authentication failed',
          message: 'Invalid username or password',
        });
      } catch (error) {
        server.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Authentication failed',
          message: 'An error occurred during authentication',
        });
      }
    });
  
    // Enhanced registration endpoint (optional addition)
    server.post('/auth/register', async (request: FastifyRequest<{
      Body: {
        username: string;
        email: string;
        password: string;
        captchaToken?: string;
      }
    }>, reply: FastifyReply) => {
      const { username, email, password, captchaToken } = request.body;
      
      try {
        // Verify captcha if provided
        if (captchaToken) {
          const captchaResult = await captchaService.verifyCaptcha(captchaToken, request.ip);
          if (!captchaResult.success) {
            return reply.status(400).send({
              success: false,
              error: 'Captcha verification failed',
              message: 'Please complete the captcha correctly'
            });
          }
        }
        
        // Validate input
        if (!username || !email || !password) {
          return reply.status(400).send({
            success: false,
            error: 'Invalid input',
            message: 'Username, email, and password are required'
          });
        }
        
        // In a real implementation, you would:
        // 1. Check if username/email already exists
        // 2. Hash the password
        // 3. Store user in database
        // 4. Send verification email
        // This is just a simulation
        
        // Generate random user ID for demo
        const randomUserId = `user_${Math.floor(Math.random() * 10000)}`;
        
        // Send verification email
        await emailService.sendOtpEmail(email);
        
        // Generate a DID for this user
        const didInfo = await didService.generateDid(randomUserId);
        
        return {
          success: true,
          userId: randomUserId,
          did: didInfo.did,
          message: 'Registration successful. Please check your email for verification code.',
          requiresEmailVerification: true,
        };
      } catch (error) {
        server.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Registration failed',
          message: 'An error occurred during registration',
        });
      }
    });
  }