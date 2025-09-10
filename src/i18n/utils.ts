import { ui, defaultLang, type UiType } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof UiType;
  return defaultLang;
}

export function useTranslations(lang: keyof UiType) {
  return function t(key: keyof UiType[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

export function useTranslatedPath(lang: keyof UiType) {
  return function translatePath(path: string, l: keyof UiType = lang) {
    return l === defaultLang ? path : `/${String(l)}${path}`;
  }
}

// Auto-detect browser language
export function getBrowserLanguage(): string {
  if (typeof window !== 'undefined' && window.navigator) {
    const browserLang = window.navigator.language.split('-')[0];
    const supportedLangs = Object.keys(ui);
    return supportedLangs.includes(browserLang) ? browserLang : defaultLang;
  }
  return defaultLang;
}
