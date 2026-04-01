// src/i18n.ts
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

// Define translation resources
const resources = {
  en: {
    common: {
        "site": {
          "title": "OpenID Guard",
          "description": "Next-generation identity verification with uncompromising privacy and military-grade encryption.",
          "tagline": "Privacy-Respecting Identity Verification"
        },
        "nav": {
          "features": "Features",
          "docs": "Docs",
          "github": "GitHub",
          "demo": "Try Demo"
        },
        "hero": {
          "title": "OpenID Guard",
          "subtitle": "Next-generation identity verification with uncompromising privacy and military-grade encryption."
        },
        "feature": {
          "title": "Advanced Security Features",
          "zero_knowledge": {
            "title": "Zero-Knowledge Proofs",
            "description": "Verify identity without exposing personal data or credentials"
          },
          "quantum_resistant": {
            "title": "Quantum-Resistant Encryption",
            "description": "Future-proof security against next-generation computational threats"
          },
          "biometric": {
            "title": "Biometric Authentication",
            "description": "Multi-modal biometric verification with local processing only"
          }
        },
        "verifier": {
          "title": "OpenID Guard Verification",
          "email_label": "Email Address",
          "email_placeholder": "your@email.com",
          "zero_knowledge_mode": "Zero-Knowledge Mode",
          "standard_mode": "Standard Mode",
          "enhanced_privacy": "Enhanced privacy",
          "standard_verification": "Standard verification",
          "verify_button": "Verify Identity",
          "verifying": "Verifying...",
          "success": "Verification Successful",
          "success_message": "Your identity has been verified",
          "failure": "Verification Failed",
          "retry": "Verify Another Identity",
          "digital_passport": "DIGITAL PASSPORT",
          "decentralized_id": "Decentralized ID",
          "trust_score": "Trust Score",
          "risk_level": "Risk Level",
          "trust_factors": "Trust Factors",
          "verification_mode": "Verification Mode",
          "verified_at": "Verified At",
          "expires": "Expires",
          "show_private_info": "Show Private Info",
          "hide_private_info": "Hide Private Info",
          "high_risk": "High Risk",
          "medium_risk": "Medium Risk",
          "low_risk": "Low Risk"
        },
        "status": {
          "network_secure": "Network Secure"
        },
        "language": {
          "en": "English",
          "uz": "O'zbek",
          "ko": "한국어"
        },
        "demo": {
          "title": "Try OpenID Guard's identity verification in action. Enter your email to see the trust score system and digital passport."
        }
      }
  },
  uz: {
    common: {
        "site": {
          "title": "OpenID Guard",
          "description": "Shaxsiy ma'lumotlarni himoya qilish va harbiy darajadagi shifrlanish bilan keyingi avlod identifikatsiyasi.",
          "tagline": "Shaxsiy ma'lumotlarga hurmat bilan yondashuvchi identifikatsiya"
        },
        "nav": {
          "features": "Imkoniyatlar",
          "docs": "Hujjatlar",
          "github": "GitHub",
          "demo": "Sinab Ko'rish"
        },
        "hero": {
          "title": "OpenID Guard",
          "subtitle": "Shaxsiy ma'lumotlarni himoya qilish va harbiy darajadagi shifrlanish bilan keyingi avlod identifikatsiyasi."
        },
        "feature": {
          "title": "Kengaytirilgan Xavfsizlik Imkoniyatlari",
          "zero_knowledge": {
            "title": "Nol-Bilim Isbot",
            "description": "Shaxsiy ma'lumotlarni oshkor qilmasdan shaxsni tasdiqlash"
          },
          "quantum_resistant": {
            "title": "Kvant-Bardoshli Shifrlanish",
            "description": "Kelajak avlod hisoblash tahdidlariga qarshi kelajakka mo'ljallangan xavfsizlik"
          },
          "biometric": {
            "title": "Biometrik Autentifikatsiya",
            "description": "Shaxsiy ma'lumotlarni himoya qilish va harbiy darajadagi shifrlanish bilan keyingi avlod identifikatsiyasi.",
            "tagline": "Shaxsiy ma'lumotlarga hurmat bilan yondashuvchi identifikatsiya"
            },
            "nav": {
                "features": "Imkoniyatlar",
                "docs": "Hujjatlar",
                "github": "GitHub",
                "demo": "Sinab Ko'rish"
            },
            "hero": {
                "title": "OpenID Guard",
                "subtitle": "Shaxsiy ma'lumotlarni himoya qilish va harbiy darajadagi shifrlanish bilan keyingi avlod identifikatsiyasi."
            },
            "feature": {
                "title": "Kengaytirilgan Xavfsizlik Imkoniyatlari",
                "zero_knowledge": {
                "title": "Nol-Bilim Isbot",
                "description": "Shaxsiy ma'lumotlarni oshkor qilmasdan shaxsni tasdiqlash"
                },
                "quantum_resistant": {
                "title": "Kvant-Bardoshli Shifrlanish",
                "description": "Kelajak avlod hisoblash tahdidlariga qarshi kelajakka mo'ljallangan xavfsizlik"
                },
                "biometric": {
                "title": "Biometrik Autentifikatsiya",
                "description": "Faqat mahalliy ishlov berish bilan ko'p modal biometrik tekshirish"
                }
            },
            "verifier": {
                "title": "OpenID Guard Tekshiruvi",
                "email_label": "Elektron pochta",
                "email_placeholder": "sizning@pochta.com",
                "zero_knowledge_mode": "Nol-Bilim Rejimi",
                "standard_mode": "Standart Rejim",
                "enhanced_privacy": "Kuchaytirilgan maxfiylik",
                "standard_verification": "Standart tekshirish",
                "verify_button": "Shaxsni tasdiqlash",
                "verifying": "Tekshirilmoqda...",
                "success": "Tekshirish Muvaffaqiyatli",
                "success_message": "Shaxsingiz tasdiqlandi",
                "failure": "Tekshirish Muvaffaqiyatsiz",
                "retry": "Boshqa Shaxsni Tekshirish",
                "digital_passport": "RAQAMLI PASPORT",
                "decentralized_id": "Markazlashmagan ID",
                "trust_score": "Ishonch baholari",
                "risk_level": "Xavf darajasi",
                "trust_factors": "Ishonch omillari",
                "verification_mode": "Tekshirish rejimi",
                "verified_at": "Tekshirilgan vaqti",
                "expires": "Amal qilish muddati",
                "show_private_info": "Shaxsiy ma'lumotlarni ko'rsatish",
                "hide_private_info": "Shaxsiy ma'lumotlarni yashirish",
                "high_risk": "Yuqori xavf",
                "medium_risk": "O'rta xavf",
                "low_risk": "Past xavf"
            },
            "status": {
                "network_secure": "Tarmoq Xavfsiz"
            },
            "language": {
                "en": "English",
                "uz": "O'zbek",
                "ko": "한국어"
            },
            "demo": {
              "title": "OpenID Guardning identifikatorini amalda sinab koʻring. Ishonch ball tizimi va raqamli pasportni ko'rish uchun elektron pochtangizni kiriting."
            }
        }
    }
  },
  ko: {
    common: {
        "site": {
          "title": "OpenID 가드",
          "description": "타협하지 않는 개인 정보 보호 및 군사급 암호화를 갖춘 차세대 신원 확인.",
          "tagline": "개인 정보를 존중하는 신원 확인"
        },
        "nav": {
          "features": "기능",
          "docs": "문서",
          "github": "GitHub",
          "demo": "데모 시도"
        },
        "hero": {
          "title": "OpenID 가드",
          "subtitle": "타협하지 않는 개인 정보 보호 및 군사급 암호화를 갖춘 차세대 신원 확인."
        },
        "feature": {
          "title": "고급 보안 기능",
          "zero_knowledge": {
            "title": "제로 지식 증명",
            "description": "개인 데이터나 자격 증명을 노출하지 않고 신원 확인"
          },
          "quantum_resistant": {
            "title": "양자 내성 암호화",
            "description": "차세대 계산 위협에 대한 미래 지향적 보안"
          },
          "biometric": {
            "title": "생체 인식 인증",
            "description": "로컬 처리만으로 멀티모달 생체 인식 확인"
          }
        },
        "verifier": {
          "title": "OpenID 가드 확인",
          "email_label": "이메일 주소",
          "email_placeholder": "your@email.com",
          "zero_knowledge_mode": "제로 지식 모드",
          "standard_mode": "표준 모드",
          "enhanced_privacy": "향상된 개인 정보 보호",
          "standard_verification": "표준 확인",
          "verify_button": "신원 확인",
          "verifying": "확인 중...",
          "success": "확인 성공",
          "success_message": "귀하의 신원이 확인되었습니다",
          "failure": "확인 실패",
          "retry": "다른 신원 확인",
          "digital_passport": "디지털 여권",
          "decentralized_id": "분산 ID",
          "trust_score": "신뢰 점수",
          "risk_level": "위험 수준",
          "trust_factors": "신뢰 요소",
          "verification_mode": "확인 모드",
          "verified_at": "확인 시간",
          "expires": "만료",
          "show_private_info": "개인 정보 표시",
          "hide_private_info": "개인 정보 숨기기",
          "high_risk": "높은 위험",
          "medium_risk": "중간 위험",
          "low_risk": "낮은 위험"
        },
        "status": {
          "network_secure": "네트워크 보안"
        },
        "language": {
          "en": "English",
          "uz": "O'zbek",
          "ko": "한국어"
        },
        "demo": {
          "title": "OpenID Guard의 신원 확인을 실제로 시도해 보세요. 신뢰 점수 시스템과 디지털 여권을 보려면 이메일을 입력하세요."
        }
      }
  }
};

// Create i18next instance
const i18nInstance = createInstance();
i18nInstance
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18nInstance;