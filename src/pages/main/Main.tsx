import { useTranslation } from "react-i18next";

import { Header } from "./components/header/Header";
import { Catalog } from "@/features/catalog/Catalog";
import { Filters } from "@/features/filters/Filters";

import styles from "./Main.module.css";

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
