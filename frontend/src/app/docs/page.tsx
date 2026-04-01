'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Book, Code, FileText, Server, Layout, Github, ExternalLink } from 'lucide-react';
import { MDXProvider } from '@mdx-js/react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

import { IdentityVerifier } from '@/components/IdentityVerifier';
import LanguageSwitcher from '@/components/global/LanguageSwitcher';

// MDX components mapping
const components = {
  h1: (props: any) => <h1 className="text-3xl font-bold mb-6" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-semibold mt-6 mb-3" {...props} />,
  p: (props: any) => <p className="mb-4 leading-relaxed text-gray-200" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 mb-4" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 mb-4" {...props} />,
  li: (props: any) => <li className="mb-2" {...props} />,
  pre: (props: any) => <pre className="bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto" {...props} />,
  code: (props: any) => {
    if (props.className) {
      // This is a code block
      return <code className={`block text-sm font-mono ${props.className}`} {...props} />;
    }
    // This is inline code
    return <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-blue-300" {...props} />;
  },
  a: (props: any) => <a className="text-blue-400 hover:text-blue-300 underline" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4" {...props} />,
  table: (props: any) => <div className="overflow-x-auto mb-4"><table className="min-w-full divide-y divide-gray-700" {...props} /></div>,
  thead: (props: any) => <thead className="bg-gray-800" {...props} />,
  tbody: (props: any) => <tbody className="divide-y divide-gray-700" {...props} />,
  tr: (props: any) => <tr {...props} />,
  th: (props: any) => <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" {...props} />,
  td: (props: any) => <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100" {...props} />,
  hr: (props: any) => <hr className="my-6 border-gray-700" {...props} />,
};

// Navigation items
const navItems = [
  { id: 'getting-started', label: 'Getting Started', icon: Book },
  { id: 'api-reference', label: 'API Reference', icon: Server },
  { id: 'frontend-sdk', label: 'Frontend SDK', icon: Layout },
  { id: 'verification', label: 'Verification', icon: Shield },
  { id: 'examples', label: 'Examples', icon: Code },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const { t } = useTranslation('common');

  // Sample code snippets
  const installSnippet = `# Install the package
npm install openid-guard

# Or with yarn
yarn add openid-guard`;

  const usageSnippet = `import { IdentityVerifier } from 'openid-guard/react';

function MyApp() {
  const handleVerificationComplete = (result) => {
    console.log('Verification result:', result);
  };

  return (
    <IdentityVerifier 
      apiUrl="/api/auth/verify"
      onVerificationComplete={handleVerificationComplete}
    />
  );
}`;

  const apiSnippet = `// Example: Verify a user
const response = await fetch('/api/auth/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: 'user_123',
    email: 'user@example.com',
    token: 'your-auth-token',
    mode: 'standard', // or 'zero-knowledge'
    captchaToken: 'hcaptcha-token', // optional
  }),
});

const result = await response.json();
console.log(result);`;

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Shield className="text-blue-400 h-6 w-6" />
              <Link href="/" className="font-bold text-white text-lg">OpenID Guard</Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link 
                href="/" 
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                {t('nav.features')}
              </Link>
              <Link 
                href="/docs" 
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                {t('nav.docs')}
              </Link>
              <a 
                href="https://github.com/yourusername/openid-guard" 
                className="text-sm flex items-center space-x-1 px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={14} />
                <span>{t('nav.github')}</span>
              </a>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="md:w-64 flex-shrink-0">
            <nav className="sticky top-32">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                        activeSection === item.id
                          ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-400'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <FileText size={16} className="mr-2" />
                  Resources
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-blue-400 flex items-center"
                    >
                      <span>GitHub Repository</span>
                      <ExternalLink size={12} className="ml-1" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-blue-400 flex items-center"
                    >
                      <span>API Documentation</span>
                      <ExternalLink size={12} className="ml-1" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-blue-400 flex items-center"
                    >
                      <span>Changelog</span>
                      <ExternalLink size={12} className="ml-1" />
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            <MDXProvider components={components}>
              {/* Getting Started */}
              {activeSection === 'getting-started' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1>Getting Started with OpenID Guard</h1>
                  
                  <p>
                    OpenID Guard is a universal, privacy-respecting identity verification system 
                    designed for both Web2 and Web3 applications. This guide will help you get 
                    started with the basic implementation.
                  </p>

                  <h2>Installation</h2>
                  
                  <pre>
                    <code className="language-bash">{installSnippet}</code>
                  </pre>

                  <h2>Basic Usage</h2>
                  
                  <p>
                    OpenID Guard provides a React component that you can easily integrate into 
                    your frontend application. Here&apos;s a simple example:
                  </p>

                  <pre>
                    <code className="language-jsx">{usageSnippet}</code>
                  </pre>

                  <h2>Features</h2>
                  
                  <ul>
                    <li><strong>Privacy-First Verification</strong>: Verify identities without compromising user data.</li>
                    <li><strong>Zero-Knowledge Proofs</strong>: Allow users to prove their identity without revealing sensitive information.</li>
                    <li><strong>Decentralized Identifiers (DIDs)</strong>: Generate and utilize W3C-compliant DIDs.</li>
                    <li><strong>Trust Score System</strong>: Evaluate trustworthiness of an identity based on multiple factors.</li>
                    <li><strong>Bot Resistance</strong>: Optional hCaptcha integration to prevent automated abuse.</li>
                  </ul>

                  <h2>Requirements</h2>
                  
                  <ul>
                    <li>Node.js 14.0 or higher</li>
                    <li>React 16.8 or higher (for the React component)</li>
                    <li>Backend API server (Fastify recommended, but not required)</li>
                  </ul>

                  <h2>Next Steps</h2>
                  
                  <p>
                    Check out the API Reference section to learn more about the available endpoints
                    and how to customize the verification process for your needs.
                  </p>
                </motion.div>
              )}

              {/* API Reference */}
              {activeSection === 'api-reference' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1>API Reference</h1>
                  
                  <p>
                    OpenID Guard provides a RESTful API for identity verification. This section 
                    documents the available endpoints and their usage.
                  </p>

                  <h2>Base URL</h2>
                  
                  <p>All API endpoints are relative to your base URL:</p>
                  
                  <pre>
                    <code>https://your-api-server.com/api</code>
                  </pre>

                  <h2>Authentication</h2>
                  
                  <h3>POST /auth/login</h3>
                  
                  <p>Authenticates a user and returns a token.</p>
                  
                  <h4>Request Body</h4>
                  
                  <pre>
                    <code className="language-json">{`{
  "username": "string",
  "password": "string",
  "captchaToken": "string" // optional
}`}</code>
                  </pre>

                  <h4>Response</h4>
                  
                  <pre>
                    <code className="language-json">{`{
  "success": true,
  "userId": "user_1234",
  "did": "did:key:z6Mkfrm4jadNK4YGt1FPwVmPLwE74Sdr5qAQWRdK1oPGETrB",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}`}</code>
                  </pre>

                  <h3>POST /auth/verify</h3>
                  
                  <p>Verifies a user&apos;s identity and returns a trust score.</p>
                  
                  <h4>Request Body</h4>
                  
                  <pre>
                    <code className="language-json">{`{
  "userId": "string",
  "token": "string",
  "mode": "standard" | "zero-knowledge", // optional, defaults to "standard"
  "email": "string", // optional
  "captchaToken": "string", // optional
  "deviceInfo": {} // optional
}`}</code>
                  </pre>

                  <h4>Response</h4>
                  
                  <pre>
                    <code className="language-json">{`{
  "success": true,
  "userId": "user_1234",
  "did": "did:key:z6Mkfrm4jadNK4YGt1FPwVmPLwE74Sdr5qAQWRdK1oPGETrB",
  "didInfo": {}, // only included in standard mode
  "verificationMode": "standard",
  "verifiedAt": "2023-04-05T12:34:56.789Z",
  "trustScore": {
    "score": 0.87,
    "riskLevel": "low",
    "labels": ["email_verified", "captcha_passed", "not_a_bot"]
  },
  "tokenDetails": {
    "valid": true,
    "expires": "2023-04-05T13:34:56.789Z"
  }
}`}</code>
                  </pre>

                  <h3>POST /auth/send-otp</h3>
                  
                  <p>Sends a one-time password to the user&apos;s email for verification.</p>
                  
                  <h4>Request Body</h4>
                  
                  <pre>
                    <code className="language-json">{`{
  "email": "string"
}`}</code>
                  </pre>

                  <h4>Response</h4>
                  
                  <pre>
                    <code className="language-json">{`{
  "success": true,
  "message": "Verification code sent to your email"
}`}</code>
                  </pre>

                  <h3>POST /auth/verify-otp</h3>
                  
                  <p>Verifies the one-time password sent to the user&apos;s email.</p>
                  
                  <h4>Request Body</h4>
                  
                  <pre>
                    <code className="language-json">{`{
  "email": "string",
  "code": "string"
}`}</code>
                  </pre>

                  <h4>Response</h4>
                  
                  <pre>
                    <code className="language-json">{`{
  "success": true,
  "verified": true,
  "message": "Email verification successful",
  "email": "user@example.com",
  "verifiedAt": "2023-04-05T12:34:56.789Z"
}`}</code>
                  </pre>

                  <h2>Example Usage</h2>
                  
                  <p>
                    Here&apos;s an example of how to use the API to verify a user:
                  </p>
                  
                  <pre>
                    <code className="language-javascript">{apiSnippet}</code>
                  </pre>
                </motion.div>
              )}

              {/* Frontend SDK */}
              {activeSection === 'frontend-sdk' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1>Frontend SDK</h1>
                  
                  <p>
                    OpenID Guard provides a React component that makes it easy to implement 
                    identity verification in your frontend application.
                  </p>

                  <h2>IdentityVerifier Component</h2>
                  
                  <p>
                    The IdentityVerifier component provides a complete UI for email verification 
                    and displays the verification results, including the DID, trust score, and 
                    other details.
                  </p>

                  <h3>Props</h3>
                  
                  <table>
                    <thead>
                      <tr>
                        <th>Prop</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Default</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>apiUrl</td>
                        <td>string</td>
                        <td>The URL for the verification API endpoint</td>
                        <td>/api/auth/verify</td>
                      </tr>
                      <tr>
                        <td>onVerificationComplete</td>
                        <td>function</td>
                        <td>Callback function called with the verification result</td>
                        <td>undefined</td>
                      </tr>
                      <tr>
                        <td>className</td>
                        <td>string</td>
                        <td>Additional CSS classes to apply to the component</td>
                        <td>&quot;&quot;</td>
                      </tr>
                    </tbody>
                  </table>

                  <h3>Example Usage</h3>
                  
                  <pre>
                    <code className="language-jsx">{`import { IdentityVerifier } from 'openid-guard/react';

function VerificationPage() {
  const handleVerificationComplete = (result) => {
    if (result.success) {
      console.log('User verified successfully!');
      console.log('DID:', result.did);
      console.log('Trust Score:', result.trustScore.score);
    } else {
      console.log('Verification failed:', result.message);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Verify Your Identity</h1>
      <IdentityVerifier 
        apiUrl="/api/auth/verify"
        onVerificationComplete={handleVerificationComplete}
        className="max-w-md mx-auto"
      />
    </div>
  );
}`}</code>
                  </pre>

                  <h2>Customization</h2>
                  
                  <p>
                    If you need to customize the verification process further, you can use the 
                    low-level API directly and build your own UI. Here&apos;s an example:
                  </p>

                  <pre>
                    <code className="language-jsx">{`import { useState } from 'react';
import { verifyIdentity } from 'openid-guard/core';

function CustomVerifier() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const verificationResult = await verifyIdentity({
        userId: 'user_' + Math.random().toString(36).substring(2),
        email,
        token: 'your-auth-token',
        mode: 'standard',
      });
      
      setResult(verificationResult);
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Identity'}
        </button>
      </form>
      
      {result && (
        <div>
          <h2>Verification Result</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}`}</code>
                  </pre>

                  <h2>Internationalization (i18n)</h2>
                  
                  <p>
                    The IdentityVerifier component supports internationalization through 
                    the next-i18next library. To use it, make sure you have the proper 
                    translations set up in your project.
                  </p>

                  <pre>
                    <code className="language-javascript">{`// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'uz', 'ko'],
  },
};`}</code>
                  </pre>
                </motion.div>
              )}

              {/* Verification */}
              {activeSection === 'verification' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1>Identity Verification</h1>
                  
                  <p>
                    OpenID Guard uses a multi-factor approach to verify identities while 
                    respecting user privacy. This section explains how the verification 
                    process works and how to interpret the results.
                  </p>

                  <h2>Verification Modes</h2>
                  
                  <p>
                    OpenID Guard supports two verification modes:
                  </p>

                  <ul>
                    <li>
                      <strong>Standard Mode</strong>: Provides complete verification details, 
                      including the DID, trust score, and verification factors.
                    </li>
                    <li>
                      <strong>Zero-Knowledge Mode</strong>: Verifies identity without exposing 
                      sensitive details. Only returns the minimum necessary information.
                    </li>
                  </ul>

                  <h2>Trust Score System</h2>
                  
                  <p>
                    The trust score is a measure of how likely the user is a legitimate human 
                    with a valid identity. It&apos;s calculated based on various factors:
                  </p>

                  <ul>
                    <li><strong>Email Verification</strong>: Has the user verified their email address?</li>
                    <li><strong>CAPTCHA Verification</strong>: Has the user passed a CAPTCHA challenge?</li>
                    <li><strong>IP Reputation</strong>: Is the user&apos;s IP address associated with suspicious activity?</li>
                    <li><strong>Device Trust</strong>: Is the user&apos;s device known and trusted?</li>
                    <li><strong>Account Age</strong>: How long has the user had an account with the service?</li>
                  </ul>

                  <h3>Risk Levels</h3>
                  
                  <p>
                    Based on the trust score, users are assigned one of three risk levels:
                  </p>

                  <ul>
                    <li><strong>Low Risk</strong> (Score &gt;= 0.7): Highly likely to be a legitimate user</li>
                    <li><strong>Medium Risk</strong> (Score 0.4-0.7): May require additional verification</li>
                    <li><strong>High Risk</strong> (Score &lt; 0.4): Likely fraudulent or bot activity</li>
                  </ul>

                  <h2>Decentralized Identifiers (DIDs)</h2>
                  
                  <p>
                    OpenID Guard uses W3C-compliant Decentralized Identifiers (DIDs) to create 
                    portable, self-sovereign identities for users. DIDs are generated using the 
                    `did:key` method, which creates cryptographically secure identifiers based 
                    on public key cryptography.
                  </p>

                  <h3>DID Format</h3>
                  
                  <pre>
                    <code>did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK</code>
                  </pre>

                  <p>
                    The DID consists of three parts:
                  </p>

                  <ul>
                    <li><code>did:</code> - The DID scheme prefix</li>
                    <li><code>key:</code> - The DID method (in this case, the key method)</li>
                    <li><code>z6Mk...</code> - The method-specific identifier (a base58-encoded public key)</li>
                  </ul>

                  <h2>Try It Out</h2>
                  
                  <p>
                    Here&apos;s a live example of the verification component. Enter your email to see 
                    how it works:
                  </p>

                  <div className="my-8">
                    <IdentityVerifier />
                  </div>
                </motion.div>
              )}

              {/* Examples */}
              {activeSection === 'examples' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1>Examples & Use Cases</h1>
                  
                  <p>
                    This section provides examples and use cases for OpenID Guard in various 
                    scenarios.
                  </p>

                  <h2>Web Application Authentication</h2>
                  
                  <p>
                    Use OpenID Guard to add an extra layer of verification to your traditional 
                    username/password authentication system.
                  </p>

                  <pre>
                    <code className="language-javascript">{`// Example: Add verification to login process
async function handleLogin(username, password) {
  // First, authenticate the user normally
  const authResult = await authenticateUser(username, password);
  
  if (authResult.success) {
    // Then, verify their identity
    const verificationResult = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: authResult.userId,
        token: authResult.token,
        email: username,
      }),
    }).then(res => res.json());
    
    if (verificationResult.success && verificationResult.trustScore.score >= 0.7) {
      // High trust score - allow full access
      redirectToApp();
    } else if (verificationResult.success && verificationResult.trustScore.score >= 0.4) {
      // Medium trust score - allow access with limitations
      redirectToAppWithLimitations();
    } else {
      // Low trust score - require additional verification
      redirectToAdditionalVerification();
    }
  } else {
    showLoginError(authResult.message);
  }
}`}</code>
                  </pre>

                  <h2>Web3 Dapp Integration</h2>
                  
                  <p>
                    Use OpenID Guard in Web3 decentralized applications to create a bridge between 
                    traditional identity verification and blockchain wallets.
                  </p>

                  <pre>
                    <code className="language-javascript">{`// Example: Link wallet address to verified identity
async function linkWalletToIdentity(walletAddress) {
  // First, verify user identity
  const verificationResult = await openIdGuard.verify({
    email: userEmail,
    mode: 'zero-knowledge',
  });
  
  if (verificationResult.success) {
    // Then, link wallet address to the verified DID
    const linkResult = await fetch('/api/link-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        did: verificationResult.did,
        walletAddress,
      }),
    }).then(res => res.json());
    
    if (linkResult.success) {
      showSuccess('Wallet linked to your verified identity!');
    } else {
      showError(linkResult.message);
    }
  } else {
    showError('Identity verification failed');
  }
}`}</code>
                  </pre>

                  <h2>Multi-Factor Authentication</h2>
                  
                  <p>
                    Combine OpenID Guard with other authentication methods to create a 
                    robust multi-factor authentication system.
                  </p>

                  <pre>
                    <code className="language-javascript">{`// Example: Multi-factor authentication flow
async function performMfa(userId) {
  // Step 1: Password authentication (already done)
  
  // Step 2: Email OTP verification
  const otpSent = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail }),
  }).then(res => res.json());
  
  if (otpSent.success) {
    // User enters OTP code in UI
    const otpCode = await promptUserForOtp();
    
    const otpVerified = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, code: otpCode }),
    }).then(res => res.json());
    
    if (!otpVerified.verified) {
      return showError('Invalid OTP code');
    }
  } else {
    return showError('Failed to send OTP');
  }
  
  // Step 3: Identity verification with OpenID Guard
  const verificationResult = await fetch('/api/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      token: authToken,
      email: userEmail,
      captchaToken: captchaResponse,
    }),
  }).then(res => res.json());
  
  if (verificationResult.success) {
    // All verification steps passed
    grantAccessToProtectedResource();
  } else {
    showError('Identity verification failed');
  }
}`}</code>
                  </pre>

                  <h2>Backend API Protection</h2>
                  
                  <p>
                    Use OpenID Guard to protect sensitive API endpoints from unauthorized 
                    access and potential attacks.
                  </p>

                  <pre>
                    <code className="language-javascript">{`// Example: Protecting an API endpoint with verification
// Fastify middleware to check trust score
async function verifyTrustScore(request, reply) {
  const { userId, token } = request;
  
  // Skip verification for non-sensitive endpoints
  if (!isSensitiveEndpoint(request.url)) {
    return;
  }
  
  try {
    // Verify identity and check trust score
    const verification = await server.openIdGuard.verify({
      userId,
      token,
      mode: 'standard',
    });
    
    // Attach trust score to request for later use
    request.trustScore = verification.trustScore;
    
    // Reject requests with low trust scores
    if (verification.trustScore.score < 0.4) {
      return reply.status(403).send({
        error: 'Access denied',
        message: 'Additional identity verification required',
      });
    }
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({
      error: 'Verification error',
      message: 'An error occurred during verification',
    });
  }
}`}</code>
                  </pre>
                </motion.div>
              )}
            </MDXProvider>
          </div>
        </div>
      </div>
    </main>
  );
}