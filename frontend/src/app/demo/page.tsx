'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, RefreshCw, Check, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import { IdentityVerifier } from '@/components/IdentityVerifier';
import { TrustFeedbackUI } from '@/components/TrustFeedbackUI';
import { LanguageSwitcher } from '@/components/global/LanguageSwitcher';

interface VerificationResult {
    success: boolean;
    did?: string;
    trustScore?: {
      score: number;
      riskLevel: string;
      labels: string[];
    };
    verifiedAt?: string;
    message?: string;
  }

export default function DemoPage() {
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation('common');

  const handleVerificationComplete = (result: any) => {
    setVerificationResult(result);
    setLoading(false);
    setError(null);
  };

  const handleReset = () => {
    setVerificationResult(null);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/50 border-b border-gray-800 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Shield className="text-blue-400 h-6 w-6" />
              <span className="font-bold text-white text-lg">OpenID Guard</span>
            </div>
            <div className="flex items-center space-x-6">
            <Link
                href="/"
                className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                {t('nav.features')}
            </Link>
              <a
                href="/docs"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                {t('nav.docs')}
              </a>
              <a
                href="https://github.com/yourusername/openid-guard"
                className="text-sm flex items-center space-x-1 px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{t('nav.github')}</span>
              </a>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Demo Content */}
      <div className="relative">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-600/20 to-blue-600/5 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-4"
            >
              {t('nav.demo')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              {t('demo.title')}
            </motion.p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Verifier Column */}
            <div className="flex-1 w-full lg:w-1/2">
              <IdentityVerifier 
                apiUrl="/api/auth/verify"
                onVerificationComplete={handleVerificationComplete}
              />
            </div>

            {/* Results Column */}
            <div className="flex-1 w-full lg:w-1/2">
              {verificationResult ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/80 backdrop-blur-lg">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      {verificationResult.success ? (
                        <>
                          <Check className="text-green-500 mr-2" />
                          Verification Successful
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="text-red-500 mr-2" />
                          Verification Failed
                        </>
                      )}
                    </h2>
                    
                    {verificationResult.message && (
                      <div className={`p-3 rounded-md mb-4 ${
                        verificationResult.success ? 'bg-green-900/20 text-green-300' : 'bg-red-900/20 text-red-300'
                      }`}>
                        {verificationResult.message}
                      </div>
                    )}
                    
                    {verificationResult.success && verificationResult.trustScore && (
                      <TrustFeedbackUI
                        did={verificationResult.did}
                        trustScore={verificationResult.trustScore}
                        verifiedAt={verificationResult.verifiedAt}
                        animated={true}
                        showDetails={true}
                      />
                    )}
                    
                    <button
                      onClick={handleReset}
                      className="w-full mt-6 flex items-center justify-center px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Verify Another Identity
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col justify-center items-center p-8 rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur-sm"
                >
                  <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                    <Lock className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Complete Verification</h3>
                  <p className="text-center text-gray-400 mb-6">
                    Enter your information in the verification form to see your digital passport and trust score.
                  </p>
                  <div className="w-16 h-1 bg-blue-500/40 rounded-full"></div>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Features Highlights */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Privacy-First Verification",
                description: "Verify identities without compromising user data or storing personal information."
              },
              {
                title: "Trust Score System",
                description: "Calculate trustworthiness based on multiple factors while maintaining user privacy."
              },
              {
                title: "Decentralized Identifiers",
                description: "Generate W3C-compliant DIDs for cross-platform, self-sovereign identity."
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="p-6 rounded-lg border border-gray-800 bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm"
              >
                <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Call to Action */}
          <div className="mt-24 text-center">
            <h2 className="text-2xl font-bold mb-6">Ready to integrate OpenID Guard?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/docs"
                className="px-8 py-3 bg-blue-600 rounded-full font-medium text-white transition-colors hover:bg-blue-700"
              >
                View Documentation
              </a>
              <a
                href="https://github.com/yourusername/openid-guard"
                className="px-8 py-3 bg-transparent border border-white/20 hover:border-white/40 rounded-full font-medium text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Repository
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}