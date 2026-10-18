import { useCallback, type ChangeEventHandler } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Checkbox } from "@/shared/components/Checkbox/Checkbox";
import type { AppDispatch, RootState } from "@/store";
import { setShowHiddenShips, setShowMissingShips } from "@/store/filters/filtersSlice";

import styles from "./VisibilityFilterGroup.module.css";

export function VisibilityFilterGroup() {
  const { t } = useTranslation("filters");
  const dispatch = useDispatch<AppDispatch>();
  const showHidden = useSelector((state: RootState) => state.filters.showHidden);
  const showMissing = useSelector((state: RootState) => state.filters.showMissing);
  const handleShowHiddenChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => dispatch(setShowHiddenShips(event.currentTarget.checked)),
    [dispatch],
  );
  const handleShowMissingChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => dispatch(setShowMissingShips(event.currentTarget.checked)),
    [dispatch],
  );

  return (
    <fieldset className={styles.visibilityOptions}>
      <legend className={styles.visuallyHidden}>{t("visibility")}</legend>
      <label className={styles.option}>
        <Checkbox checked={showHidden} name="showHidden" onChange={handleShowHiddenChange} />
        <span>{t("showHidden")}</span>
      </label>
      <label className={styles.option}>
        <Checkbox checked={showMissing} name="showMissing" onChange={handleShowMissingChange} />
        <span>{t("showMissing")}</span>
      </label>
    </fieldset>
  );
}
