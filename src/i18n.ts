import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import faTranslation from "./locales/fa";
import enTranslation from "./locales/en";
import arTranslation from "./locales/ar";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fa: { translation: faTranslation },
      en: { translation: enTranslation },
      ar: { translation: arTranslation }
    },
    lng: "fa", // default language
    fallbackLng: "fa",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
