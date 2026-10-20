import cn from "classnames";
import { useTranslation } from "react-i18next";

import { Image } from "@/shared/components/Image/Image";
import { Tooltip } from "@/shared/components/Tooltip/Tooltip";

import type { VehicleCardProps } from "./VehicleCard.types";
import styles from "./VehicleCard.module.css";

export function VehicleCard({ locale, measureRef, onSelect, vehicle }: VehicleCardProps) {
  const { t } = useTranslation("catalog");
  const { card } = vehicle;
  const name = card.nameByLocale[locale];
  const classTitle = card.classTitleByLocale?.[locale];
  const classTooltip =
    card.classTooltipKey && classTitle
      ? t(card.classTooltipKey, { className: classTitle })
      : undefined;
  const { artwork, nationBackdrop } = card;
  function handleSelect(): void {
    onSelect?.(vehicle);
  }

  return (
    <li className={styles.item} ref={measureRef}>
      <article className={styles.card}>
        <button
          aria-labelledby={`vehicle-title-${vehicle.id}`}
          className={styles.cardButton}
          onClick={handleSelect}
          type="button"
        >
          <div className={styles.artwork}>
            {nationBackdrop?.src && (
              <Image
                alt=""
                className={styles.nationBackdrop}
                fit="contain"
                loading="lazy"
                sizes={nationBackdrop.sizes}
                srcSet={nationBackdrop.srcSet}
                src={nationBackdrop.src}
              />
            )}
            <Image
              alt={name}
              className={styles.artImage}
              fit="contain"
              h="100%"
              loading="lazy"
              sizes={artwork.sizes}
              src={artwork.src}
              srcSet={artwork.srcSet}
              w="100%"
            />
            <div className={styles.vehicleHeading}>
              <span>{card.tierLabel}</span>
              {card.classIconUrl && classTooltip && (
                <Tooltip accessibleName={classTooltip} focusable={false} tooltip={classTooltip}>
                  <Image
                    alt=""
                    className={styles.classIcon}
                    fit="contain"
                    h={22}
                    loading="lazy"
                    src={card.classIconUrl}
                    w={22}
                  />
                </Tooltip>
              )}
              <h2
                className={cn(styles.name, {
                  [styles.namePremium]: card.hasPremiumAppearance,
                })}
                id={`vehicle-title-${vehicle.id}`}
              >
                {name}
              </h2>
            </div>
          </div>
        </button>
      </article>
    </li>
  );
}
