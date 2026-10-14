import { I18nextProvider } from "react-i18next";

import { I18N } from "@/shared/i18n/i18n";
import { CatalogPage } from "./CatalogPage";

export function CatalogFeature() {
  return (
    <I18nextProvider i18n={I18N} defaultNS="catalog">
      <CatalogPage />
    </I18nextProvider>
  );
}
