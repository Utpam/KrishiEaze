import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation dictionaries
const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "mandi_prices": "Mandi Prices",
        "dashboard": "Dashboard",
        "login": "Login",
        "signup": "Sign Up",
        "logout": "Logout",
        "greeting": "Hi"
      },
      "landing": {
        "empowering": "Empowering Indian Agriculture",
        "hero_title": "Fresh from the Farm,",
        "hero_title_highlight": "Direct to You.",
        "hero_subtitle": "Connecting farmers directly with consumers and businesses. Eliminate middlemen, get fair prices, and access real-time Mandi rates effortlessly.",
        "get_started": "Get Started",
        "watch_demo": "Watch Demo",
        "stats_farmers": "Farmers",
        "stats_transactions": "Transactions",
        "stats_mandis": "Mandis",
        "earnings_today": "Earnings Today",
        "why_choose_us": "Why Choose Us",
        "everything_needs": "Everything a Farmer Needs",
        "feature_sell": "Sell Produce",
        "feature_sell_desc": "Connecting you directly to the market with tools that empower your growth and secure your profits.",
        "feature_mandi": "Mandi Prices",
        "feature_mandi_desc": "Connecting you directly to the market with tools that empower your growth and secure your profits.",
        "feature_secure": "Secure Payments",
        "feature_secure_desc": "Connecting you directly to the market with tools that empower your growth and secure your profits.",
        "footer": "© 2023 KrishiEaze. Connecting Farmers to Consumers. All rights reserved."
      }
    }
  },
  hi: {
    translation: {
      "nav": {
        "home": "मुख्य पृष्ठ",
        "mandi_prices": "मंडी के भाव",
        "dashboard": "डैशबोर्ड",
        "login": "लॉग इन",
        "signup": "साइन अप",
        "logout": "लॉग आउट",
        "greeting": "नमस्ते"
      },
      "landing": {
        "empowering": "भारतीय कृषि को सशक्त बनाना",
        "hero_title": "खेत से सीधा,",
        "hero_title_highlight": "आप तक।",
        "hero_subtitle": "किसानों को सीधे उपभोक्ताओं और व्यवसायों से जोड़ना। बिचौलियों को खत्म करें, उचित मूल्य प्राप्त करें, और वास्तविक समय में मंडी दरों तक आसानी से पहुंचें।",
        "get_started": "शुरू करें",
        "watch_demo": "डेमो देखें",
        "stats_farmers": "किसान",
        "stats_transactions": "लेनदेन",
        "stats_mandis": "मंडियां",
        "earnings_today": "आज की कमाई",
        "why_choose_us": "हमें क्यों चुनें",
        "everything_needs": "एक किसान को जो कुछ भी चाहिए",
        "feature_sell": "उपज बेचें",
        "feature_sell_desc": "आपके विकास को सशक्त बनाने और आपके मुनाफे को सुरक्षित करने वाले उपकरणों के साथ आपको सीधे बाजार से जोड़ते हैं।",
        "feature_mandi": "मंडी के भाव",
        "feature_mandi_desc": "आपके विकास को सशक्त बनाने और आपके मुनाफे को सुरक्षित करने वाले उपकरणों के साथ आपको सीधे बाजार से जोड़ते हैं।",
        "feature_secure": "सुरक्षित भुगतान",
        "feature_secure_desc": "आपके विकास को सशक्त बनाने और आपके मुनाफे को सुरक्षित करने वाले उपकरणों के साथ आपको सीधे बाजार से जोड़ते हैं।",
        "footer": "© 2023 कृषिईज़ (KrishiEaze)। किसानों को उपभोक्ताओं से जोड़ना। सभी अधिकार सुरक्षित।"
      }
    }
  },
  mr: {
    translation: {
      "nav": {
        "home": "मुख्य पृष्ठ",
        "mandi_prices": "मंडी भाव",
        "dashboard": "डॅशबोर्ड",
        "login": "लॉग इन",
        "signup": "साइन अप",
        "logout": "लॉग आउट",
        "greeting": "नमस्कार"
      },
      "landing": {
        "empowering": "भारतीय शेतीचे सक्षमीकरण",
        "hero_title": "थेट शेतातून,",
        "hero_title_highlight": "तुमच्यापर्यंत.",
        "hero_subtitle": "शेतकऱ्यांना थेट ग्राहक आणि व्यवसायांशी जोडणे. मध्यस्थांना हटवा, रास्त भाव मिळवा आणि रिअल-टाइम मंडी दरांमध्ये सहज प्रवेश मिळवा.",
        "get_started": "सुरू करा",
        "watch_demo": "डेमो पहा",
        "stats_farmers": "शेतकरी",
        "stats_transactions": "व्यवहार",
        "stats_mandis": "मंडई",
        "earnings_today": "आजची कमाई",
        "why_choose_us": "आम्हाला का निवडावे",
        "everything_needs": "शेतकऱ्याला आवश्यक असलेले सर्व काही",
        "feature_sell": "शेतमाल विका",
        "feature_sell_desc": "तुमच्या विकासाला सक्षम करणाऱ्या आणि तुमचा नफा सुरक्षित करणाऱ्या साधनांसह तुम्हाला थेट बाजाराशी जोडतो.",
        "feature_mandi": "मंडी भाव",
        "feature_mandi_desc": "तुमच्या विकासाला सक्षम करणाऱ्या आणि तुमचा नफा सुरक्षित करणाऱ्या साधनांसह तुम्हाला थेट बाजाराशी जोडतो.",
        "feature_secure": "सुरक्षित पेमेंट",
        "feature_secure_desc": "तुमच्या विकासाला सक्षम करणाऱ्या आणि तुमचा नफा सुरक्षित करणाऱ्या साधनांसह तुम्हाला थेट बाजाराशी जोडतो.",
        "footer": "© 2023 कृषिईझ (KrishiEaze). शेतकऱ्यांना ग्राहकांशी जोडणे. सर्व हक्क राखीव."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
