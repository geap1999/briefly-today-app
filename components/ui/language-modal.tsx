import { useLocale } from "@/contexts/locale-context";
import { getFontSize, useResponsive } from "@/utils/responsive";
import * as Haptics from "expo-haptics";
import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

export default function LanguageModal({
  visible,
  onClose,
  isDarkMode = false,
}: LanguageModalProps) {
  const { locale, setLocale, t } = useLocale();
  const { isTablet } = useResponsive();

  const handleLanguageSelect = async (lang: string) => {
    if (lang !== locale) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await setLocale(lang);
    }
    handleClose();
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const languages = [
    {
      code: "fr",
      name: "Français",
      flag: "🇫🇷",
      description: "Langue française",
    },
    {
      code: "en",
      name: "English",
      flag: "🇺🇸",
      description: "English language",
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
        onPress={handleClose}
      >
        <Pressable
          style={{
            width: "100%",
            maxWidth: isTablet ? 420 : 340,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View
            style={{
              backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
              borderRadius: isTablet ? 32 : 24,
              padding: isTablet ? 28 : 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            {/* Header */}
            <View className="items-center mb-6">
              <View
                style={{
                  width: isTablet ? 72 : 60,
                  height: isTablet ? 72 : 60,
                  borderRadius: 9999,
                  backgroundColor: isDarkMode
                    ? "rgba(59, 130, 246, 0.2)"
                    : "rgba(59, 130, 246, 0.1)",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: isTablet ? 16 : 12,
                }}
              >
                <Text style={{ fontSize: isTablet ? 36 : 32 }}>🌍</Text>
              </View>
              <Text
                className="font-black text-center"
                style={{
                  fontSize: getFontSize(24),
                  color: isDarkMode ? "#F1F5F9" : "#1E293B",
                  letterSpacing: -0.5,
                }}
              >
                {t("language")}
              </Text>
              <Text
                className="text-center mt-2"
                style={{
                  fontSize: getFontSize(14),
                  color: isDarkMode ? "#94A3B8" : "#64748B",
                }}
              >
                {locale === "fr"
                  ? "Choisissez votre langue préférée"
                  : "Choose your preferred language"}
              </Text>
            </View>

            {/* Language Options */}
            <View className="gap-3 mb-4">
              {languages.map((lang) => {
                const isSelected = locale === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    onPress={() => handleLanguageSelect(lang.code)}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: isTablet ? 18 : 16,
                      borderRadius: isTablet ? 18 : 16,
                      backgroundColor: isSelected
                        ? "#3B82F6"
                        : isDarkMode
                          ? "rgba(51, 65, 85, 0.5)"
                          : "#F1F5F9",
                      borderWidth: 2,
                      borderColor: isSelected ? "#3B82F6" : "transparent",
                    }}
                  >
                    <View className="flex-row items-center gap-4">
                      <Text
                        style={{
                          fontSize: isTablet ? 40 : 36,
                        }}
                      >
                        {lang.flag}
                      </Text>
                      <View>
                        <Text
                          className="font-bold"
                          style={{
                            fontSize: getFontSize(18),
                            color: isSelected
                              ? "#FFFFFF"
                              : isDarkMode
                                ? "#F1F5F9"
                                : "#1E293B",
                          }}
                        >
                          {lang.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: getFontSize(13),
                            color: isSelected
                              ? "rgba(255, 255, 255, 0.8)"
                              : isDarkMode
                                ? "#94A3B8"
                                : "#64748B",
                            marginTop: 2,
                          }}
                        >
                          {lang.description}
                        </Text>
                      </View>
                    </View>
                    {isSelected && (
                      <View
                        style={{
                          width: isTablet ? 28 : 24,
                          height: isTablet ? 28 : 24,
                          borderRadius: 9999,
                          backgroundColor: "#FFFFFF",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontSize: isTablet ? 16 : 14 }}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Close Button */}
            <TouchableOpacity
              onPress={handleClose}
              activeOpacity={0.8}
              style={{
                backgroundColor: isDarkMode
                  ? "rgba(51, 65, 85, 0.5)"
                  : "#E2E8F0",
                paddingVertical: isTablet ? 16 : 14,
                borderRadius: isTablet ? 16 : 12,
                marginTop: 8,
              }}
            >
              <Text
                className="font-bold text-center"
                style={{
                  fontSize: getFontSize(16),
                  color: isDarkMode ? "#E2E8F0" : "#475569",
                }}
              >
                {t("close")}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
