import cs from "./cs/filters.json";
import de from "./de/filters.json";
import en from "./en/filters.json";
import es_mx from "./es_mx/filters.json";
import es from "./es/filters.json";
import fr from "./fr/filters.json";
import it from "./it/filters.json";
import ja from "./ja/filters.json";
import ko from "./ko/filters.json";
import nl from "./nl/filters.json";
import pl from "./pl/filters.json";
import pt_br from "./pt_br/filters.json";
import ru from "./ru/filters.json";
import th from "./th/filters.json";
import tr from "./tr/filters.json";
import uk from "./uk/filters.json";
import zh_cn from "./zh_cn/filters.json";
import zh_sg from "./zh_sg/filters.json";
import zh_tw from "./zh_tw/filters.json";

import type { SupportedLocale } from "@/shared/i18n/supportedLocales";

const filterDictionaries = {
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
} satisfies Record<SupportedLocale, typeof en>;

export const FILTER_DICTIONARIES = Object.freeze(filterDictionaries);
