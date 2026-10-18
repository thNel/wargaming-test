import { useCallback, type ChangeEventHandler } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { mediaApi } from "@/services/mediaApi";
import { vehicleTypesApi } from "@/services/vehicleTypesApi";
import { Checkbox } from "@/shared/components/Checkbox/Checkbox";
import { Image } from "@/shared/components/Image/Image";
import { normalizeLocale } from "@/shared/i18n/locale.utils";
import { getMediaUrl } from "@/shared/utils/getMediaUrl";
import type { AppDispatch, RootState } from "@/store";
import { toggleCatalogClass } from "@/store/filters/filtersSlice";
import type { VehicleTypeKey } from "@/store/filters/filters.types";

import { VEHICLE_TYPES, VEHICLE_TYPE_TRANSLATION_KEYS } from "../filters.constants";
import { FilterGroupStatus } from "./FilterGroupStatus";
import styles from "./VehicleTypeFilterGroup.module.css";

export function VehicleTypeFilterGroup() {
  const { i18n, t } = useTranslation("filters");
  const dispatch = useDispatch<AppDispatch>();
  const selectedVehicleTypes = useSelector((state: RootState) => state.filters.classes);
  const {
    data: vehicleTypesResponse,
    isFetching: isVehicleTypesLoading,
    isError: hasVehicleTypesError,
    refetch: refetchVehicleTypes,
  } = vehicleTypesApi.useGetVehicleTypesQuery();
  const {
    data: mediaPathResponse,
    isFetching: isMediaLoading,
    isError: hasMediaError,
    refetch: refetchMediaPath,
  } = mediaApi.useGetMediaPathQuery();
  const locale = normalizeLocale(i18n.resolvedLanguage ?? i18n.language ?? "en");
  const isLoading = isVehicleTypesLoading || isMediaLoading;
  const hasError = hasVehicleTypesError || hasMediaError;
  const vehicleTypes = vehicleTypesResponse?.data;
  const options = VEHICLE_TYPES.flatMap((key) => {
    const vehicleType = vehicleTypes?.[key];
    const iconUrl = getMediaUrl(mediaPathResponse?.data, vehicleType?.icons.default);
    const label =
      vehicleType?.localization.mark[locale] ??
      vehicleType?.localization.mark.en ??
      t(VEHICLE_TYPE_TRANSLATION_KEYS[key]);

    return vehicleType ? [{ key, label, iconUrl }] : [];
  });
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => dispatch(toggleCatalogClass(event.currentTarget.value as VehicleTypeKey)),
    [dispatch],
  );
  const handleRetry = useCallback(() => {
    if (hasVehicleTypesError) {
      void refetchVehicleTypes();
    }

    if (hasMediaError) {
      void refetchMediaPath();
    }
  }, [hasVehicleTypesError, refetchVehicleTypes, hasMediaError, refetchMediaPath]);

  return (
    <fieldset aria-busy={isLoading || undefined} className={styles.group}>
      <legend className={styles.groupTitle}>{t("classes")}</legend>
      <FilterGroupStatus
        errorLabel={t("loadError")}
        hasError={hasError}
        isLoading={isLoading}
        loadingLabel={t("loading")}
        onRetry={handleRetry}
        retryLabel={t("retry")}
      />
      <div className={styles.iconOptions}>
        {options.map(({ key, label, iconUrl }) => {
          const inputId = `filter-class-${key}`;

          return (
            <label className={styles.iconOption} htmlFor={inputId} key={key}>
              <Checkbox
                checked={selectedVehicleTypes[key]}
                id={inputId}
                name="class"
                onChange={handleChange}
                value={key}
              />
              <span className={styles.visuallyHidden}>{label}</span>
              <span className={styles.tooltipAnchor} data-tooltip={label}>
                <Image
                  alt=""
                  className={styles.vehicleTypeIcon}
                  fit="contain"
                  h={28}
                  loading="lazy"
                  src={iconUrl}
                  w={28}
                />
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
