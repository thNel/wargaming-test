import cs from "./cs/main.json";
import de from "./de/main.json";
import en from "./en/main.json";
import es_mx from "./es_mx/main.json";
import es from "./es/main.json";
import fr from "./fr/main.json";
import it from "./it/main.json";
import ja from "./ja/main.json";
import ko from "./ko/main.json";
import nl from "./nl/main.json";
import pl from "./pl/main.json";
import pt_br from "./pt_br/main.json";
import ru from "./ru/main.json";
import th from "./th/main.json";
import tr from "./tr/main.json";
import uk from "./uk/main.json";
import zh_cn from "./zh_cn/main.json";
import zh_sg from "./zh_sg/main.json";
import zh_tw from "./zh_tw/main.json";

import type { SupportedLocale } from "@/shared/i18n/supportedLocales";

const mainDictionaries = {
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

export const MAIN_DICTIONARIES = Object.freeze(mainDictionaries);
