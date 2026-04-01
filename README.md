# OpenID Guard

![OpenID Guard](https://via.placeholder.com/1200x300/0a0a0a/3b82f6?text=OpenID+Guard)

**OpenID Guard** is a universal, privacy-respecting identity verification system for both Web2 and Web3 applications. It provides developers with tools to verify user identities without compromising user privacy.

## 🔒 Features

- **Privacy-First Verification**: Verify identities without exposing personal data
- **Zero-Knowledge Proofs**: Allow users to prove their identity without revealing sensitive information
- **Decentralized Identifiers (DIDs)**: Generate and use W3C-compliant DIDs
- **Trust Score System**: Calculate trustworthiness based on multiple verification factors
- **Email Verification**: Secure OTP verification via Supabase
- **Bot Resistance**: Optional hCaptcha integration
- **Multilingual Support**: i18n with English, Uzbek, and Korean translations
- **Modern UI**: Built with Tailwind CSS and Framer Motion
- **TypeScript**: End-to-end type safety

## 🛠️ Tech Stack

### Frontend
- [Next.js](https://nextjs.org/) with TypeScript
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [next-i18next](https://github.com/i18next/next-i18next) for internationalization

### Backend
- [Fastify](https://www.fastify.io/) with TypeScript
- [did-jwt](https://github.com/decentralized-identity/did-jwt) for DID operations
- [Supabase](https://supabase.io/) for email services
- [hCaptcha](https://www.hcaptcha.com/) for bot prevention (optional)

## 📋 Project Structure

```
openid-guard/
├── frontend/                # Next.js frontend
│   ├── public/              # Public assets and locales
│   │   └── locales/         # i18n translation files
│   ├── src/                 # Source code
│   │   ├── app/             # Next.js pages
│   │   ├── components/      # React components
│   │   └── lib/             # Utility functions
│   ├── next.config.js       # Next.js configuration
│   └── next-i18next.config.js # i18n configuration
│
├── backend/                 # Fastify backend
│   ├── src/                 # Source code
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic services
│   │   └── index.ts         # Server entry point
│   └── .env                 # Environment variables
│
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 14.0 or higher
- npm or yarn

### Installation

#### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env.local` file based on `.env.example`.

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

#### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file based on `.env.example`.

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 📖 Documentation

Comprehensive documentation is available at the `/docs` route when running the application. It includes:

- API Reference
- Component Documentation
- Integration Guides
- Examples

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your-hcaptcha-site-key
```

#### Backend (.env)

```
PORT=3001
HOST=0.0.0.0
NODE_ENV=development
API_VERSION=1.0.0
LOG_LEVEL=info

ALLOWED_ORIGINS=http://localhost:3000

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key

HCAPTCHA_SITE_KEY=your-hcaptcha-site-key
HCAPTCHA_SECRET=your-hcaptcha-secret

JWT_SECRET=your-jwt-secret-key
```

## 🌍 Internationalization

OpenID Guard supports multiple languages. Translation files are located in:

```
frontend/public/locales/
├── en/              # English
├── uz/              # Uzbek
└── ko/              # Korean
```

To add a new language, create a new directory with the language code and add translation files.

## 📱 Components

### IdentityVerifier

The main component for identity verification.

```jsx
import { IdentityVerifier } from '@/components/IdentityVerifier';

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
}
```

### TrustFeedbackUI

A component to display trust scores and verification results.

```jsx
import { TrustFeedbackUI } from '@/components/TrustFeedbackUI';

function MyApp({ verificationResult }) {
  return (
    <TrustFeedbackUI
      did={verificationResult.did}
      trustScore={verificationResult.trustScore}
      verifiedAt={verificationResult.verifiedAt}
      animated={true}
      showDetails={true}
    />
  );
}
```

## 🛣️ API Endpoints

### Authentication

- `POST /api/auth/login` - Authenticate a user
- `POST /api/auth/verify` - Verify a user's identity
- `POST /api/auth/register` - Register a new user

### Email Verification

- `POST /api/auth/send-otp` - Send a verification code
- `POST /api/auth/verify-otp` - Verify an OTP code

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚡ Powered By

- [Next.js](https://nextjs.org/)
- [Fastify](https://www.fastify.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Supabase](https://supabase.io/)
- [did-jwt](https://github.com/decentralized-identity/did-jwt)