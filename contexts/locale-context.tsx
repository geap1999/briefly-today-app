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

  useEffect(() => {
    if (!isTimezoneLoading && !isInitialized) {
      initializeLocale();
    }
  }, [isTimezoneLoading, isInitialized, isFrance]);

  const initializeLocale = async () => {
    try {
      const savedLocale = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);

      if (savedLocale) {
        changeLanguage(savedLocale);
        setLocaleState(savedLocale);
      } else {
        const detectedLocale = isFrance ? "fr" : "en";
        changeLanguage(detectedLocale);
        setLocaleState(detectedLocale);
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
      changeLanguage(newLocale);
      await AsyncStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
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
  );

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
