'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { Shield, GitBranch, ChevronRight, Key, EyeOff, Fingerprint, RefreshCw } from 'lucide-react';
import i18nInstance from '@/i18n';
import { useTranslation } from 'react-i18next';

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

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState(0);
  const [showVerifier, setShowVerifier] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  
  // Translation hook
  useEffect(() => {
    i18nInstance.changeLanguage('en');
  }, []);

  const { t } = useTranslation('common', { i18n: i18nInstance });
  
  // Refs for scroll-triggered animations
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  // Monitor mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Rotate through features automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Trigger animations when in view
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle verification completion
  const handleVerificationComplete = (result: VerificationResult) => {
    setVerificationResult(result);
  };

  // Binary data animation effect
  const BinaryStream = () => {
    return (
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full flex">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="relative flex-1">
              <motion.div
                initial={{ y: -1000 }}
                animate={{ y: 2000 }}
                transition={{
                  duration: 20 + Math.random() * 10,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 5
                }}
                className="text-xs text-blue-400 whitespace-pre font-mono"
              >
                {Array.from({ length: 200 }).map(() => Math.round(Math.random())).join('\n')}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!mounted) {
    return null;
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-black text-white overflow-hidden">
      {/* Interactive background */}
      <div
        className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15)_0,transparent_60%)]"
        style={{
          '--x': `${cursorPosition.x}px`,
          '--y': `${cursorPosition.y}px`,
        } as React.CSSProperties}
      />
      
      {/* Binary data streams in background */}
      <BinaryStream />
      
      {/* Geometric shapes */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-600/20 to-blue-600/5 blur-3xl" />
      
      {/* 3D grid effect */}
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full bg-grid-angled"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16">
        {/* Floating navigation */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10"
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="text-blue-400 h-6 w-6" />
              <span className="font-bold text-white text-lg">OpenID Guard</span>
            </div>
            <div className="flex items-center space-x-6">
              <motion.a
                whileHover={{ y: -2, color: "#3b82f6" }}
                href="/"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                {t('nav.features')}
              </motion.a>
              <motion.a
                whileHover={{ y: -2, color: "#3b82f6" }}
                href="/docs"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                {t('nav.docs')}
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com/yourusername/openid-guard"
                className="text-sm flex items-center space-x-1 px-4 py-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitBranch size={14} />
                <span>{t('nav.github')}</span>
              </motion.a>
              <LanguageSwitcher />
            </div>
          </div>
        </motion.nav>
        
        {/* Hero section */}
        <section className="min-h-screen flex flex-col items-center justify-center py-24">
          {/* Animated lock mechanism */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative mb-12"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-cyan-500 border-l-blue-400 opacity-40"
            />
            <motion.div
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-blue-400 border-b-transparent border-l-blue-400 opacity-60"
            />
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 0 0px rgba(59, 130, 246, 0.5)",
                  "0 0 0 10px rgba(59, 130, 246, 0)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full"
            />
            <Shield size={40} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-6xl sm:text-7xl md:text-8xl font-black text-center leading-none tracking-tight"
          >
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 pb-2">{t('site.title').split(' ')[0]}</span>
            <br />
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500"
            >
              {t('site.title').split(' ')[1]}
            </motion.span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="relative max-w-xl mx-auto mt-8 text-center"
          >
            <p className="text-xl text-gray-300 relative z-10">
              {t('site.description')}
            </p>
            <div className="absolute -inset-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-lg -z-10"></div>
          </motion.div>
          
          {/* Animated terminal window */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="w-full max-w-xl mt-16 rounded-lg overflow-hidden border border-gray-800 bg-gray-900/80 backdrop-blur-lg shadow-2xl"
          >
            <div className="flex items-center px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="ml-4 text-xs text-gray-400">Terminal</div>
            </div>
            <div className="px-4 py-3 font-mono text-sm text-gray-300 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  {activeFeature === 0 && (
                    <>
                      <span className="text-green-400">$</span> openid verify --user=<span className="text-blue-400">john.doe</span> --mode=<span className="text-purple-400">zero-knowledge</span><br />
                      <span className="text-gray-500"># Initializing secure channel...</span><br />
                      <span className="text-gray-500"># Verifying identity with zero-knowledge proofs...</span><br />
                      <span className="text-green-400">✓ Verification complete: Identity confirmed without data exposure</span>
                    </>
                  )}
                  {activeFeature === 1 && (
                    <>
                      <span className="text-green-400">$</span> openid audit --last=<span className="text-blue-400">30d</span> --format=<span className="text-purple-400">json</span><br />
                      <span className="text-gray-500"># Accessing encrypted audit logs...</span><br />
                      <span className="text-gray-500"># Processing 147 authentication events...</span><br />
                      <span className="text-green-400">✓ No suspicious activities detected. Full report saved to audit.json</span>
                    </>
                  )}
                  {activeFeature === 2 && (
                    <>
                      <span className="text-green-400">$</span> openid setup --multi-factor --biometric --token=<span className="text-blue-400">hardware</span><br />
                      <span className="text-gray-500"># Configuring authentication layers...</span><br />
                      <span className="text-gray-500"># Generating cryptographic keys...</span><br />
                      <span className="text-green-400">✓ Security setup complete: 3-factor authentication enabled</span>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
              <motion.span 
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                className="inline-block w-2 h-4 bg-gray-400 ml-1"
              />
            </div>
          </motion.div>
          
          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-wrap gap-4 mt-12 justify-center"
          >
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com/yourusername/openid-guard"
              className="relative group px-8 py-3 bg-blue-600 rounded-full font-medium text-white overflow-hidden"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="relative z-10 flex items-center gap-2">
                <GitBranch size={18} />
                <span>{t('nav.github')}</span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.4 }}
              />
            </motion.a>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowVerifier(true)}
              className="group px-8 py-3 bg-transparent border border-white/20 hover:border-white/40 rounded-full font-medium text-white flex items-center gap-2"
            >
              <span>{t('nav.demo')}</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
              >
                <ChevronRight size={18} />
              </motion.div>
            </motion.button>
          </motion.div>
        </section>
        
        {/* Features section */}
        <section ref={ref} id="features" className="py-24">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
              className="text-3xl font-bold mb-4"
            >
              {t('feature.title')}
            </motion.h2>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
              className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8"
            />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Key className="text-blue-400" />, 
                title: t('feature.zero_knowledge.title'), 
                desc: t('feature.zero_knowledge.description')
              },
              { 
                icon: <EyeOff className="text-purple-400" />, 
                title: t('feature.quantum_resistant.title'), 
                desc: t('feature.quantum_resistant.description')
              },
              { 
                icon: <Fingerprint className="text-cyan-400" />, 
                title: t('feature.biometric.title'), 
                desc: t('feature.biometric.description')
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.25)",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  borderColor: "rgba(59, 130, 246, 0.3)",
                }}
                className="relative group p-8 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-sm transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Try Demo Section */}
        {showVerifier && (
          <section className="pt-16 pb-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">{t('verifier.title')}</h2>
              <p className="text-gray-300 max-w-xl mx-auto">
                Experience secure identity verification with our interactive demo. Enter your details to see our trust scoring system in action.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Verifier column */}
              <div className="w-full md:w-1/2">
                <IdentityVerifier 
                  onVerificationComplete={handleVerificationComplete}
                  apiUrl="/api/auth/verify"
                />
              </div>
              
              {/* Results column */}
              <div className="w-full md:w-1/2">
                {verificationResult ? (
                  <div className="rounded-lg overflow-hidden border border-gray-800 bg-gray-900/80 backdrop-blur-lg p-6">
                    <h3 className="text-xl font-bold mb-4">
                      {verificationResult.success ? 'Verification Successful' : 'Verification Failed'}
                    </h3>
                    
                    {verificationResult.success && verificationResult.trustScore && (
                      <TrustFeedbackUI 
                        did={verificationResult.did}
                        trustScore={verificationResult.trustScore}
                        verifiedAt={verificationResult.verifiedAt}
                        animated={true}
                        showDetails={true}
                      />
                    )}
                  </div>
                ) : (
                  <div className="h-full rounded-lg overflow-hidden border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-8 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                      <Fingerprint className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl mb-2 font-medium">Your Digital Passport</h3>
                    <p className="text-gray-400 text-center">
                      Complete the verification form to see your digital identity passport and trust score.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
                
        {/* Status indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-2 bg-blue-900/30 backdrop-blur-md rounded-full border border-blue-500/30 shadow-lg"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-green-400"
          />
          <div className="text-xs text-blue-300 flex items-center">
            <span className="mr-2">{t('status.network_secure')}</span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw size={12} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Modal for verifier when in mobile view */}
      <AnimatePresence>
        {showVerifier && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md relative"
            >
              <button
                onClick={() => setShowVerifier(false)}
                className="absolute -top-12 right-0 text-white/60 hover:text-white"
              >
                Close
              </button>
              
              <IdentityVerifier 
                onVerificationComplete={(result) => {
                  handleVerificationComplete(result);
                  // Keep modal open to show result on mobile
                }}
                apiUrl="/api/auth/verify"
              />
              
              {verificationResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  {verificationResult.success && verificationResult.trustScore && (
                    <TrustFeedbackUI 
                      did={verificationResult.did}
                      trustScore={verificationResult.trustScore}
                      verifiedAt={verificationResult.verifiedAt}
                      animated={true}
                      showDetails={true}
                    />
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}