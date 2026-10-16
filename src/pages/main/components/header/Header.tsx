import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { LanguageDrawer } from "../language-drawer/LanguageDrawer";
import styles from "./Header.module.css";

/* eslint-disable a11yinspect/button-element-error -- The translated language label is present for every supported locale. */
export function Header() {
  const { i18n, t } = useTranslation("main");
  const [isLanguageDrawerOpen, setIsLanguageDrawerOpen] = useState(false);
  const languageCode = (i18n.resolvedLanguage ?? i18n.language ?? "en")
    .replaceAll("_", "-")
    .toUpperCase();
  const handleLanguageButtonClick = useCallback(() => {
    setIsLanguageDrawerOpen((isOpen) => !isOpen);
  }, []);
  const handleLanguageDrawerClose = useCallback(() => {
    setIsLanguageDrawerOpen(false);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <a className={styles.brand} href="/" aria-label="Fleet Catalog home">
            <img src="/images/logo-wows-long-raster.webp" alt="World of Warships" />
          </a>

          <button
            aria-controls="language-drawer"
            aria-expanded={isLanguageDrawerOpen}
            aria-label={t("language")}
            className={styles.languageButton}
            onClick={handleLanguageButtonClick}
            type="button"
          >
            <span className={styles.languageIcon} aria-hidden="true" />
            <span>{languageCode}</span>
          </button>
        </div>
      </header>
      <LanguageDrawer
        id="language-drawer"
        open={isLanguageDrawerOpen}
        onClose={handleLanguageDrawerClose}
      />
    </>
  );
}
