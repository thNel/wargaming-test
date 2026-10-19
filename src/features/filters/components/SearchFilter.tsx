import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { normalizeSearchTerm } from "@/shared/utils/normalizeSearchTerm";
import type { AppDispatch, RootState } from "@/store";
import { setCatalogSearchTerm } from "@/store/filters/filtersSlice";

import { FILTER_SEARCH_DEBOUNCE_MS } from "../filters.constants";
import type { SearchDraft, SearchFilterProps } from "./SearchFilter.types";
import styles from "./SearchFilter.module.css";

export function SearchFilter({ onPendingChange, resetVersion }: SearchFilterProps) {
  const { t } = useTranslation("filters");
  const dispatch = useDispatch<AppDispatch>();
  const appliedSearchTerm = useSelector((state: RootState) => state.filters.searchTerm);
  const [searchDraft, setSearchDraft] = useState<SearchDraft | null>(null);
  const searchTerm =
    searchDraft?.appliedSearchTerm === appliedSearchTerm &&
    searchDraft.resetVersion === resetVersion
      ? searchDraft.value
      : appliedSearchTerm;

  useEffect(() => {
    if (normalizeSearchTerm(searchTerm) === normalizeSearchTerm(appliedSearchTerm)) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      dispatch(setCatalogSearchTerm(searchTerm));
      onPendingChange(false);
    }, FILTER_SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [appliedSearchTerm, dispatch, onPendingChange, searchTerm]);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextSearchTerm = event.currentTarget.value;

    setSearchDraft({ appliedSearchTerm, resetVersion, value: nextSearchTerm });
    onPendingChange(normalizeSearchTerm(nextSearchTerm) !== normalizeSearchTerm(appliedSearchTerm));
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
