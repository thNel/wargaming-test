export const SUPPORTED_LOCALES = Object.freeze([
  "cs",
  "de",
  "en",
  "es",
  "es_mx",
  "fr",
  "it",
  "ja",
  "ko",
  "nl",
  "pl",
  "pt_br",
  "ru",
  "th",
  "tr",
  "uk",
  "zh_cn",
  "zh_sg",
  "zh_tw",
] as const);

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
