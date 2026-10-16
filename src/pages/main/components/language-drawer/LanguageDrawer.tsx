import { useCallback, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";

import { Drawer } from "@/shared/components/Drawer/Drawer";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/shared/i18n/supportedLocales";

import styles from "./LanguageDrawer.module.css";

/* eslint-disable a11yinspect/button-element-error -- The explicit aria-label is a locale name from the exhaustive map below. */
const LANGUAGE_NAMES = Object.freeze({
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

type LanguageDrawerProps = {
  id: string;
  onClose: () => void;
  open: boolean;
};

export function LanguageDrawer({ id, onClose, open }: LanguageDrawerProps) {
  const { i18n, t } = useTranslation("main");
  const currentLocale = (i18n.resolvedLanguage ?? i18n.language ?? "en")
    .replaceAll("-", "_")
    .toLowerCase();
  const handleSelect = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const locale = event.currentTarget.value as SupportedLocale;

      void i18n.changeLanguage(locale);
      onClose();
    },
    [i18n, onClose],
  );

  return (
    <Drawer closeLabel={t("close")} id={id} onClose={onClose} open={open} title={t("language")}>
      <div aria-label={t("language")} className={styles.languageList} role="group">
        {SUPPORTED_LOCALES.map((locale) => (
          <button
            aria-label={LANGUAGE_NAMES[locale]}
            aria-pressed={currentLocale === locale}
            className={styles.languageOption}
            key={locale}
            onClick={handleSelect}
            type="button"
            value={locale}
          >
            <span>{LANGUAGE_NAMES[locale]}</span>
            <span aria-hidden="true" className={styles.languageCode}>
              {locale.replaceAll("_", "-").toUpperCase()}
            </span>
          </button>
        ))}
      </div>
    </Drawer>
  );
}
