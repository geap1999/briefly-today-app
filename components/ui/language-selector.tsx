import { useLocale } from "@/contexts/locale-context";
import { getAvailableLocales } from "@/i18n";
import { getFontSize } from "@/utils/responsive";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface LanguageSelectorProps {
  isDarkMode?: boolean;
}

export default function LanguageSelector({
  isDarkMode = false,
}: LanguageSelectorProps) {
  const { locale, setLocale, t } = useLocale();
  const availableLocales = getAvailableLocales();

  const languageNames: Record<string, string> = {
    en: "English",
    fr: "Français",
  };

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <Text
          className="font-semibold"
          style={{
            fontSize: getFontSize(16),
            color: isDarkMode ? "#E2E8F0" : "#334155",
          }}
        >
          {t("language")}
        </Text>
      </View>
      <View className="flex-row gap-2">
        {availableLocales.map((lang) => (
          <TouchableOpacity
            key={lang}
            onPress={() => setLocale(lang)}
            activeOpacity={0.7}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor:
                locale === lang
                  ? isDarkMode
                    ? "#3B82F6"
                    : "#3B82F6"
                  : isDarkMode
                    ? "rgba(51, 65, 85, 0.5)"
                    : "#E2E8F0",
            }}
          >
            <Text
              className="font-semibold"
              style={{
                fontSize: getFontSize(14),
                color:
                  locale === lang
                    ? "#FFFFFF"
                    : isDarkMode
                      ? "#94A3B8"
                      : "#64748B",
              }}
            >
              {languageNames[lang]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
