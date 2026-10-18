import type { SupportedLocale } from "@/shared/i18n/supportedLocales";

export const LANGUAGE_NAMES = Object.freeze({
  cs: "Čeština",
  de: "Deutsch",
  en: "English",
  es: "Español",
  es_mx: "Español (México)",
  fr: "Français",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  nl: "Nederlands",
  pl: "Polski",
  pt_br: "Português (Brasil)",
  ru: "Русский",
  th: "ไทย",
  tr: "Türkçe",
  uk: "Українська",
  zh_cn: "简体中文",
  zh_sg: "简体中文（新加坡）",
  zh_tw: "繁體中文",
} satisfies Record<SupportedLocale, string>);
