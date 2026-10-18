import { Header } from "./components/header/Header";
import { Intro } from "./components/intro/Intro";
import { Catalog } from "@/features/catalog/Catalog";
import { Filters } from "@/features/filters/Filters";

import styles from "./Main.module.css";

export function Main() {
  return (
    <>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.mainContentInner}>
          <Intro />

          <div className={styles.contentLayout}>
            <Filters />
            <Catalog />
          </div>
        </div>
      </main>
    </>
  );
}
