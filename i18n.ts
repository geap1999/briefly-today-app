import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

export const i18n = new I18n({
  en,
  fr,
});

i18n.locale = Localization.getLocales()[0]?.languageCode ?? "en";

i18n.enableFallback = true;
i18n.defaultLocale = "en";

export const t = (key: string, params?: Record<string, any>) => {
  return i18n.t(key, params);
};

export const changeLanguage = (locale: string) => {
  i18n.locale = locale;
};

export const getCurrentLocale = () => {
  return i18n.locale;
};

export const getAvailableLocales = () => {
  return ["en", "fr"];
};
