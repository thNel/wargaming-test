import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { CATALOG_DICTIONARIES } from "@/features/catalog/locales";

const LANGUAGE_STORAGE_KEY = "wows-language";
const SUPPORTED_LOCALES = Object.keys(CATALOG_DICTIONARIES);
const INITIAL_LOCALE = getInitialLocale();

function normalizeLocale(locale: string): string {
  return locale.replaceAll("-", "_").toLowerCase();
}

function findSupportedLocale(locale: string): string | undefined {
  const normalizedLocale = normalizeLocale(locale);

  return SUPPORTED_LOCALES.find(
    (supportedLocale) =>
      normalizedLocale === supportedLocale || normalizedLocale.startsWith(`${supportedLocale}_`),
  );
}

function getInitialLocale(): string {
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

export const I18N = i18n.use(initReactI18next);

void I18N.init({
  lng: INITIAL_LOCALE,
  fallbackLng: "en",
  supportedLngs: SUPPORTED_LOCALES,
  defaultNS: "catalog",
  resources: Object.fromEntries(
    Object.entries(CATALOG_DICTIONARIES).map(([locale, dictionary]) => [
      locale,
      { catalog: dictionary },
    ]),
  ),
  interpolation: {
    escapeValue: false,
  },
});

try {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, INITIAL_LOCALE);
} catch {
  // Language selection still works when storage is unavailable.
}

I18N.on("languageChanged", (locale) => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, findSupportedLocale(locale) ?? "en");
  } catch {
    // Language selection still works when storage is unavailable.
  }
});
