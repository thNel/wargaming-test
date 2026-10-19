import { useState } from "react";

import { GlassSurface } from "@/shared/components/GlassSurface/GlassSurface";
import { Image } from "@/shared/components/Image/Image";

import { LanguageButton } from "../language-button/LanguageButton";
import { LanguageDrawer } from "../language-drawer/LanguageDrawer";
import styles from "./Header.module.css";

export function Header() {
  const [isLanguageDrawerOpen, setIsLanguageDrawerOpen] = useState(false);
  function openLanguageDrawer(): void {
    setIsLanguageDrawerOpen(true);
  }

  function closeLanguageDrawer(): void {
    setIsLanguageDrawerOpen(false);
  }

  return (
    <>
      <GlassSurface as="header" className={styles.header} mode="dark">
        <div className={styles.inner}>
          <a className={styles.brand} href="/">
            <Image
              alt="World of Warships"
              className={styles.brandImage}
              fit="contain"
              h={32}
              w="100%"
              sources={[{ media: "(max-width: 399px)", srcSet: "/images/short-logo.png" }]}
              src="/images/logo-wows-2x.png"
            />
          </a>

          <LanguageButton expanded={isLanguageDrawerOpen} onClick={openLanguageDrawer} />
        </div>
      </GlassSurface>
      <LanguageDrawer
        id="language-drawer"
        open={isLanguageDrawerOpen}
        onClose={closeLanguageDrawer}
      />
    </>
  );
}
