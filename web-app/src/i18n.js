import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "appName": "KrishiEaze",
      "sidebar": {
        "dashboard": "Dashboard",
        "myListings": "My Listings",
        "orders": "Orders",
        "mandiPrices": "Mandi Prices",
        "myProfile": "My Profile",
        "logout": "Logout"
      },
      "dashboard": {
        "title": "Dashboard",
        "welcome": "Welcome back",
        "newListing": "New Listing",
        "totalSales": "Total Sales",
        "activeListings": "Active Listings",
        "pendingOrders": "Pending Orders",
        "marketTrends": "Market Trends",
        "recentTransactions": "Recent Transactions",
        "viewHistory": "View History",
        "weatherOutlook": "Weather Outlook",
        "confirmed": "Confirmed",
        "total": "Total",
        "actionReq": "Action Req.",
        "stable": "Stable"
      }
    }
  },
  hi: {
    translation: {
      "appName": "कृषि-ईज़",
      "sidebar": {
        "dashboard": "डैशबोर्ड",
        "myListings": "मेरी लिस्टिंग",
        "orders": "ऑर्डर",
        "mandiPrices": "मंडी के भाव",
        "myProfile": "मेरी प्रोफ़ाइल",
        "logout": "लॉग आउट"
      },
      "dashboard": {
        "title": "डैशबोर्ड",
        "welcome": "वापसी पर स्वागत है",
        "newListing": "नई लिस्टिंग",
        "totalSales": "कुल बिक्री",
        "activeListings": "सक्रिय लिस्टिंग",
        "pendingOrders": "लंबित ऑर्डर",
        "marketTrends": "बाजार के रुझान",
        "recentTransactions": "हाल का लेन-देन",
        "viewHistory": "इतिहास देखें",
        "weatherOutlook": "मौसम का हाल",
        "confirmed": "पुष्टि की गई",
        "total": "कुल",
        "actionReq": "कार्रवाई आवश्यक",
        "stable": "स्थिर"
      }
    }
  },
  mr: {
    translation: {
      "appName": "कृषी-ईझ",
      "sidebar": {
        "dashboard": "डॅशबोर्ड",
        "myListings": "माझी सूची",
        "orders": "ऑर्डर्स",
        "mandiPrices": "मंडी भाव",
        "myProfile": "माझी प्रोफाईल",
        "logout": "बाहेर पडा"
      },
      "dashboard": {
        "title": "डॅशबोर्ड",
        "welcome": "पुन्हा स्वागत आहे",
        "newListing": "नवीन सूची",
        "totalSales": "एकूण विक्री",
        "activeListings": "सक्रिय सूची",
        "pendingOrders": "प्रलंबित ऑर्डर्स",
        "marketTrends": "बाजार कल",
        "recentTransactions": "अलीकडील व्यवहार",
        "viewHistory": "इतिहास पहा",
        "weatherOutlook": "हवामानाचा अंदाज",
        "confirmed": "पुष्टी केली",
        "total": "एकूण",
        "actionReq": "कृती आवश्यक",
        "stable": "स्थिर"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
