import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Checkbox } from "@/shared/components/Checkbox/Checkbox";
import { TIER_LABELS, TIERS } from "@/shared/constants/tiers.constants";
import type { AppDispatch, RootState } from "@/store";
import { toggleCatalogTier } from "@/store/filters/filtersSlice";
import type { Tier } from "@/store/filters/filters.types";

import { FilterGroup } from "./FilterGroup";
import styles from "./TierFilterGroup.module.css";

export function TierFilterGroup() {
  const { t } = useTranslation("filters");
  const dispatch = useDispatch<AppDispatch>();
  const selectedTiers = useSelector((state: RootState) => state.filters.tiers);
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    dispatch(toggleCatalogTier(Number(event.currentTarget.value) as Tier));
  }

  return (
    <FilterGroup title={t("tiers")}>
      <div className={styles.tierOptions}>
        {TIERS.map((tier) => {
          const label = TIER_LABELS[tier];
          const inputId = `filter-tier-${tier}`;

          return (
            <label className={styles.tierOption} htmlFor={inputId} key={tier}>
              <Checkbox
                checked={selectedTiers[tier]}
                id={inputId}
                name="tier"
                onChange={handleChange}
                size="sm"
                value={tier}
              />
              <span>{label}</span>
            </label>
          );
        })}
      </div>
    </FilterGroup>
  );
}
