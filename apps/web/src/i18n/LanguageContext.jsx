import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from './translations.js';

// Create context
const LanguageContext = createContext(null);

// Storage key for persisting language preference
const LANGUAGE_STORAGE_KEY = 'yieldnewshub_language';

// Supported languages
export const LANGUAGES = {
  en: { code: 'en', name: 'English', nativeName: 'EN' },
  zh: { code: 'zh', name: 'Chinese', nativeName: '\u4e2d\u6587' },
};

// Get initial language from localStorage or browser preference
function getInitialLanguage() {
  // Try to get from localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && translations[stored]) {
      return stored;
    }

    // Try to detect from browser
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang) {
      const langCode = browserLang.split('-')[0];
      if (translations[langCode]) {
        return langCode;
      }
    }
  }

  // Default to English
  return 'en';
}

// Language Provider Component
export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  // Persist language preference to localStorage
  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  // Set language with validation
  const setLanguage = useCallback((lang) => {
    if (translations[lang]) {
      setLanguageState(lang);
    } else {
      console.warn(`Language "${lang}" is not supported. Falling back to English.`);
      setLanguageState('en');
    }
  }, []);

  // Toggle between languages
  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'en' ? 'zh' : 'en'));
  }, []);

  // Translation function
  const t = useCallback(
    (key) => {
      const translation = translations[language]?.[key];
      if (translation === undefined) {
        console.warn(`Translation missing for key "${key}" in language "${language}"`);
        return translations['en']?.[key] || key;
      }
      return translation;
    },
    [language]
  );

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    languages: LANGUAGES,
    currentLanguage: LANGUAGES[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Hook to just get translation function (shorthand)
export function useTranslation() {
  const { t } = useLanguage();
  return t;
}

export default LanguageContext;
