import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/store";
import { setCatalogSearchTerm } from "@/store/filters/filtersSlice";

import styles from "./SearchFilter.module.css";

export function SearchFilter() {
  const { t } = useTranslation("filters");
  const dispatch = useDispatch<AppDispatch>();
  const searchTerm = useSelector((state: RootState) => state.filters.searchTerm);
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    dispatch(setCatalogSearchTerm(event.currentTarget.value));
  }

  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor="catalog-search">
        {t("search")}
      </label>
      <input
        className={styles.input}
        id="catalog-search"
        onChange={handleChange}
        placeholder={t("search")}
        type="search"
        value={searchTerm}
      />
    </div>
  );
}
