import { getFontSize, useResponsive } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface WarningModalProps {
  visible: boolean;
  onClose: () => void;
  category: string;
  isDarkMode?: boolean;
}

export default function WarningModal({
  visible,
  onClose,
  category,
  isDarkMode = false,
}: WarningModalProps) {
  const { isTablet } = useResponsive();

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
            borderRadius: isTablet ? 32 : 24,
            padding: isTablet ? 32 : 24,
            maxWidth: isTablet ? 500 : 340,
            width: "100%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <View className="items-center mb-4">
            <View
              style={{
                width: isTablet ? 80 : 64,
                height: isTablet ? 80 : 64,
                borderRadius: 9999,
                backgroundColor: "#FEE2E2",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: isTablet ? 20 : 16,
              }}
            >
              <Ionicons
                name="warning"
                size={isTablet ? 40 : 32}
                color="#EF4444"
              />
            </View>
            <Text
              className="font-black text-center mb-3"
              style={{
                fontSize: getFontSize(22),
                color: isDarkMode ? "#F1F5F9" : "#1E293B",
                letterSpacing: -0.3,
              }}
            >
              Limit Reached
            </Text>
            <Text
              className="text-center leading-relaxed"
              style={{
                fontSize: getFontSize(15),
                color: isDarkMode ? "#CBD5E1" : "#475569",
              }}
            >
              You have reached the maximum capacity of 20 likes for{" "}
              <Text className="font-bold">{category}</Text>. Please remove some
              existing likes before adding new ones.
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleClose}
            activeOpacity={0.8}
            style={{
              backgroundColor: "#EF4444",
              paddingVertical: isTablet ? 16 : 14,
              borderRadius: isTablet ? 16 : 12,
              marginTop: isTablet ? 8 : 4,
            }}
          >
            <Text
              className="font-bold text-white text-center"
              style={{
                fontSize: getFontSize(16),
              }}
            >
              Got it
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
