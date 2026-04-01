import Fastify, { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import { config } from 'dotenv';
import { join } from 'path';

// Import route handlers
import { authRoutes } from './routes/auth.routes';
import { otpRoutes } from './routes/otp.routes';

// Import services
import { EmailService } from './services/email.service';
import { DidService } from './services/did.service';
import { TrustScoreService } from './services/trustScore.service';
import { CaptchaService } from './services/captcha.service';

// Load environment variables
config({ path: join(__dirname, '../.env') });

// Initialize server
const server: FastifyInstance = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  },
  trustProxy: true,
});

// Create services instances and attach to server
server.decorate('emailService', new EmailService(server.log));
server.decorate('didService', new DidService(server.log));
server.decorate('trustScoreService', new TrustScoreService(server.log));
server.decorate('captchaService', new CaptchaService(server.log));

// Register plugins
async function registerPlugins(): Promise<void> {
  await server.register(fastifyCors, {
    origin: process.env.ALLOWED_ORIGINS ? 
      process.env.ALLOWED_ORIGINS.split(',') : 
      'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await server.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        scriptSrc: ["'self'"],
      },
    },
  });

  await server.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });
}

// Define routes
async function registerRoutes(): Promise<void> {
  // Health check endpoint
  server.get('/health', async (request, reply) => {
    const format = request.query.format || 'json';
    
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };

    if (format === 'text') {
      return reply
        .type('text/plain')
        .send(`Status: ${healthData.status}\nTimestamp: ${healthData.timestamp}\nVersion: ${healthData.version}`);
    }
    return healthData;
  });

  // Root endpoint
  server.get('/', async (request, reply) => {
    return {
      service: 'OpenID Guard API',
      status: 'operational',
      documentation: '/docs',
      version: process.env.API_VERSION || '1.0.0',
    };
  });

  // Register auth routes
  await server.register(async (instance) => {
    await authRoutes(instance);
  }, { prefix: '/api' });

  // Register OTP routes
  await server.register(async (instance) => {
    await otpRoutes(instance);
  }, { prefix: '/api' });

  // Documentation endpoint
  server.get('/docs', async (request, reply) => {
    return reply.type('text/html').send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>OpenID Guard API Documentation</title>
          <style>
            body { font-family: system-ui, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #3b82f6; }
            pre { background: #f1f5f9; padding: 15px; border-radius: 5px; overflow-x: auto; }
            .endpoint { margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; }
            .method { display: inline-block; padding: 3px 8px; border-radius: 4px; font-weight: bold; margin-right: 10px; }
            .get { background-color: #10b981; color: white; }
            .post { background-color: #3b82f6; color: white; }
          </style>
        </head>
        <body>
          <h1>OpenID Guard API Documentation</h1>
          <p>API Version: ${process.env.API_VERSION || '1.0.0'}</p>
          
          <div class="endpoint">
            <h2><span class="method get">GET</span> /</h2>
            <p>Returns basic information about the API service.</p>
          </div>

          <div class="endpoint">
            <h2><span class="method get">GET</span> /health</h2>
            <p>Health check endpoint for monitoring the service.</p>
          </div>

          <div class="endpoint">
            <h2><span class="method post">POST</span> /api/auth/login</h2>
            <p>Authenticates a user and returns a token.</p>
          </div>

          <div class="endpoint">
            <h2><span class="method post">POST</span> /api/auth/verify</h2>
            <p>Verifies a user's identity and returns a trust score.</p>
          </div>

          <div class="endpoint">
            <h2><span class="method post">POST</span> /api/auth/send-otp</h2>
            <p>Sends a one-time password to the user's email for verification.</p>
          </div>

          <div class="endpoint">
            <h2><span class="method post">POST</span> /api/auth/verify-otp</h2>
            <p>Verifies the one-time password sent to the user's email.</p>
          </div>

          <div class="endpoint">
            <h2><span class="method post">POST</span> /api/auth/register</h2>
            <p>Registers a new user and initiates identity verification.</p>
          </div>
          
          <p>For detailed documentation and examples, please visit our <a href="/docs">official documentation</a>.</p>
        </body>
      </html>
    `);
  });
}

// Error handlers
function setupErrorHandlers(): void {
  // Not found handler
  server.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      error: 'Not Found',
      message: `Route ${request.method}:${request.url} not found`,
      statusCode: 404,
    });
  });

  // Generic error handler
  server.setErrorHandler((error, request, reply) => {
    server.log.error(error);
    
    // Don't expose error details in production
    const message = process.env.NODE_ENV === 'production'
      ? 'An internal server error occurred'
      : error.message;
    
    reply.status(error.statusCode || 500).send({
      error: error.name || 'Internal Server Error',
      message,
      statusCode: error.statusCode || 500,
    });
  });
}

// Main function to start the server
async function start(): Promise<void> {
  try {
    // Register all plugins and routes
    await registerPlugins();
    await registerRoutes();
    setupErrorHandlers();

    // Get port from environment variable or use default
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
    const host = process.env.HOST || '0.0.0.0';

    // Start the server
    await server.listen({ port, host });
    
    console.log(`
╭───────────────────────────────────────────╮
│                                           │
│       OpenID Guard API is running         │
│                                           │
│       Server: http://localhost:${port}        │
│       Environment: ${process.env.NODE_ENV || 'development'}           │
│       Version: ${process.env.API_VERSION || '1.0.0'}                  │
│                                           │
╰───────────────────────────────────────────╯
    `);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  try {
    await server.close();
    console.log('Server gracefully closed');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});

// Define FastifyInstance interface extensions for services
declare module 'fastify' {
  interface FastifyInstance {
    emailService: EmailService;
    didService: DidService;
    trustScoreService: TrustScoreService;
    captchaService: CaptchaService;
  }
}

// Start the server
start();