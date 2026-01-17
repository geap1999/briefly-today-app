import { getFontSize, moderateScale, useResponsive } from "@/utils/responsive";
import { getScoopCountdown, handleOpenArticle } from "@/utils/utils";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface Props {
  currentTime: any;
  loading: boolean;
  isScoopRevealed: boolean;
  scoop: any;
  onScoopPress: () => void;
  isDarkMode?: boolean;
}

export default function ScoopOfTheDay({
  currentTime,
  loading,
  isScoopRevealed,
  scoop,
  onScoopPress,
  isDarkMode = false,
}: Props) {
  const { isTablet } = useResponsive();
  const countdown = getScoopCountdown(currentTime);

  const scoopyAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withRepeat(
            withSequence(
              withTiming(-5, { duration: 1500 }),
              withTiming(0, { duration: 1500 })
            ),
            -1,
            true
          ),
        },
      ],
    };
  });

  const borderRadius = isTablet ? 36 : 28;
  const padding = isTablet ? moderateScale(24) : moderateScale(18);
  const imageSize = isTablet ? 60 : 45;
  const imageHeight = isTablet ? moderateScale(240) : moderateScale(180);

  if (loading && isScoopRevealed) {
    return (
      <View className="items-center py-12 my-6">
        <ActivityIndicator size="large" color="#A855F7" />
      </View>
    );
  }

  if (isScoopRevealed && scoop) {
    return (
      <Animated.View entering={FadeIn.duration(400)} className="my-4">
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => handleOpenArticle(scoop.url, "#3B82F6")}
        >
          <View className="relative overflow-hidden" style={{ borderRadius }}>
            <LinearGradient
              colors={
                isDarkMode ? ["#1E293B", "#334155"] : ["#FFFFFF", "#FAFAFA"]
              }
              style={{ padding }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-2">
                  <Image
                    source={require("@/assets/images/reading.png")}
                    style={{ width: imageSize, height: imageSize }}
                    resizeMode="contain"
                  />
                  <Text
                    className="font-semibold uppercase"
                    style={{
                      fontSize: getFontSize(11),
                      letterSpacing: 2,
                      color: isDarkMode ? "#C084FC" : "#9333EA",
                    }}
                  >
                    Today&apos;s Scoop
                  </Text>
                </View>
                <View
                  style={{
                    paddingHorizontal: isTablet ? 14 : 10,
                    paddingVertical: isTablet ? 6 : 5,
                    backgroundColor: isDarkMode ? "#581C87" : "#F3E8FF",
                    borderRadius: 9999,
                  }}
                >
                  <Text
                    className="font-bold uppercase"
                    style={{
                      fontSize: getFontSize(9),
                      letterSpacing: 1,
                      color: isDarkMode ? "#E9D5FF" : "#6B21A8",
                    }}
                  >
                    {scoop.category}
                  </Text>
                </View>
              </View>

              {scoop.image_url && (
                <View
                  className="mb-4 overflow-hidden"
                  style={{ borderRadius: isTablet ? 24 : 16 }}
                >
                  <Image
                    source={{ uri: scoop.image_url }}
                    style={{ width: "100%", height: imageHeight }}
                    resizeMode="cover"
                  />
                </View>
              )}

              <Text
                className="font-bold mb-2 leading-tight"
                style={{
                  fontSize: getFontSize(22),
                  color: isDarkMode ? "#F1F5F9" : "#0F172A",
                }}
              >
                {scoop.title}
              </Text>
              <Text
                className="leading-relaxed mb-3"
                style={{
                  fontSize: getFontSize(15),
                  color: isDarkMode ? "#CBD5E1" : "#475569",
                }}
              >
                {scoop.content}
              </Text>

              <View
                className="flex-row items-center justify-between pt-2.5"
                style={{
                  borderTopWidth: 1,
                  borderTopColor: isDarkMode ? "#475569" : "#F1F5F9",
                }}
              >
                <Text
                  className="font-semibold"
                  style={{
                    fontSize: getFontSize(13),
                    color: isDarkMode ? "#E2E8F0" : "#334155",
                  }}
                >
                  📰 {scoop.source_name}
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <Text
                    className="font-semibold"
                    style={{
                      fontSize: getFontSize(13),
                      color: isDarkMode ? "#C084FC" : "#9333EA",
                    }}
                  >
                    Read more
                  </Text>
                  <Text
                    style={{
                      fontSize: getFontSize(13),
                      color: isDarkMode ? "#C084FC" : "#9333EA",
                    }}
                  >
                    →
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInUp.duration(500)} className="my-5">
      <View className="mb-3 px-1 items-center w-full">
        <Text
          className="text-4xl font-black"
          style={{
            color: isDarkMode ? "#F1F5F9" : "#1E293B",
            letterSpacing: -0.5,
            textShadowColor: "rgba(0,0,0,0.05)",
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
            flexShrink: 1,
            flexWrap: "wrap",
            textAlign: "center",
            width: "100%",
          }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          Scoop of the Day
        </Text>
      </View>

      {countdown.isPast7PM ? (
        <TouchableOpacity activeOpacity={0.9} onPress={onScoopPress}>
          <View className="relative overflow-hidden rounded-[28px]">
            <LinearGradient
              colors={["#FFD580", "#FF9900", "#FF7300"]}
              className="px-8 py-14 items-center justify-center"
            >
              <View className="items-center relative z-10">
                <Image
                  source={require("@/assets/images/delivered.png")}
                  style={{
                    width: 40,
                    height: 40,
                    marginBottom: 4,
                    marginTop: -12,
                  }}
                  resizeMode="contain"
                />
                <Text className="text-3xl font-black text-white mb-3 text-center tracking-tight">
                  Scoop Delivered!
                </Text>
                <Text className="text-lg font-semibold text-purple-100 text-center">
                  Tap to reveal your exclusive scoop
                </Text>
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      ) : (
        <View className="relative overflow-hidden rounded-[28px]">
          <LinearGradient
            colors={["#FAF5FF", "#F3E8FF"]}
            className="px-6 py-16"
          >
            <View className="items-center">
              <Animated.Image
                source={require("@/assets/images/delivery.png")}
                style={[
                  { width: 40, height: 40, marginBottom: 4, marginTop: -24 },
                  scoopyAnimationStyle,
                ]}
                resizeMode="contain"
              />
              <Text className="text-sm font-semibold text-purple-700 uppercase tracking-[2px] mb-6">
                Unlocks at 7:00 PM ET
              </Text>
              <View className="flex-row items-center gap-3">
                <View className="items-center px-4 py-3 bg-white/60 rounded-2xl min-w-[72px]">
                  <Text className="text-4xl font-black text-purple-900">
                    {String(countdown.hours).padStart(2, "0")}
                  </Text>
                  <Text className="text-2xs font-semibold text-purple-600 uppercase mt-1 tracking-wide">
                    Hours
                  </Text>
                </View>
                <Text className="text-2xl font-black text-purple-400">:</Text>
                <View className="items-center px-4 py-3 bg-white/60 rounded-2xl min-w-[72px]">
                  <Text className="text-4xl font-black text-purple-900">
                    {String(countdown.minutes).padStart(2, "0")}
                  </Text>
                  <Text className="text-2xs font-semibold text-purple-600 uppercase mt-1 tracking-wide">
                    Minutes
                  </Text>
                </View>
                <Text className="text-2xl font-black text-purple-400">:</Text>
                <View className="items-center px-4 py-3 bg-white/60 rounded-2xl min-w-[72px]">
                  <Text className="text-4xl font-black text-purple-900">
                    {String(countdown.seconds).padStart(2, "0")}
                  </Text>
                  <Text className="text-2xs font-semibold text-purple-600 uppercase mt-1 tracking-wide">
                    Seconds
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      )}
    </Animated.View>
  );
}
