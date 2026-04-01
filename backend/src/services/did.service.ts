// src/services/did.service.ts
import { randomBytes } from 'crypto';
import { FastifyLoggerInstance } from 'fastify';

// In-memory storage for demonstration purposes
const didStore = new Map<string, DidRecord>();

interface DidRecord {
  did: string;
  privateKey: string;
  created: Date;
  userId: string;
}

/**
 * Service for generating and managing Decentralized Identifiers (DIDs)
 */
export class DidService {
  private logger: FastifyLoggerInstance;

  constructor(logger: FastifyLoggerInstance) {
    this.logger = logger;
  }

  /**
   * Generate a key pair and DID for a user
   * @param userId Unique identifier for the user
   * @returns Object containing the DID and related info
   */
  async generateDid(userId: string): Promise<{
    did: string;
    privateKey: string;
    publicKey: string;
  }> {
    try {
      // Generate a random private key (32 bytes)
      const privateKey = randomBytes(32).toString('hex');
      
      // Generate a public key (simplified - in a real implementation, you'd derive this cryptographically)
      const publicKey = randomBytes(32).toString('hex');
      
      // Generate a DID using the key method format
      const did = `did:key:z${randomBytes(16).toString('base64').replace(/[+/=]/g, '')}`;
      
      // Store the DID information
      this.storeDid(userId, did, privateKey);
      
      this.logger.info({ userId, did }, 'Generated new DID');
      
      return {
        did,
        privateKey,
        publicKey
      };
    } catch (error) {
      this.logger.error({ error, userId }, 'Error generating DID');
      throw new Error('Failed to generate DID');
    }
  }

  /**
   * Store a DID in the repository
   * @param userId User identifier
   * @param did Generated DID
   * @param privateKey Private key for the DID
   */
  private storeDid(userId: string, did: string, privateKey: string): void {
    didStore.set(userId, {
      did,
      privateKey,
      created: new Date(),
      userId
    });
  }

  /**
   * Retrieve a DID for a user
   * @param userId User identifier
   * @returns The DID if found, null otherwise
   */
  getDid(userId: string): string | null {
    const record = didStore.get(userId);
    return record ? record.did : null;
  }

  /**
   * Create a Verifiable Credential (VC) for a user
   * @param userId User identifier
   * @param claims Claims to include in the credential
   * @returns VC as a JSON object
   */
  async createVerifiableCredential(
    userId: string,
    claims: Record<string, any>
  ): Promise<any> {
    try {
      const record = didStore.get(userId);
      
      if (!record) {
        throw new Error('DID not found for user');
      }
      
      const vc = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'IdentityCredential'],
        issuer: record.did,
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
          id: record.did,
          ...claims
        }
      };
      
      this.logger.info({ userId }, 'Created verifiable credential');
      
      return vc;
    } catch (error) {
      this.logger.error({ error, userId }, 'Error creating verifiable credential');
      throw new Error('Failed to create verifiable credential');
    }
  }

  /**
   * Validate a DID
   * @param did DID to validate
   * @returns Boolean indicating validity
   */
  async validateDid(did: string): Promise<boolean> {
    try {
      // Simple validation - check the format
      return did.startsWith('did:key:z') && did.length > 15;
    } catch (error) {
      this.logger.error({ error, did }, 'Error validating DID');
      return false;
    }
  }
}

export default DidService;