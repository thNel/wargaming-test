import { SUPPORTED_LOCALES, type SupportedLocale } from "./supportedLocales";

export function normalizeLocale(locale: string): string {
  return locale.replaceAll("-", "_").toLowerCase();
}

export function findSupportedLocale(locale: string): SupportedLocale | undefined {
  let candidate = normalizeLocale(locale);

  while (candidate) {
    const supportedLocale = SUPPORTED_LOCALES.find((supported) => supported === candidate);

    if (supportedLocale) {
      return supportedLocale;
    }

    const separatorIndex = candidate.lastIndexOf("_");

    if (separatorIndex < 0) {
      return undefined;
    }

    candidate = candidate.slice(0, separatorIndex);
  }

  return undefined;
}

export function getLanguageTag(locale: SupportedLocale): string {
  const [language, region] = locale.split("_");

  return region ? `${language}-${region.toUpperCase()}` : language;
}
