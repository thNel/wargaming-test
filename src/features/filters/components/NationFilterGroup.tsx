import { useCallback, type ChangeEventHandler } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { mediaApi } from "@/services/mediaApi";
import { nationsApi } from "@/services/nationsApi";
import { Checkbox } from "@/shared/components/Checkbox/Checkbox";
import { Image } from "@/shared/components/Image/Image";
import { normalizeLocale } from "@/shared/i18n/locale.utils";
import { getMediaUrl } from "@/shared/utils/getMediaUrl";
import type { AppDispatch, RootState } from "@/store";
import { toggleCatalogNation } from "@/store/filters/filtersSlice";
import type { NationKey } from "@/store/filters/filters.types";

import { NATION_KEYS } from "../filters.constants";
import { FilterGroupStatus } from "./FilterGroupStatus";
import styles from "./NationFilterGroup.module.css";

export function NationFilterGroup() {
  const { i18n, t } = useTranslation("filters");
  const dispatch = useDispatch<AppDispatch>();
  const selectedNations = useSelector((state: RootState) => state.filters.nations);
  const {
    data: nationsResponse,
    isFetching: isNationsLoading,
    isError: hasNationsError,
    refetch: refetchNations,
  } = nationsApi.useGetNationsQuery();
  const {
    data: mediaPathResponse,
    isFetching: isMediaLoading,
    isError: hasMediaError,
    refetch: refetchMediaPath,
  } = mediaApi.useGetMediaPathQuery();
  const locale = normalizeLocale(i18n.resolvedLanguage ?? i18n.language ?? "en");
  const isLoading = isNationsLoading || isMediaLoading;
  const hasError = hasNationsError || hasMediaError;
  const nationByKey = new Map((nationsResponse?.data ?? []).map((nation) => [nation.name, nation]));
  const options = NATION_KEYS.flatMap((key) => {
    const nation = nationByKey.get(key);
    const iconUrl = getMediaUrl(mediaPathResponse?.data, nation?.icons.tiny);

    return nation
      ? [
          {
            key,
            label: nation.localization.mark[locale] ?? nation.localization.mark.en ?? nation.name,
            iconUrl,
          },
        ]
      : [];
  });
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => dispatch(toggleCatalogNation(event.currentTarget.value as NationKey)),
    [dispatch],
  );
  const handleRetry = useCallback(() => {
    if (hasNationsError) {
      void refetchNations();
    }

    if (hasMediaError) {
      void refetchMediaPath();
    }
  }, [hasNationsError, refetchNations, hasMediaError, refetchMediaPath]);

  return (
    <fieldset aria-busy={isLoading || undefined} className={styles.group}>
      <legend className={styles.groupTitle}>{t("nations")}</legend>
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
              <span className={styles.tooltipAnchor} data-tooltip={label}>
                <Image
                  alt=""
                  className={styles.nationFlag}
                  fit="cover"
                  h={18}
                  loading="lazy"
                  src={iconUrl}
                  w={26}
                />
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
