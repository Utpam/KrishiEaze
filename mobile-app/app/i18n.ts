import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';

const STORE_LANGUAGE_KEY = 'settings.lang';

// In-memory fallback
const memoryStore: Record<string, string> = {};

const languageDetectorPlugin = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: async function (callback: (lang: string) => void) {
    try {
      const language = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
      if (language) {
        return callback(language);
      } else {
        return callback('en');
      }
    } catch (error) {
      const fallbackLang = memoryStore[STORE_LANGUAGE_KEY] || 'en';
      return callback(fallbackLang);
    }
  },
  cacheUserLanguage: async function (language: string) {
    try {
      await AsyncStorage.setItem(STORE_LANGUAGE_KEY, language);
    } catch (error) {
      memoryStore[STORE_LANGUAGE_KEY] = language;
    }
  },
};


const resources = {
  en: {
    translation: en,
  },
  hi: {
    translation: hi,
  },
  mr: {
    translation: mr,
  },
};


i18n
  .use(initReactI18next)
  // .use(languageDetectorPlugin) // Can re-enable if persistence is fully needed, for now we can just rely on basic init
  .init({
    resources,
    compatibilityJSON: 'v3',
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
