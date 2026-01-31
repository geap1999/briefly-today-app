import { useLocale } from "@/contexts/locale-context";
import { getFontSize } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

interface DropdownMenuProps {
  onLanguagePress: () => void;
  onSettingsPress: () => void;
  isDarkMode?: boolean;
}

export default function DropdownMenu({
  onLanguagePress,
  onSettingsPress,
  isDarkMode = false,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t, locale } = useLocale();

  const handleOpen = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleItemPress = (action: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsOpen(false);
    setTimeout(() => action(), 100);
  };

  const menuItems = [
    {
      label: t("language"),
      onPress: onLanguagePress,
    },
    {
      label: t("settings"),
      onPress: onSettingsPress,
    },
  ];

  return (
    <>
      <TouchableOpacity
        onPress={handleOpen}
        className="p-3"
        activeOpacity={0.7}
      >
        <Ionicons
          name="ellipsis-vertical"
          size={24}
          color={isDarkMode ? "#94A3B8" : "#64748B"}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
          onPress={handleClose}
        >
          <View
            style={{
              position: "absolute",
              top: 70,
              right: 20,
              backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
              borderRadius: 16,
              paddingVertical: 8,
              minWidth: locale === "fr" ? 200 : 180,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleItemPress(item.onPress)}
                activeOpacity={0.7}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 14,
                  borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                  borderBottomColor: isDarkMode
                    ? "rgba(71, 85, 105, 0.5)"
                    : "rgba(241, 245, 249, 1)",
                }}
              >
                <Text
                  style={{
                    fontSize: getFontSize(16),
                    fontWeight: "600",
                    color: isDarkMode ? "#F1F5F9" : "#1E293B",
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
