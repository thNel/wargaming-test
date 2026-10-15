# Vortex Encyclopedia API

This document describes the response structures observed in the Vortex Encyclopedia API endpoints supplied with the World of Warships home task. It is an observed contract, not a guarantee that the service will keep the same schema or dataset.

- **Observed on:** 2026-10-14
- **Locale in endpoint paths:** `en`
  **Common response envelope:** `{ "status": "ok", "data": ... }`

The endpoint path contains a locale, but the observed `localization` objects contain translations for multiple locales. The examples below show only selected values.

## Endpoints

| Endpoint                                                                                               | `data` type                   | Purpose                                       |
| ------------------------------------------------------------------------------------------------------ | ----------------------------- | --------------------------------------------- |
| [`vehicles/`](https://vortex.worldofwarships.eu/api/encyclopedia/en/vehicles/)                         | Object keyed by vehicle ID    | Ship records used to build the catalog        |
| [`nations/`](https://vortex.worldofwarships.eu/api/encyclopedia/en/nations/)                           | Array                         | Nation labels, flags, colors, and IDs         |
| [`vehicle_types_common/`](https://vortex.worldofwarships.eu/api/encyclopedia/en/vehicle_types_common/) | Object keyed by vehicle class | Class labels, icons, and display order        |
| [`media_path/`](https://vortex.worldofwarships.eu/api/encyclopedia/en/media_path/)                     | String                        | Base URL for standard encyclopedia icon paths |

All four endpoints returned HTTP 200 and `status: "ok"` during the observation. The response sizes and counts in this document are snapshots and can change as the game catalog changes.

## `vehicles/`

The `data` value is an object map. Each property name is a vehicle ID; its value is one vehicle record. The observed response contained 1,059 records and was approximately 20.1 MB as JSON.

```json
{
  "status": "ok",
  "data": {
    "3765319664": {
      "level": 5,
      "name": "PASD505_Hill",
      "icons": {
        "medium": "vehicle/medium/PASD505_<hash>.png",
        "small": "vehicle/small/PASD505_<hash>.png",
        "large": "vehicle/large/PASD505_<hash>.png"
      },
      "tags": ["Destroyer", "special", "uiPremium", "canRent", "sellable"],
      "localization": {
        "mark": { "en": "Hill", "ru": "Hill" },
        "shortmark": { "en": "Hill", "ru": "Hill" },
        "description": { "en": "...", "ru": "..." }
      },
      "nation": "usa"
    }
  }
}
```

### Vehicle fields

| Field          | Observed type            | Meaning and catalog use                                                                                                                                                                                                                                                                                |
| -------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Map key        | String                   | Vehicle ID. Use this as the stable key when turning the map into a list.                                                                                                                                                                                                                               |
| `level`        | Number                   | Ship tier. Values from 1 through 11 were present in the observed data.                                                                                                                                                                                                                                 |
| `name`         | String                   | Internal vehicle name, e.g. `PASD505_Hill`; it is not the localized display label.                                                                                                                                                                                                                     |
| `nation`       | String                   | Nation code, e.g. `usa`, `japan`, or `ussr`. Matches `nations[].name`.                                                                                                                                                                                                                                 |
| `tags`         | String array             | Mixed classification and game metadata. The five observed class tags are `AirCarrier`, `Battleship`, `Cruiser`, `Destroyer`, and `Submarine`. Other examples include `premium`, `special`, `specialUnsellable`, `uiPremium`, `sellable`, `canRent`, `catalogueHidden`, and `catalogueHiddenIfMissing`. |
| `localization` | Object                   | Localized `mark`, `shortmark`, and `description` maps. The observed response contained 19 language codes.                                                                                                                                                                                              |
| `icons`        | Object of relative paths | Standard and local game icon paths; see [Vehicle icons](#vehicle-icons).                                                                                                                                                                                                                               |

Observed localization codes: `cs`, `de`, `en`, `es`, `es_mx`, `fr`, `it`, `ja`, `ko`, `nl`, `pl`, `pt_br`, `ru`, `th`, `tr`, `uk`, `zh_cn`, `zh_sg`, and `zh_tw`.

Use `localization.mark[locale]` for the main ship name. `localization.shortmark[locale]` is available for compact labels, and `localization.description[locale]` contains the ship description. A UI should handle a missing translation by falling back to another available locale or to `name`.

### Vehicle icons

The observed `icons` object can contain these keys:

`small`, `medium`, `large`, `default`, `contour`, `contour_alive`, `contour_dead`, `local_small`, `local_contour`, `local_contour_alive`, and `local_contour_dead`.

The standard paths such as `vehicle/medium/...png` are relative to the `media_path` base URL. Paths beginning with `local_` use a different path family, such as `gui/ship_previews/...png`; do not assume they resolve against the same base URL.

## `nations/`

The `data` value is an array of 13 nation objects in the observed response.

```json
{
  "status": "ok",
  "data": [
    {
      "name": "ussr",
      "icons": {
        "small": "nation_flags/small/flag_Russia_<hash>.png",
        "large": "nation_flags/large/flag_Russia_<hash>.png",
        "tiny": "nation_flags/tiny/flag_Russia_<hash>.png"
      },
      "color": 14764062,
      "tags": ["inTree"],
      "localization": {
        "mark": { "en": "U.S.S.R.", "ru": "СССР" }
      },
      "id": 0
    }
  ]
}
```

| Field               | Observed type            | Meaning and catalog use                                                                                                   |
| ------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `name`              | String                   | Nation code. Join this to a vehicle's `nation` field.                                                                     |
| `id`                | Number                   | Numeric nation identifier.                                                                                                |
| `localization.mark` | Object of strings        | Localized nation display name.                                                                                            |
| `icons`             | Object of relative paths | Nation flag variants. Observed keys: `small`, `large`, `tiny`, `default`, `local_small`, `local_large`, and `local_tiny`. |
| `color`             | Number                   | Nation color value. Its intended color encoding should be confirmed before using it as CSS.                               |
| `tags`              | String array             | Nation metadata; `inTree` was observed.                                                                                   |

Examples of `name` to English label mappings include `usa` → `U.S.A.`, `ussr` → `U.S.S.R.`, and `netherlands` → `The Netherlands`.

## `vehicle_types_common/`

The `data` value is an object keyed by the class tag used in vehicle `tags`. Five class records were observed.

```json
{
  "status": "ok",
  "data": {
    "Cruiser": {
      "icons": {
        "default": "vehicle/types/Cruiser/standard_<hash>.png",
        "elite": "vehicle/types/Cruiser/elite_<hash>.png",
        "premium": "vehicle/types/Cruiser/premium_<hash>.png",
        "special": "vehicle/types/Cruiser/special_<hash>.png",
        "normal": "vehicle/types/Cruiser/standard_<hash>.png"
      },
      "sort_order": 3,
      "localization": {
        "mark": { "en": "Cruiser", "ru": "Крейсер" },
        "shortmark": {}
      }
    }
  }
}
```

| Field                    | Observed type            | Meaning and catalog use                                                      |
| ------------------------ | ------------------------ | ---------------------------------------------------------------------------- |
| Map key                  | String                   | Class tag to match against a vehicle's `tags`.                               |
| `sort_order`             | Number                   | Display order supplied by the API.                                           |
| `localization.mark`      | Object of strings        | Localized class label.                                                       |
| `localization.shortmark` | Object                   | Present in the observed payload; it was empty in the observed class records. |
| `icons`                  | Object of relative paths | Class icon variants: `default`, `normal`, `elite`, `premium`, and `special`. |

Observed class keys and order: `Submarine` (1), `Destroyer` (2), `Cruiser` (3), `Battleship` (4), and `AirCarrier` (5). The English label for `AirCarrier` is `Aircraft Carrier`.

## `media_path/`

The `data` value is a string, not an object:

```json
{
  "status": "ok",
  "data": "https://wows-gloss-icons.wgcdn.co/icons/"
}
```

To build a standard icon URL, combine this base with a relative path from an icon record. For example:

```text
https://wows-gloss-icons.wgcdn.co/icons/vehicle/medium/<image>.png
```

Standard vehicle, nation, and class icon paths were checked against this base and returned PNG images during the observation. Keep URL construction centralized so that icon paths and base URL are not duplicated throughout UI components.

## Relationships and normalization

For a catalog view, the response data can be normalized as follows:

1. Convert each property in `vehicles.data` into a vehicle record and retain the property name as its ID.
2. Resolve `vehicle.nation` against the nation record whose `name` matches it.
3. Resolve a vehicle class by finding one known class key in `vehicle.tags` and looking it up in `vehicle_types_common.data`.
4. Use the selected locale from `localization.mark` for the ship label and from each reference record's localization for filter labels.
5. Build standard image URLs from `media_path.data` and the chosen relative icon path.

Do not treat every vehicle tag as a class. Tags mix ship classes with availability, progression, special-event, and catalog-visibility flags. The supplied API responses do not define which tags should be hidden from the home-task catalog, so any visibility rule needs an explicit product decision.

## Integration notes

- In local development, requests go to the same-origin `/api/` path and Vite forwards them to the Vortex encyclopedia API. `npm run dev:mock` uses local fixture files instead and does not use the proxy.
- The supplied `vehicles/` endpoint returns the whole observed dataset; no pagination metadata was present in its response.
- The live vehicle tags observed on 2026-10-15 distinguish `premium` from `special` and `specialUnsellable`. `uiPremium` overlaps those groups, so it is not sufficient to classify a ship by itself.
- The observed vehicle JSON was approximately 20.1 MB. Virtual scrolling reduces rendered DOM nodes, but does not reduce the downloaded response size.
- The response contains encyclopedia fields and icon paths, not detailed combat statistics such as damage or armor.
- Check both the HTTP response and the JSON `status` field. Provide a visible loading, error, retry, and empty-results state in the client.
- Treat counts and enumerated values above as observations, not fixed constants. The API dataset may change.
