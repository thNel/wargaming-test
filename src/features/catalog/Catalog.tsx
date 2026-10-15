import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Trans } from "react-i18next";

import type { AppDispatch } from "@/store";
import { loadCatalog } from "@/store/catalog/catalogThunks";

export function Catalog() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    void dispatch(loadCatalog());
  }, [dispatch]);

  return (
    <section aria-labelledby="catalog-heading">
      <h1 id="catalog-heading">
        <Trans ns="catalog" i18nKey="title">
          World of Warships ship catalog
        </Trans>
      </h1>
      <p>
        <Trans ns="catalog" i18nKey="description">
          The ship catalog is being prepared.
        </Trans>
      </p>
    </section>
  );
}
