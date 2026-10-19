import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { mediaApi } from "@/services/mediaApi";
import { vehicleTypesApi } from "@/services/vehicleTypesApi";
import { Checkbox } from "@/shared/components/Checkbox/Checkbox";
import { Image } from "@/shared/components/Image/Image";
import { Tooltip } from "@/shared/components/Tooltip/Tooltip";
import { getMediaUrl } from "@/shared/utils/getMediaUrl";
import { VEHICLE_TYPE_KEYS } from "@/shared/constants/catalogFilters.constants";
import type { AppDispatch, RootState } from "@/store";
import { toggleCatalogClass } from "@/store/filters/filtersSlice";
import type { VehicleTypeKey } from "@/store/filters/filters.types";

import { VEHICLE_TYPE_TRANSLATION_KEYS } from "../filters.constants";
import { FilterGroup } from "./FilterGroup";
import { FilterGroupStatus } from "./FilterGroupStatus";
import styles from "./VehicleTypeFilterGroup.module.css";

interface VehicleTypeFilterGroupProps {
  idPrefix?: string;
  selectedVehicleTypes?: RootState["filters"]["classes"];
  onSelectionChange?: (key: VehicleTypeKey) => void;
}

export function VehicleTypeFilterGroup({
  idPrefix = "",
  onSelectionChange,
  selectedVehicleTypes: draftVehicleTypes,
}: VehicleTypeFilterGroupProps) {
  const { t } = useTranslation("filters");
  const dispatch = useDispatch<AppDispatch>();
  const appliedVehicleTypes = useSelector((state: RootState) => state.filters.classes);
  const selectedVehicleTypes = draftVehicleTypes ?? appliedVehicleTypes;
  const {
    data: vehicleTypesResponse,
    isInitialLoading: isVehicleTypesLoading,
    isError: hasVehicleTypesError,
    refetch: refetchVehicleTypes,
  } = vehicleTypesApi.useGetVehicleTypesQuery(undefined, {
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
  const isLoading = isVehicleTypesLoading || isMediaLoading;
  const hasError = hasVehicleTypesError || hasMediaError;
  const vehicleTypes = vehicleTypesResponse?.data;
  const options = VEHICLE_TYPE_KEYS.map((key) => {
    const vehicleType = vehicleTypes?.[key];
    const iconUrl = getMediaUrl(mediaPathResponse?.data, vehicleType?.icons.default);
    const label = t(VEHICLE_TYPE_TRANSLATION_KEYS[key]);

    return { key, label, iconUrl };
  });
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const key = event.currentTarget.value as VehicleTypeKey;

    if (onSelectionChange) {
      onSelectionChange(key);
      return;
    }

    dispatch(toggleCatalogClass(key));
  }

  function handleRetry(): void {
    if (hasVehicleTypesError) {
      void refetchVehicleTypes();
    }

    if (hasMediaError) {
      void refetchMediaPath();
    }
  }

  return (
    <FilterGroup ariaBusy={isLoading || undefined} title={t("classes")}>
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
          const inputId = `${idPrefix}filter-class-${key}`;

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
              <Tooltip focusWithinParent tooltip={label}>
                <Image
                  alt=""
                  className={styles.vehicleTypeIcon}
                  fit="contain"
                  h={28}
                  loading="lazy"
                  src={iconUrl}
                  w={28}
                />
              </Tooltip>
            </label>
          );
        })}
      </div>
    </FilterGroup>
  );
}
