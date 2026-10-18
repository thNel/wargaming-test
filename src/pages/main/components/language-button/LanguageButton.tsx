import { useTranslation } from "react-i18next";

import type { LanguageButtonProps } from "./LanguageButton.types";
import styles from "./LanguageButton.module.css";

export function LanguageButton({ expanded, onClick }: LanguageButtonProps) {
  const { i18n, t } = useTranslation("main");
  const languageCode = (i18n.resolvedLanguage ?? i18n.language ?? "en")
    .replaceAll("_", "-")
    .toUpperCase();

  return (
    <button
      aria-controls="language-drawer"
      aria-expanded={expanded}
      aria-label={t("language")}
      className={styles.button}
      onClick={onClick}
      type="button"
    >
      <span className={styles.icon} aria-hidden="true" />
      <span>{languageCode}</span>
    </button>
  );
}
