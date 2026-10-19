import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { mediaApi } from "@/services/mediaApi";
import { nationsApi } from "@/services/nationsApi";
import { Checkbox } from "@/shared/components/Checkbox/Checkbox";
import { Image } from "@/shared/components/Image/Image";
import { Tooltip } from "@/shared/components/Tooltip/Tooltip";
import { normalizeLocale } from "@/shared/i18n/locale.utils";
import { NATION_KEYS } from "@/shared/constants/catalogFilters.constants";
import { getMediaUrl } from "@/shared/utils/getMediaUrl";
import type { AppDispatch, RootState } from "@/store";
import { toggleCatalogNation } from "@/store/filters/filtersSlice";
import type { NationKey } from "@/store/filters/filters.types";

import { NATION_FALLBACK_LABELS } from "../filters.constants";
import { FilterGroup } from "./FilterGroup";
import { FilterGroupStatus } from "./FilterGroupStatus";
import styles from "./NationFilterGroup.module.css";

export function NationFilterGroup() {
  const { i18n, t } = useTranslation("filters");
  const dispatch = useDispatch<AppDispatch>();
  const selectedNations = useSelector((state: RootState) => state.filters.nations);
  const {
    data: nationsResponse,
    isInitialLoading: isNationsLoading,
    isError: hasNationsError,
    refetch: refetchNations,
  } = nationsApi.useGetNationsQuery(undefined, {
    selectFromResult: ({ data, isFetching, isError }) => ({
      data,
      isInitialLoading: isFetching && data === undefined,
      isError,
    }),
  });
  const {
    data: mediaPathResponse,
    isInitialLoading: isMediaLoading,
    isError: hasMediaError,
    refetch: refetchMediaPath,
  } = mediaApi.useGetMediaPathQuery(undefined, {
    selectFromResult: ({ data, isFetching, isError }) => ({
      data,
      isInitialLoading: isFetching && data === undefined,
      isError,
    }),
  });
  const isLoading = isNationsLoading || isMediaLoading;
  const hasError = hasNationsError || hasMediaError;
  const locale = normalizeLocale(i18n.resolvedLanguage ?? i18n.language ?? "en");
  const nationByKey = new Map((nationsResponse?.data ?? []).map((nation) => [nation.name, nation]));
  const options = NATION_KEYS.map((key) => {
    const nation = nationByKey.get(key);
    const iconUrl = getMediaUrl(mediaPathResponse?.data, nation?.icons.tiny);
    const label =
      nation?.localization.mark[locale] ??
      nation?.localization.mark.en ??
      NATION_FALLBACK_LABELS[key];

    return { key, label, iconUrl };
  });
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    dispatch(toggleCatalogNation(event.currentTarget.value as NationKey));
  }

  function handleRetry(): void {
    if (hasNationsError) {
      void refetchNations();
    }

    if (hasMediaError) {
      void refetchMediaPath();
    }
  }

  return (
    <FilterGroup ariaBusy={isLoading || undefined} title={t("nations")}>
      <FilterGroupStatus
        errorLabel={t("loadError")}
        hasError={hasError}
        isLoading={isLoading}
        loadingLabel={t("loading")}
        onRetry={handleRetry}
        retryLabel={t("retry")}
      />
      <div className={styles.nationOptions}>
        {options.map(({ key, label, iconUrl }) => {
          const inputId = `filter-nation-${key}`;

          return (
            <label className={styles.nationOption} htmlFor={inputId} key={key}>
              <Checkbox
                checked={selectedNations[key]}
                id={inputId}
                name="nation"
                onChange={handleChange}
                value={key}
              />
              <span className={styles.visuallyHidden}>{label}</span>
              <Tooltip focusWithinParent tooltip={label}>
                <Image
                  alt=""
                  className={styles.nationFlag}
                  fit="cover"
                  h={18}
                  loading="lazy"
                  src={iconUrl}
                  w={26}
                />
              </Tooltip>
            </label>
          );
        })}
      </div>
    </FilterGroup>
  );
}
