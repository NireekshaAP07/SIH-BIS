import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { TRANSLATIONS, type LangCode, type Translations } from './translations';

interface LanguageContextValue {
  lang: LangCode;
  setLang: (code: LangCode) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: TRANSLATIONS.en,
});

const STORAGE_KEY = 'bis_lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as LangCode | null;
      return stored && stored in TRANSLATIONS ? stored : 'en';
    } catch {
      return 'en';
    }
  });

  function setLang(code: LangCode) {
    setLangState(code);
    try { localStorage.setItem(STORAGE_KEY, code); } catch {}
    // Update HTML lang attribute for accessibility
    document.documentElement.lang = code;
  }

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: TRANSLATIONS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  return useContext(LanguageContext);
}
