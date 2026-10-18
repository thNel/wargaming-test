import type { MouseEvent } from "react";
import { useTranslation } from "react-i18next";

import { Drawer } from "@/shared/components/Drawer/Drawer";
import { SUPPORTED_LOCALES } from "@/shared/i18n/supportedLocales";
import { findSupportedLocale } from "@/shared/i18n/locale.utils";

import { LANGUAGE_NAMES } from "./language-drawer.constants";
import type { LanguageDrawerProps } from "./LanguageDrawer.types";
import styles from "./LanguageDrawer.module.css";

export function LanguageDrawer({ id, onClose, open }: LanguageDrawerProps) {
  const { i18n, t } = useTranslation("main");
  const currentLocale = findSupportedLocale(i18n.resolvedLanguage ?? i18n.language) ?? "en";
  function handleSelect(event: MouseEvent<HTMLButtonElement>): void {
    const locale = findSupportedLocale(event.currentTarget.value);

    if (!locale) {
      return;
    }

    void i18n.changeLanguage(locale);
    onClose();
  }

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
