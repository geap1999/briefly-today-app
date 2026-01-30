import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { changeLanguage, getCurrentLocale, i18n } from "../i18n";
import { useTimezone } from "./timezone-context";

type LocaleContextType = {
  locale: string;
  setLocale: (locale: string) => Promise<void>;
  t: (key: string, params?: Record<string, any>) => string;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = "@app_locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState(getCurrentLocale());
  const [isInitialized, setIsInitialized] = useState(false);
  const { isFrance, isLoading: isTimezoneLoading } = useTimezone();

  // Initialiser la langue au démarrage
  useEffect(() => {
    if (!isTimezoneLoading && !isInitialized) {
      initializeLocale();
    }
  }, [isTimezoneLoading, isInitialized, isFrance]);

  const initializeLocale = async () => {
    try {
      const savedLocale = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);

      if (savedLocale) {
        // Si une langue a déjà été sauvegardée, l'utiliser
        changeLanguage(savedLocale);
        setLocaleState(savedLocale);
      } else {
        // Sinon, détecter automatiquement selon la région
        const detectedLocale = isFrance ? "fr" : "en";
        changeLanguage(detectedLocale);
        setLocaleState(detectedLocale);
        // Sauvegarder la détection automatique
        await AsyncStorage.setItem(LOCALE_STORAGE_KEY, detectedLocale);
      }

      setIsInitialized(true);
    } catch (error) {
      console.error("Error initializing locale:", error);
      setIsInitialized(true);
    }
  };

  const setLocale = useCallback(async (newLocale: string) => {
    try {
      // Changer la langue dans i18n
      changeLanguage(newLocale);

      // Sauvegarder dans AsyncStorage
      await AsyncStorage.setItem(LOCALE_STORAGE_KEY, newLocale);

      // Mettre à jour l'état
      setLocaleState(newLocale);
    } catch (error) {
      console.error("Error setting locale:", error);
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, any>) => {
      return i18n.t(key, params);
    },
    [locale],
  ); // Re-créer quand locale change pour forcer le re-render

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
