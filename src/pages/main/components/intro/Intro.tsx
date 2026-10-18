import { useTranslation } from "react-i18next";

import styles from "./Intro.module.css";

export function Intro() {
  const { t } = useTranslation("main");

  return (
    <div className={styles.intro}>
      <h1 className={styles.title}>{t("title")}</h1>
    </div>
  );
}
