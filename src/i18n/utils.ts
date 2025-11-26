import en from './en.json';
import hu from './hu.json';
import it from './it.json';
import zh from './zh.json';
import ja from './ja.json';

export const languages = {
  en: 'English',
  hu: 'Magyar',
  it: 'Italiano',
  zh: '中文',
  ja: '日本語'
};

export const defaultLang = 'en';

const translations = {
  en,
  hu,
  it,
  zh,
  ja
};

export type Languages = keyof typeof languages;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Languages;
  return defaultLang;
}

function getNestedTranslation(obj: Record<string, unknown>, key: string): string {
  const keys = key.split('.');
  let current: unknown = obj;
  
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = (current as Record<string, unknown>)[k];
    } else {
      return key; // Return the key if translation not found
    }
  }
  
  return typeof current === 'string' ? current : key;
}

export function useTranslations(lang: Languages) {
  return function t(key: string): string {
    const langTranslations = translations[lang];
    const defaultTranslations = translations[defaultLang];
    
    return getNestedTranslation(langTranslations, key) || 
           getNestedTranslation(defaultTranslations, key) || 
           key;
  }
}

export function useTranslatedPath(lang: Languages) {
  return function translatePath(path: string, l: Languages = lang) {
    return l === defaultLang ? path : `/${String(l)}${path}`;
  }
}

