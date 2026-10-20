import { useTranslation } from "react-i18next";

import { Drawer } from "@/shared/components/Drawer/Drawer";
import { Image } from "@/shared/components/Image/Image";
import type { SupportedLocale } from "@/shared/i18n/supportedLocales";
import type { CatalogVehicle } from "@/store/catalog/catalog.types";

import styles from "./VehicleDetailsDrawer.module.css";

interface VehicleDetailsDrawerProps {
  locale: SupportedLocale;
  onClose: () => void;
  vehicle: CatalogVehicle | null;
}

type VehicleStatus = "premium" | "special" | "researchable";

function getVehicleStatus(vehicle: CatalogVehicle): VehicleStatus {
  if (vehicle.card.classTooltipKey === "premiumVehicleClass" || vehicle.tags.includes("premium")) {
    return "premium";
  }

  if (
    vehicle.card.classTooltipKey === "specialVehicleClass" ||
    vehicle.card.classTooltipKey === "specialSubmarineClass" ||
    vehicle.tags.includes("special") ||
    vehicle.tags.includes("specialUnsellable")
  ) {
    return "special";
  }

  return "researchable";
}

export function VehicleDetailsDrawer({ locale, onClose, vehicle }: VehicleDetailsDrawerProps) {
  const { t } = useTranslation("catalog");

  if (!vehicle) {
    return null;
  }

  const name = vehicle.card.nameByLocale[locale];
  const nationName = vehicle.nation?.locales[locale] ?? vehicle.nation?.name;
  const nationFlag = vehicle.nation?.icons.tiny;
  const className = vehicle.class?.locales.name[locale] ?? vehicle.class?.key;
  const description = vehicle.locales.description[locale] ?? vehicle.locales.description.en;
  const status = getVehicleStatus(vehicle);
  const artwork = vehicle.icons.large ?? vehicle.card.artwork.src;
  const artworkSrcSet =
    vehicle.icons.medium && vehicle.icons.large
      ? `${vehicle.icons.medium} 435w, ${vehicle.icons.large} 870w`
      : undefined;
  return (
    <Drawer
      closeLabel={t("closeShipDetails")}
      onClose={onClose}
      open
      size="wide"
      tone="ocean"
      title={name}
      titleClassName={styles.drawerTitle}
    >
      <div className={styles.details}>
        <div aria-hidden="true" className={styles.hero}>
          <div className={styles.sky} />
          <div className={styles.sea} />
          {artwork && (
            <div className={styles.shipMotion}>
              <Image
                alt=""
                className={styles.shipImage}
                fit="contain"
                h="100%"
                loading="eager"
                sizes="(max-width: 700px) 100vw, 36rem"
                src={artwork}
                srcSet={artworkSrcSet}
                w="100%"
              />
            </div>
          )}
          <div className={styles.seaFront} />
        </div>

        <dl className={styles.facts}>
          {nationName && (
            <div className={styles.fact}>
              <dt>{t("shipDetailsNation")}</dt>
              <dd className={styles.nationValue}>
                <span>{nationName}</span>
                {nationFlag && (
                  <Image
                    alt=""
                    className={styles.nationFlag}
                    h={18}
                    loading="lazy"
                    src={nationFlag}
                    w={26}
                  />
                )}
              </dd>
            </div>
          )}
          {className && (
            <div className={styles.fact}>
              <dt>{t("shipDetailsClass")}</dt>
              <dd>{className}</dd>
            </div>
          )}
          <div className={styles.fact}>
            <dt>{t("shipDetailsTier")}</dt>
            <dd>{vehicle.card.tierLabel}</dd>
          </div>
          <div className={styles.fact}>
            <dt>{t("shipDetailsStatus")}</dt>
            <dd>{t(`shipStatus${status[0].toUpperCase()}${status.slice(1)}`)}</dd>
          </div>
        </dl>

        {description && (
          <section className={styles.description}>
            <h3>{t("shipDescriptionHeading")}</h3>
            <p>{description}</p>
          </section>
        )}
      </div>
    </Drawer>
  );
}
