import classNames from "classnames";
import { useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Image } from "@/shared/components/Image/Image";
import { Tooltip } from "@/shared/components/Tooltip/Tooltip";
import { TIER_LABELS, type Tier } from "@/shared/constants/tiers.constants";
import { getCatalogVehicleName } from "@/store/catalog/getCatalogVehicleName";

import { getCatalogVehicleClassIconUrl } from "../getCatalogVehicleClassIconUrl";
import type { VehicleCardProps } from "./VehicleCard.types";
import styles from "./VehicleCard.module.css";

function getLocalizedValue(values: Readonly<Record<string, string | undefined>>, locale: string) {
  return values[locale] ?? values.en;
}

export function VehicleCard({ locale, vehicle }: VehicleCardProps) {
  const { t } = useTranslation("catalog");
  const name = getCatalogVehicleName(vehicle, locale);
  const shortName = getLocalizedValue(vehicle.locales.shortName, locale);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const nameMeasureRef = useRef<HTMLSpanElement>(null);
  const [useShortName, setUseShortName] = useState(false);
  const artworkUrl = vehicle.icons.large ?? vehicle.icons.medium ?? vehicle.icons.default;
  const nationBackdropUrl =
    vehicle.nation?.icons.large ?? vehicle.nation?.icons.small ?? vehicle.nation?.icons.default;
  const classIconUrl = getCatalogVehicleClassIconUrl(vehicle);
  const hasPremiumAppearance =
    vehicle.tags.includes("uiPremium") || vehicle.tags.includes("uiSpecial");
  const className = vehicle.class
    ? (getLocalizedValue(vehicle.class.locales.name, locale) ?? vehicle.class.key)
    : undefined;
  const classTooltip = className
    ? t(
        vehicle.tags.includes("uiPremium")
          ? "premiumVehicleClass"
          : vehicle.tags.includes("uiSpecial")
            ? vehicle.class?.key === "Submarine"
              ? "specialSubmarineClass"
              : "specialVehicleClass"
            : "vehicleClass",
        { className },
      )
    : undefined;

  useLayoutEffect(() => {
    const nameElement = nameRef.current;
    const measureElement = nameMeasureRef.current;

    if (!nameElement || !measureElement || !shortName) {
      setUseShortName(false);
      return;
    }

    const updateName = () => {
      setUseShortName(measureElement.getBoundingClientRect().width > nameElement.clientWidth);
    };

    updateName();
    const observer = new ResizeObserver(updateName);
    observer.observe(nameElement);
    observer.observe(measureElement);

    return () => observer.disconnect();
  }, [name, shortName]);

  return (
    <li className={styles.item}>
      <article aria-labelledby={`vehicle-title-${vehicle.id}`} className={styles.card}>
        <div className={styles.artwork}>
          {nationBackdropUrl && (
            <Image
              alt=""
              className={styles.nationBackdrop}
              fit="contain"
              loading="lazy"
              src={nationBackdropUrl}
            />
          )}
          <Image
            alt={name}
            className={styles.artImage}
            fit="contain"
            h="100%"
            loading="lazy"
            src={artworkUrl}
            w="100%"
          />
          <div className={styles.vehicleHeading}>
            <span>{TIER_LABELS[vehicle.level as Tier] ?? vehicle.level}</span>
            {classIconUrl && classTooltip && (
              <Tooltip accessibleName={classTooltip} tooltip={classTooltip}>
                <Image
                  alt=""
                  className={styles.classIcon}
                  fit="contain"
                  h={22}
                  loading="lazy"
                  src={classIconUrl}
                  w={22}
                />
              </Tooltip>
            )}
            <h2
              ref={nameRef}
              className={classNames(styles.name, hasPremiumAppearance && styles.namePremium)}
              id={`vehicle-title-${vehicle.id}`}
            >
              <span aria-hidden="true" className={styles.nameMeasure} ref={nameMeasureRef}>
                {name}
              </span>
              {useShortName ? shortName : name}
            </h2>
          </div>
        </div>
      </article>
    </li>
  );
}
