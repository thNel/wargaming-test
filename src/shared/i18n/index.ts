import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { FILTER_DICTIONARIES } from "@/features/filters/locales";
import { MAIN_DICTIONARIES } from "@/pages/main/locales";
import { SUPPORTED_LOCALES, type SupportedLocale } from "./supportedLocales";
import { findSupportedLocale, getLanguageTag } from "./locale.utils";

const LANGUAGE_STORAGE_KEY = "wows-language";
const initialLocale = getInitialLocale();

function getInitialLocale(): SupportedLocale {
  try {
    const savedLocale = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const supportedSavedLocale = savedLocale ? findSupportedLocale(savedLocale) : undefined;

    if (supportedSavedLocale) {
      return supportedSavedLocale;
    }
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }

  const browserLocales = navigator.languages?.length ? navigator.languages : [navigator.language];

  return browserLocales.map(findSupportedLocale).find(Boolean) ?? "en";
}

function syncLocale(locale: string): void {
  const supportedLocale = findSupportedLocale(locale) ?? "en";

  document.documentElement.lang = getLanguageTag(supportedLocale);

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, supportedLocale);
  } catch {
    // Language selection still works when storage is unavailable.
  }
}

export const i18nInstance = i18n.use(initReactI18next);

i18nInstance.on("languageChanged", syncLocale);

void i18nInstance.init({
  lng: initialLocale,
  fallbackLng: "en",
  supportedLngs: SUPPORTED_LOCALES,
  resources: Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [
      locale,
      { filters: FILTER_DICTIONARIES[locale], main: MAIN_DICTIONARIES[locale] },
    ]),
  ),
  interpolation: {
    escapeValue: false,
  },
});
