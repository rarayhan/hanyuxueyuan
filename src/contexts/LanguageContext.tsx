import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '../lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  showPinyin: boolean;
  setShowPinyin: (show: boolean) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('hanzi_scholar_lang');
    return (saved as Language) || 'en';
  });

  const [showPinyin, setShowPinyin] = useState<boolean>(() => {
    const saved = localStorage.getItem('hanzi_scholar_show_pinyin');
    return saved === null ? true : saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('hanzi_scholar_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('hanzi_scholar_show_pinyin', String(showPinyin));
  }, [showPinyin]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, showPinyin, setShowPinyin, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
