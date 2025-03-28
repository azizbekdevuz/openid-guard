# 🔒 OpenID Guard

**Universal, Open-Source, Privacy-Respecting Identity Verification System for the Web2 + Web3 World**

---

## 🌐 Overview

**OpenID Guard** is a decentralized identity verification protocol and toolkit that helps developers verify users in a **modular, human-first, bot-resistant, and privacy-respecting** way. No centralized tracking. No forced KYC. Just proof that you're real.

Designed for use across:
- 🌍 Web apps
- 🧵 Forums & communities
- 🌐 Decentralized platforms (DAOs, dApps)
- 💼 Job boards & EdTech
- 🔐 Any platform where trust and authenticity matter

---

## 🧩 Why OpenID Guard?

In 2025, trust is broken online:
- AI-generated bots and fake accounts are everywhere.
- Centralized logins (Google/Facebook) compromise privacy.
- People deserve anonymous yet **verifiable** identities.

**OpenID Guard** fixes this.

- ✅ **Proof-of-Human** without revealing your name
- 🧠 Pluggable verification levels (CAPTCHA, email, social, zk-proof)
- 🔓 Built on open standards (DID + Verifiable Credentials)
- 🌍 Universal design (i18n ready)
- 🛠️ Easy integration with API + Widget
- 🤝 Open-source & community-driven

---

## 🔧 MVP Features

| Feature | Status | Description |
|--------|--------|-------------|
| ✅ Anonymous Identity | ✔️ | DID-based identity (no wallet or account needed) |
| ✅ Email Verification | ✔️ | Optional trust layer |
| ✅ CAPTCHA Integration | ✔️ | hCaptcha or custom logic |
| ✅ API + Widget | ✔️ | Drop-in `<IdentityVerifier />` for devs |
| ✅ Score/Level System | 🛠️ | Trust score returned from backend |
| ✅ Docs + Portal | 🛠️ | Integration docs and contributor portal |

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js + Tailwind CSS + TypeScript |
| Backend | Node.js (Fastify) + TypeScript |
| Identity Layer | DID (did:key / did:web), did-jwt |
| DB & Auth | Supabase (PostgreSQL + Auth) |
| Hosting | Vercel (frontend), Railway/Render (backend) |
| Verification | hCaptcha, email OTP, optional zk |
| Docs | GitHub Pages or VitePress (TBD) |

---

## ⚙️ Installation

```bash
# Clone repo
git clone https://github.com/azizbekdevuz/openid-guard.git
cd openid-guard

# Setup Frontend
cd frontend
npm install
npm run dev

# Setup Backend
cd ../backend
npm install
npm run dev
```

---

## 📦 How to Use the Widget (Coming Soon)

```tsx
<IdentityVerifier
  level="basic"
  onVerified={(result) => {
    console.log("User verified:", result);
  }}
/>
```

---

## 🧠 Roadmap

- [x] MVP backend + frontend scaffold
- [x] DID identity support
- [ ] Trust scoring system
- [ ] API key & rate-limiting
- [ ] Developer dashboard
- [ ] ZK support (zkEmail, Semaphore)
- [ ] Multi-language interface

---

## 🤝 Contributing

We welcome contributors of all backgrounds and skill levels!  
Check out [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

- Issues labeled `good first issue`
- Open to translations, integrations, security reviews

---

## 📄 License

MIT License — free for personal and commercial use.

---

## 🧠 Credits / Inspiration

- [W3C DID](https://www.w3.org/TR/did-core/)
- [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)
- [Self.ID](https://developers.ceramic.network/tools/self-id/)
- [Gitcoin Passport](https://passport.gitcoin.co/)
- [Proof of Humanity](https://www.proofofhumanity.id/)

---

## 📣 Stay Connected

Follow the project, open issues, request features, or join the Discord (coming soon).