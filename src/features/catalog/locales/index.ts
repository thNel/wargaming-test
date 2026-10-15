import cs from "./cs/catalog.json";
import de from "./de/catalog.json";
import en from "./en/catalog.json";
import es_mx from "./es_mx/catalog.json";
import es from "./es/catalog.json";
import fr from "./fr/catalog.json";
import it from "./it/catalog.json";
import ja from "./ja/catalog.json";
import ko from "./ko/catalog.json";
import nl from "./nl/catalog.json";
import pl from "./pl/catalog.json";
import pt_br from "./pt_br/catalog.json";
import ru from "./ru/catalog.json";
import th from "./th/catalog.json";
import tr from "./tr/catalog.json";
import uk from "./uk/catalog.json";
import zh_cn from "./zh_cn/catalog.json";
import zh_sg from "./zh_sg/catalog.json";
import zh_tw from "./zh_tw/catalog.json";

import type { SupportedLocale } from "@/shared/i18n/supportedLocales";

const catalogDictionaries = {
  cs,
  de,
  en,
  es,
  es_mx,
  fr,
  it,
  ja,
  ko,
  nl,
  pl,
  pt_br,
  ru,
  th,
  tr,
  uk,
  zh_cn,
  zh_sg,
  zh_tw,
} satisfies Record<SupportedLocale, Record<string, string>>;

export const CATALOG_DICTIONARIES = Object.freeze(catalogDictionaries);
