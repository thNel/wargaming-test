import { useCallback, type ChangeEventHandler } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/store";
import { setCatalogSearchTerm } from "@/store/filters/filtersSlice";

import styles from "./SearchFilter.module.css";

export function SearchFilter() {
  const { t } = useTranslation("filters");
  const dispatch = useDispatch<AppDispatch>();
  const searchTerm = useSelector((state: RootState) => state.filters.searchTerm);
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => dispatch(setCatalogSearchTerm(event.currentTarget.value)),
    [dispatch],
  );

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
