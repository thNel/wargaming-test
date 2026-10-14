import { useTranslation } from "react-i18next";

export function CatalogPage() {
  const { t } = useTranslation();

  return (
    <main className="app">
      {/* eslint-disable-next-line a11yinspect/heading-element-error -- The text is translated at runtime. */}
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </main>
  );
}
