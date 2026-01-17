import { getFontSize, moderateScale, useResponsive } from "@/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  hasAnyContent: boolean;
  isDarkMode?: boolean;
}

export default function EmptyState({
  hasAnyContent,
  isDarkMode = false,
}: Props) {
  const { isTablet } = useResponsive();

  if (hasAnyContent) return null;

  const borderRadius = isTablet ? 32 : 24;
  const paddingH = isTablet ? moderateScale(32) : moderateScale(24);
  const paddingV = isTablet ? moderateScale(40) : moderateScale(32);

  return (
    <View className="relative overflow-hidden mt-4" style={{ borderRadius }}>
      <LinearGradient
        colors={isDarkMode ? ["#1E293B", "#334155"] : ["#F0F9FF", "#E0F2FE"]}
        style={{
          paddingHorizontal: paddingH,
          paddingVertical: paddingV,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: getFontSize(50),
            marginBottom: isTablet ? 20 : 16,
          }}
        >
          📅
        </Text>
        <Text
          className="font-bold mb-2 text-center"
          style={{
            fontSize: getFontSize(20),
            color: isDarkMode ? "#F1F5F9" : "#1E293B",
          }}
        >
          Nothing for Today Yet
        </Text>
        <Text
          className="text-center leading-relaxed px-4"
          style={{
            fontSize: getFontSize(14),
            color: isDarkMode ? "#CBD5E1" : "#475569",
          }}
        >
          Once your dataset includes today&apos;s date, you&apos;ll discover
          saints, celebrities, history, and fascinating facts here.
        </Text>
      </LinearGradient>
    </View>
  );
}
