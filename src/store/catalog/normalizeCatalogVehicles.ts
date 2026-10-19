import { getMediaUrl } from "@/shared/utils/getMediaUrl";
import { TIER_LABELS, type Tier } from "@/shared/constants/tiers.constants";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/shared/i18n/supportedLocales";

import type {
  CatalogNation,
  CatalogVehicleCard,
  CatalogVehicleCardImage,
  CatalogVehicleClassTooltipKey,
  CatalogVehicleCollection,
  CatalogVehicleType,
} from "./catalog.types";
import type { CatalogVehicleSources } from "./normalizeCatalogVehicles.types";

const RESPONSIVE_IMAGE_SIZES = "auto, (max-width: 700px) 50vw, 25vw";

function buildIconUrls(icons: Record<string, string>, mediaPath: string): Record<string, string> {
  return Object.fromEntries(
    Object.entries(icons)
      .filter(([key, path]) => !key.startsWith("local_") && !path.startsWith("gui/"))
      .map(([key, path]) => [key, getMediaUrl(mediaPath, path)]),
  );
}

function createCatalogNation(
  nation: CatalogVehicleSources["nations"][number],
  mediaPath: string,
): CatalogNation {
  const { icons, localization, ...nationData } = nation;

  return Object.freeze({
    ...nationData,
    locales: localization.mark,
    icons: Object.freeze(buildIconUrls(icons, mediaPath)),
  });
}

function createCatalogVehicleType(
  key: string,
  vehicleType: CatalogVehicleSources["vehicleTypes"][string],
  mediaPath: string,
): CatalogVehicleType {
  const { icons, localization, ...vehicleTypeData } = vehicleType;

  return Object.freeze({
    ...vehicleTypeData,
    key,
    locales: Object.freeze({
      name: localization.mark,
      shortName: localization.shortmark,
    }),
    icons: Object.freeze(buildIconUrls(icons, mediaPath)),
  });
}

function createLocalizedValues(
  values: Readonly<Record<string, string | undefined>>,
  fallback: string,
): Readonly<Record<SupportedLocale, string>> {
  return Object.freeze(
    Object.fromEntries(
      SUPPORTED_LOCALES.map((locale) => [locale, values[locale] ?? fallback]),
    ) as Record<SupportedLocale, string>,
  );
}

function createCardImage(
  src: string | undefined,
  srcSet: string | undefined,
): CatalogVehicleCardImage {
  return Object.freeze({
    src,
    srcSet,
    sizes: srcSet ? RESPONSIVE_IMAGE_SIZES : undefined,
  });
}

function getClassTooltipKey(
  tags: readonly string[],
  vehicleType: CatalogVehicleType | null,
): CatalogVehicleClassTooltipKey | undefined {
  if (!vehicleType) {
    return undefined;
  }

  if (tags.includes("uiPremium")) {
    return "premiumVehicleClass";
  }

  if (tags.includes("uiSpecial")) {
    return vehicleType.key === "Submarine" ? "specialSubmarineClass" : "specialVehicleClass";
  }

  return "vehicleClass";
}

function createCatalogVehicleCard(
  name: string,
  level: number,
  tags: readonly string[],
  locales: CatalogVehicleSources["vehicles"][string]["localization"]["mark"],
  icons: Readonly<Record<string, string>>,
  nation: CatalogNation | null,
  vehicleType: CatalogVehicleType | null,
): CatalogVehicleCard {
  const hasPremiumAppearance = tags.includes("uiPremium") || tags.includes("uiSpecial");
  const artworkSrcSet =
    icons.medium && icons.large ? `${icons.medium} 435w, ${icons.large} 870w` : undefined;
  const smallNationBackdropUrl = nation?.icons.small ?? nation?.icons.default;
  const largeNationBackdropUrl = nation?.icons.large ?? nation?.icons.default;
  const nationBackdropUrl = largeNationBackdropUrl ?? smallNationBackdropUrl;
  const nationBackdropSrcSet =
    smallNationBackdropUrl &&
    largeNationBackdropUrl &&
    smallNationBackdropUrl !== largeNationBackdropUrl
      ? `${smallNationBackdropUrl} 117w, ${largeNationBackdropUrl} 694w`
      : undefined;
  const classIconVariant = tags.includes("uiPremium")
    ? "premium"
    : tags.includes("uiSpecial")
      ? "special"
      : "normal";

  return Object.freeze({
    nameByLocale: createLocalizedValues(locales, name),
    tierLabel: TIER_LABELS[level as Tier] ?? level,
    artwork: createCardImage(icons.medium ?? icons.large ?? icons.default, artworkSrcSet),
    nationBackdrop: nationBackdropUrl
      ? createCardImage(nationBackdropUrl, nationBackdropSrcSet)
      : undefined,
    classIconUrl: vehicleType
      ? (vehicleType.icons[classIconVariant] ??
        vehicleType.icons.normal ??
        vehicleType.icons.default)
      : undefined,
    classTitleByLocale: vehicleType
      ? createLocalizedValues(vehicleType.locales.name, vehicleType.key)
      : undefined,
    classTooltipKey: getClassTooltipKey(tags, vehicleType),
    hasPremiumAppearance,
  });
}

export function normalizeCatalogVehicles({
  vehicles,
  nations,
  vehicleTypes,
  mediaPath,
}: CatalogVehicleSources): CatalogVehicleCollection {
  const nationsByName = new Map(
    nations.map((nation) => [nation.name, createCatalogNation(nation, mediaPath)]),
  );
  const vehicleTypesByKey = new Map(
    Object.entries(vehicleTypes).map(([key, vehicleType]) => [
      key,
      createCatalogVehicleType(key, vehicleType, mediaPath),
    ]),
  );

  return Object.freeze(
    Object.entries(vehicles).map(([id, vehicle]) => {
      const { icons, localization, nation: nationKey, tags, ...vehicleData } = vehicle;
      const vehicleTypeKey = tags[0];
      const vehicleType = vehicleTypeKey ? (vehicleTypesByKey.get(vehicleTypeKey) ?? null) : null;
      const normalizedTags = Object.freeze(vehicleType ? tags.slice(1) : [...tags]);
      const locales = Object.freeze({
        name: localization.mark,
        shortName: localization.shortmark,
        description: localization.description,
      });
      const normalizedNation = nationsByName.get(nationKey) ?? null;
      const normalizedIcons = Object.freeze(buildIconUrls(icons, mediaPath));
      const card = createCatalogVehicleCard(
        vehicleData.name,
        vehicleData.level,
        normalizedTags,
        localization.mark,
        normalizedIcons,
        normalizedNation,
        vehicleType,
      );

      return Object.freeze({
        ...vehicleData,
        id,
        tags: normalizedTags,
        locales,
        nation: normalizedNation,
        class: vehicleType,
        icons: normalizedIcons,
        card,
      });
    }),
  );
}
