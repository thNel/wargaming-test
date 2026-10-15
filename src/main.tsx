import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";

import { store } from "./store";
import { Main } from "./pages/main/Main";
import { i18nInstance } from "./shared/i18n";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18nInstance}>
        <Main />
      </I18nextProvider>
    </Provider>
  </StrictMode>,
);
