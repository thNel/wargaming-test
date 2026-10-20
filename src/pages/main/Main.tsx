import { preload } from "react-dom";
import { useSelector } from "react-redux";

import { Header } from "./components/header/Header";
import { Intro } from "./components/intro/Intro";
import { Catalog } from "@/features/catalog/Catalog";
import { Filters } from "@/features/filters/Filters";
import { selectNationFlagUrls } from "@/store/catalog/catalog.selectors";

import styles from "./Main.module.css";

export function Main() {
  const nationFlagUrls = useSelector(selectNationFlagUrls);

  for (const url of nationFlagUrls) {
    preload(url, { as: "image", fetchPriority: "low" });
  }

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
