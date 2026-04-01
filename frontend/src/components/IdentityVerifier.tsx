'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, CheckCircle, XCircle, RefreshCw, Eye, EyeOff, Fingerprint } from 'lucide-react';

// Types for verification response
interface VerificationResponse {
  success: boolean;
  userId?: string;
  did?: string;
  didInfo?: any;
  verificationMode?: string;
  verifiedAt?: string;
  trustScore?: {
    score: number;
    riskLevel: string;
    labels: string[];
  };
  tokenDetails?: {
    valid: boolean;
    expires: string;
  };
  message?: string;
}

interface IdentityVerifierProps {
  apiUrl?: string;
  onVerificationComplete?: (result: VerificationResponse) => void;
  className?: string;
}

export const IdentityVerifier: React.FC<IdentityVerifierProps> = ({
  apiUrl = '/api/auth/verify',
  onVerificationComplete,
  className = '',
}) => {
  // State
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showPrivateInfo, setShowPrivateInfo] = useState(false);
  const [verificationMode, setVerificationMode] = useState<'standard' | 'zero-knowledge'>('standard');
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  // Handle verification mode toggle
  const toggleVerificationMode = () => {
    setVerificationMode(prev => prev === 'standard' ? 'zero-knowledge' : 'standard');
  };

  // Format date string nicely
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Submit verification request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Generate a random userId for this demo
      // In a real app, this would be a persistent user ID
      const userId = `user_${Math.floor(Math.random() * 100000)}`;

      // Make API request
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          email,
          token: 'demo-token', // In a real app, this would be a real auth token
          mode: verificationMode,
          captchaToken,
          deviceInfo: {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
          },
        }),
      });

      const data = await response.json();
      setResult(data);

      // Call onVerificationComplete callback if provided
      if (onVerificationComplete) {
        onVerificationComplete(data);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('An error occurred during verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render trust score bar
  const renderTrustScoreBar = () => {
    if (!result?.trustScore) return null;

    const { score, riskLevel } = result.trustScore;
    
    // Calculate color based on score
    let color = 'bg-red-500';
    if (score > 0.7) color = 'bg-green-500';
    else if (score > 0.4) color = 'bg-yellow-500';

    return (
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Trust Score</span>
          <span className="text-sm font-medium">{Math.round(score * 100)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${color}`} 
            style={{ width: `${score * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>High Risk</span>
          <span>Medium Risk</span>
          <span>Low Risk</span>
        </div>
        <div className="mt-2 text-sm">
          Risk Level: <span className={`font-semibold ${
            riskLevel === 'low' ? 'text-green-400' : 
            riskLevel === 'medium' ? 'text-yellow-400' : 
            'text-red-400'
          }`}>{riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}</span>
        </div>
      </div>
    );
  };

  // Render trust labels
  const renderTrustLabels = () => {
    if (!result?.trustScore?.labels || result.trustScore.labels.length === 0) {
      return null;
    }

    return (
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Trust Factors</h4>
        <div className="flex flex-wrap gap-2">
          {result.trustScore.labels.map((label, index) => {
            // Determine label color based on label type
            let bgColor = 'bg-blue-500/20 text-blue-300';
            if (label.includes('verified')) bgColor = 'bg-green-500/20 text-green-300';
            if (label.includes('suspicious') || label.includes('bot')) bgColor = 'bg-red-500/20 text-red-300';
            if (label.includes('risk_low')) bgColor = 'bg-green-500/20 text-green-300';
            if (label.includes('risk_medium')) bgColor = 'bg-yellow-500/20 text-yellow-300';
            if (label.includes('risk_high')) bgColor = 'bg-red-500/20 text-red-300';

            // Format label text
            const formattedLabel = label
              .replace(/_/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase());

            return (
              <span 
                key={index} 
                className={`px-2 py-1 rounded-full text-xs ${bgColor}`}
              >
                {formattedLabel}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full max-w-md mx-auto rounded-lg overflow-hidden border border-gray-800 bg-gray-900/80 backdrop-blur-lg shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex items-center px-4 py-3 bg-gray-800/50 border-b border-gray-700/50">
        <Shield className="text-blue-400 h-5 w-5 mr-2" />
        <h3 className="text-white font-medium">OpenID Guard Verification</h3>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="verification-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      className="bg-gray-800 text-white border border-gray-700 rounded-lg block w-full pl-10 pr-3 py-2.5 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  {error && (
                    <p className="mt-1 text-sm text-red-400">{error}</p>
                  )}
                </div>

                <div className="flex items-center mb-6">
                  <button
                    type="button"
                    onClick={toggleVerificationMode}
                    className="flex items-center text-sm text-gray-300 hover:text-white"
                  >
                    {verificationMode === 'zero-knowledge' ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1.5" />
                        <span>Zero-Knowledge Mode</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1.5" />
                        <span>Standard Mode</span>
                      </>
                    )}
                  </button>
                  <div className="flex-grow"></div>
                  <span className="text-xs text-gray-500">
                    {verificationMode === 'zero-knowledge' ? 
                      'Enhanced privacy' : 
                      'Standard verification'}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5 mr-2" />
                      Verify Identity
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="verification-result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white"
            >
              <div className="text-center mb-6">
                {result.success ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Verification Successful</h3>
                    <p className="text-gray-400 mt-1">Your identity has been verified</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-3">
                      <XCircle className="h-8 w-8 text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Verification Failed</h3>
                    <p className="text-gray-400 mt-1">{result.message || 'Unable to verify identity'}</p>
                  </div>
                )}
              </div>

              {result.success && (
                <>
                  {/* Digital Passport Section */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative mt-4 p-4 border border-gray-700 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900"
                  >
                    <div className="absolute -top-3 left-4 px-2 bg-gray-900 text-xs font-medium text-blue-400">
                      DIGITAL PASSPORT
                    </div>
                    
                    {/* DID Display */}
                    <div className="mb-4">
                      <div className="flex items-center mb-1.5">
                        <Fingerprint className="h-4 w-4 text-blue-400 mr-1.5" />
                        <span className="text-sm font-medium text-gray-300">Decentralized ID</span>
                      </div>
                      <div className="flex">
                        <code className="text-xs bg-gray-800 p-2 rounded border border-gray-700 font-mono overflow-x-auto w-full whitespace-nowrap">
                          {result.did}
                        </code>
                      </div>
                    </div>

                    {/* Trust Score */}
                    {renderTrustScoreBar()}
                    
                    {/* Trust Labels */}
                    {renderTrustLabels()}
                    
                    {/* Additional Details */}
                    <div className="mt-4 pt-3 border-t border-gray-700">
                      <div className="flex flex-col space-y-2 text-xs text-gray-400">
                        <div className="flex justify-between">
                          <span>Verification Mode:</span>
                          <span className="text-gray-300">{result.verificationMode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Verified At:</span>
                          <span className="text-gray-300">{formatDate(result.verifiedAt)}</span>
                        </div>
                        {result.tokenDetails?.expires && (
                          <div className="flex justify-between">
                            <span>Expires:</span>
                            <span className="text-gray-300">{formatDate(result.tokenDetails.expires)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Toggle Private Info */}
                    {result.didInfo && (
                      <div className="mt-4 pt-3 border-t border-gray-700">
                        <button
                          onClick={() => setShowPrivateInfo(!showPrivateInfo)}
                          className="flex items-center text-xs text-gray-400 hover:text-blue-400"
                        >
                          {showPrivateInfo ? (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Hide Private Info
                            </>
                          ) : (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Show Private Info
                            </>
                          )}
                        </button>
                        
                        {showPrivateInfo && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-2 p-2 bg-gray-800 rounded border border-gray-700 text-xs overflow-x-auto"
                          >
                            <pre className="text-gray-300 font-mono">
                              {JSON.stringify(result.didInfo, null, 2)}
                            </pre>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </>
              )}
              
              {/* Retry Button */}
              <button
                onClick={() => {
                  setResult(null);
                  setError(null);
                }}
                className="mt-6 w-full flex items-center justify-center px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Verify Another Identity
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IdentityVerifier;