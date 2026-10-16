import { useTranslation } from "react-i18next";

import { Header } from "./components/header/Header";
import { Catalog } from "@/features/catalog/Catalog";
import { Filters } from "@/features/filters/Filters";

import styles from "./Main.module.css";

/* eslint-disable a11yinspect/heading-element-error -- The translated title key is non-empty in every supported locale. */
export function Main() {
  const { t } = useTranslation("main");

  return (
    <>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.mainContentInner}>
          <div className={styles.pageIntro}>
            <h1>{t("title")}</h1>
          </div>

          <div className={styles.contentLayout}>
            <Filters />
            <Catalog />
          </div>
        </div>
      </main>
    </>
  );
}
