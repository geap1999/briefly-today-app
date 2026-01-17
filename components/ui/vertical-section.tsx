import { getFontSize, moderateScale, useResponsive } from "@/utils/responsive";
import { handleOpenArticle } from "@/utils/utils";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface Props {
  title: string;
  items: any[];
  imagePath: any;
  gradientColors: string[];
  accentColor: string;
  isDarkMode?: boolean;
}

export default function VerticalSection({
  title,
  items,
  imagePath,
  gradientColors,
  accentColor,
  isDarkMode = false,
}: Props) {
  const { isTablet } = useResponsive();

  if (!items || items.length === 0) return null;

  const imageSize = isTablet ? 80 : moderateScale(60);
  const titleFontSize = getFontSize(24);
  const itemTitleFontSize = getFontSize(18);
  const contentFontSize = getFontSize(14);
  const borderRadius = isTablet ? 32 : 24;
  const cardPadding = isTablet ? 28 : 20;

  return (
    <Animated.View
      entering={FadeInUp.duration(500).delay(200)}
      className="my-6"
    >
      <View className="mb-4 px-1">
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={imagePath}
            style={{ width: imageSize, height: imageSize }}
            resizeMode="contain"
          />
          <Text
            className="font-black"
            style={{
              flex: 1,
              fontSize: titleFontSize,
              color: isDarkMode ? "#F1F5F9" : "#1E293B",
              letterSpacing: -0.3,
              textShadowColor: "rgba(0,0,0,0.04)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
              marginLeft: isTablet ? 12 : 8,
            }}
          >
            {title}
          </Text>
        </View>
      </View>

      <View style={{ gap: isTablet ? 16 : 12 }}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={`${item.title}-${index}`}
            activeOpacity={0.95}
            onPress={() => handleOpenArticle(item.wikipedia_url, accentColor)}
          >
            <View
              className="relative overflow-hidden"
              style={{
                borderRadius,
                shadowColor: gradientColors[0],
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View
                style={{ backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF" }}
              >
                <View
                  className="absolute left-0 top-0 bottom-0"
                  style={{
                    width: isTablet ? 8 : 6,
                    backgroundColor: accentColor,
                  }}
                />
                <View
                  style={{
                    paddingLeft: cardPadding,
                    paddingRight: cardPadding,
                    paddingVertical: cardPadding,
                  }}
                >
                  <Text
                    className="font-black mb-2 leading-tight"
                    style={{
                      fontSize: itemTitleFontSize,
                      letterSpacing: -0.2,
                      color: isDarkMode ? "#F1F5F9" : "#0F172A",
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    className="leading-relaxed mb-3 font-medium"
                    style={{
                      fontSize: contentFontSize,
                      color: isDarkMode ? "#CBD5E1" : "#475569",
                    }}
                  >
                    {item.content}
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <View
                      className="rounded-full"
                      style={{
                        width: isTablet ? 6 : 4,
                        height: isTablet ? 6 : 4,
                        backgroundColor: accentColor,
                      }}
                    />
                    <Text
                      className="font-bold tracking-wide"
                      style={{ fontSize: contentFontSize, color: accentColor }}
                    >
                      Learn more
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}
