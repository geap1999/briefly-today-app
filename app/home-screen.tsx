import CelebritiesCarousel from "@/components/ui/celebrities-carousel";
import Divider from "@/components/ui/divider";
import EmptyState from "@/components/ui/empty-state";
import HeroHeader from "@/components/ui/hero-header";
import ScoopOfTheDay from "@/components/ui/scoop-of-the-day";
import VerticalSection from "@/components/ui/vertical-section";
import { useTheme } from "@/contexts/theme-context";
import { useTimezone } from "@/contexts/timezone-context";
import { getScoop } from "@/services/supabase/scoop";
import {
  getFontSize,
  getHorizontalPadding,
  getMaxContentWidth,
  useResponsive,
} from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { InterstitialAd } from "react-native-google-mobile-ads";
import PagerView from "react-native-pager-view";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { adUnitId } from "../adconfigs";
import "../global.css";
import { useCelebHeights } from "../hooks/use-celeb-heights";
import { useCurrentTime } from "../hooks/use-current-time";
import { useDayData } from "../hooks/use-day-data";
import { useInterstitialAd } from "../hooks/use-interstitial-ad";
import { useScoopReveal } from "../hooks/use-scoop-reveal";

interface Scoop {
  id: number;
  title: string;
  content: string;
  category: string;
  image_url: string;
  source_name: string;
  url: string;
}

const interstitial = InterstitialAd.createForAdRequest(adUnitId);

type Season = "winter" | "spring" | "summer" | "autumn";

interface SeasonTheme {
  background: readonly [string, string, string];
  backgroundDark: readonly [string, string, string];
  divider: string;
  accentColor: string;
  decorativeElements: {
    color: string;
    emoji: string;
  };
}

const getSeason = (month: number): Season => {
  if (month === 12 || month === 1 || month === 2) return "winter";
  if (month === 3 || month === 4 || month === 5) return "spring";
  if (month === 6 || month === 7 || month === 8) return "summer";
  return "autumn";
};

const seasonThemes: Record<Season, SeasonTheme> = {
  winter: {
    background: ["#E0F2FE", "#DBEAFE", "#E0E7FF"] as const, // Cool blues and icy tones
    backgroundDark: ["#1E293B", "#0F172A", "#020617"] as const,
    divider: "rgba(147, 197, 253, 0.3)", // Light blue
    accentColor: "#3B82F6",
    decorativeElements: {
      color: "rgba(191, 219, 254, 0.64)",
      emoji: "❄️",
    },
  },
  spring: {
    background: ["#FEF3C7", "#FEF9C3", "#ECFCCB"] as const, // Warm yellows and fresh greens
    backgroundDark: ["#1C1917", "#0C0A09", "#0A0A0A"] as const,
    divider: "rgba(167, 243, 208, 0.4)", // Light green
    accentColor: "#10B981",
    decorativeElements: {
      color: "rgba(254, 240, 138, 0.4)",
      emoji: "🌸",
    },
  },
  summer: {
    background: ["#FEF3C7", "#FED7AA", "#FECACA"] as const, // Warm oranges and yellows
    backgroundDark: ["#292524", "#1C1917", "#18181B"] as const,
    divider: "rgba(253, 186, 116, 0.3)", // Light orange
    accentColor: "#F59E0B",
    decorativeElements: {
      color: "rgba(254, 215, 170, 0.5)",
      emoji: "☀️",
    },
  },
  autumn: {
    background: ["#FED7AA", "#FECACA", "#FBCFE8"] as const, // Browns, oranges, and warm pinks
    backgroundDark: ["#27272A", "#18181B", "#0F0A0A"] as const,
    divider: "rgba(251, 146, 60, 0.3)", // Light orange-brown
    accentColor: "#EA580C",
    decorativeElements: {
      color: "rgba(254, 215, 170, 0.4)",
      emoji: "🍂",
    },
  },
};

interface HomeScreenProps {
  onSettingsPress: () => void;
  onLikedContentPress: () => void;
  onDataLoaded?: () => void;
}

export default function HomeScreen({
  onSettingsPress,
  onLikedContentPress,
  onDataLoaded,
}: HomeScreenProps) {
  const { isDarkMode } = useTheme();
  const { region, timezone } = useTimezone();
  const { todayData, dateInfo } = useDayData();
  const { isTablet } = useResponsive();
  const horizontalPadding = getHorizontalPadding();
  const maxContentWidth = getMaxContentWidth();

  const [adLoaded, setAdLoaded] = useState(false);
  const [isScoopRevealed, setIsScoopRevealed] = useState(false);

  const currentSeason = useMemo(() => {
    const now = new Date();
    return getSeason(now.getMonth() + 1);
  }, []);

  const seasonTheme = seasonThemes[currentSeason];

  const scrollY = useSharedValue(0);
  const scrollViewRef = useRef<Animated.ScrollView>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const [scoop, setScoop] = useState<Scoop | null>(null);
  const [loading, setLoading] = useState(true);
  const [maxCelebCardHeight, setMaxCelebCardHeight] = useState<
    number | undefined
  >(undefined);
  const [celebHeights, setCelebHeights] = useState<number[]>([]);

  const fetchDailyScoop = useCallback(async () => {
    setLoading(true);
    const data = await getScoop(region);
    setScoop(data);
    setLoading(false);
  }, [region]);

  useScoopReveal(setIsScoopRevealed, fetchDailyScoop, timezone);
  const currentTime = useCurrentTime(setIsScoopRevealed, timezone);

  const scrollToScoop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 400, animated: true });
  }, []);

  useInterstitialAd(
    interstitial,
    setIsScoopRevealed,
    setAdLoaded,
    fetchDailyScoop,
    timezone,
    scrollToScoop,
  );
  useCelebHeights(
    celebHeights,
    todayData.celebrities.length,
    setMaxCelebCardHeight,
  );

  // Signal when initial data is loaded
  useEffect(() => {
    if (!loading && dateInfo.dayOfWeek && onDataLoaded) {
      onDataLoaded();
    }
  }, [loading, dateInfo.dayOfWeek, onDataLoaded]);

  // Padding to allow header to disappear only when scoop is revealed and loaded
  const dynamicPaddingBottom = isScoopRevealed && scoop && !loading ? 180 : 40;

  const handleScoopPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (adLoaded) {
      interstitial.show();
    } else {
      setIsScoopRevealed(true);
      setTimeout(() => scrollToScoop(), 300);
    }
  };

  const hasAnyContent = useMemo(() => {
    return (
      Boolean(todayData.saint) ||
      todayData.celebrities.length > 0 ||
      todayData.history.length > 0 ||
      todayData.popCulture.length > 0 ||
      todayData.natureTech.length > 0
    );
  }, [todayData]);

  const handleSettingsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSettingsPress();
  };

  const handleLikedContentPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onLikedContentPress();
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={
          isDarkMode ? seasonTheme.backgroundDark : seasonTheme.background
        }
        locations={[0, 0.5, 1]}
        className="absolute inset-0"
      />

      <View className="absolute inset-0 pointer-events-none">
        <View
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-20"
          style={{ backgroundColor: seasonTheme.decorativeElements.color }}
        />
        <View
          className="absolute -top-32 -right-16 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: seasonTheme.decorativeElements.color }}
        />
        <View
          className="absolute -bottom-24 right-1/4 w-56 h-56 rounded-full opacity-15"
          style={{ backgroundColor: seasonTheme.decorativeElements.color }}
        />
        <Text
          className="absolute top-24 right-8 text-6xl"
          style={{ opacity: 0.2 }}
        >
          {seasonTheme.decorativeElements.emoji}
        </Text>
        <Text
          className="absolute top-1/3 left-8 text-5xl"
          style={{ opacity: 0.19 }}
        >
          {seasonTheme.decorativeElements.emoji}
        </Text>
        <Text
          className="absolute bottom-1/4 right-12 text-7xl"
          style={{ opacity: 0.17 }}
        >
          {seasonTheme.decorativeElements.emoji}
        </Text>
        <Text
          className="absolute top-1/2 right-1/4 text-4xl"
          style={{ opacity: 0.13 }}
        >
          {seasonTheme.decorativeElements.emoji}
        </Text>
        <Text
          className="absolute bottom-1/3 left-16 text-5xl"
          style={{ opacity: 0.14 }}
        >
          {seasonTheme.decorativeElements.emoji}
        </Text>
      </View>

      <SafeAreaView edges={["top"]} className="flex-1">
        <PagerView style={{ flex: 1 }} initialPage={0}>
          <View key="1" style={{ flex: 1 }}>
            <Animated.ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: horizontalPadding,
                paddingTop: 20,
                paddingBottom: dynamicPaddingBottom,
                alignItems: "center",
              }}
              onScroll={scrollHandler}
              scrollEventThrottle={16}
            >
              <View
                style={{
                  width: "100%",
                  maxWidth:
                    typeof maxContentWidth === "number"
                      ? maxContentWidth
                      : undefined,
                }}
              >
                {/* Heart and Settings Icons */}
                <View className="flex-row items-center justify-end gap-3 mb-3">
                  <TouchableOpacity
                    onPress={handleLikedContentPress}
                    className="rounded-full p-3 shadow-sm"
                    activeOpacity={0.7}
                    style={{
                      backgroundColor: isDarkMode
                        ? "rgba(30, 41, 59, 0.7)"
                        : "rgba(255, 255, 255, 0.7)",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <Ionicons name="heart" size={24} color="#EF4444" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSettingsPress}
                    className="rounded-full p-3 shadow-sm"
                    activeOpacity={0.7}
                    style={{
                      backgroundColor: isDarkMode
                        ? "rgba(30, 41, 59, 0.7)"
                        : "rgba(255, 255, 255, 0.7)",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <Ionicons
                      name="settings-outline"
                      size={24}
                      color={seasonTheme.accentColor}
                    />
                  </TouchableOpacity>
                </View>

                {/* Swipe indicator at top */}
                <View className="items-center mb-6">
                  <View
                    className="flex-row items-center gap-2 px-5 py-3 rounded-full"
                    style={{
                      backgroundColor: isDarkMode
                        ? "rgba(30, 41, 59, 0.5)"
                        : "rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    <Text
                      className="font-bold tracking-wider uppercase"
                      style={{
                        fontSize: getFontSize(12),
                        color: seasonTheme.accentColor,
                        letterSpacing: 1.5,
                      }}
                    >
                      Swipe for today&apos;s facts
                    </Text>
                    <Text
                      style={{
                        fontSize: getFontSize(16),
                        color: seasonTheme.accentColor,
                      }}
                    >
                      →
                    </Text>
                  </View>
                </View>

                <HeroHeader
                  dateInfo={dateInfo}
                  todayData={todayData}
                  scrollY={scrollY}
                  isDarkMode={isDarkMode}
                />

                <ScoopOfTheDay
                  currentTime={currentTime}
                  isScoopRevealed={isScoopRevealed}
                  scoop={scoop}
                  timezone={timezone}
                  onScoopPress={handleScoopPress}
                  isDarkMode={isDarkMode}
                />
              </View>
            </Animated.ScrollView>
          </View>

          {/* Page 2: Facts */}
          <View key="2" style={{ flex: 1 }}>
            <Animated.ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: horizontalPadding,
                paddingTop: 40,
                paddingBottom: 40,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: "100%",
                  maxWidth:
                    typeof maxContentWidth === "number"
                      ? maxContentWidth
                      : undefined,
                }}
              >
                <View className="mb-10">
                  <Text
                    className="font-black text-center mb-1"
                    style={{
                      fontSize: getFontSize(48),
                      color: seasonTheme.accentColor,
                      letterSpacing: -1,
                      textShadowColor: "rgba(0,0,0,0.08)",
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 4,
                    }}
                  >
                    On This Day
                  </Text>
                  <Text
                    className="font-semibold text-center mt-3"
                    style={{
                      fontSize: getFontSize(16),
                      letterSpacing: 0.5,
                      color: isDarkMode ? "#94A3B8" : "#475569",
                    }}
                  >
                    Real events that happened on this date in history
                  </Text>
                </View>

                {todayData.celebrities.length > 0 && <Divider />}
                <CelebritiesCarousel
                  celebrities={todayData.celebrities}
                  maxCelebCardHeight={maxCelebCardHeight}
                  setCelebHeights={setCelebHeights}
                  isDarkMode={isDarkMode}
                />

                {todayData.popCulture.length > 0 && <Divider />}
                <VerticalSection
                  title="Pop Culture"
                  items={todayData.popCulture}
                  imagePath={require("@/assets/images/pop.png")}
                  gradientColors={["#EC4899", "#DB2777"]}
                  accentColor="#EC4899"
                  category="Pop Culture"
                  isDarkMode={isDarkMode}
                />

                {todayData.history.length > 0 && <Divider />}
                <VerticalSection
                  title="History"
                  items={todayData.history}
                  imagePath={require("@/assets/images/history.png")}
                  gradientColors={["#3B82F6", "#1E40AF"]}
                  accentColor="#3B82F6"
                  category="History"
                  isDarkMode={isDarkMode}
                />

                {todayData.natureTech.length > 0 && <Divider />}
                <VerticalSection
                  title="Breakthroughs"
                  items={todayData.natureTech}
                  imagePath={require("@/assets/images/eureka.png")}
                  gradientColors={["#10B981", "#059669"]}
                  accentColor="#10B981"
                  category="Nature & Tech"
                  isDarkMode={isDarkMode}
                />

                <EmptyState
                  hasAnyContent={hasAnyContent}
                  isDarkMode={isDarkMode}
                />

                <View className="pt-6 items-center">
                  <View
                    className="rounded-full mb-3"
                    style={{
                      width: isTablet ? 60 : 48,
                      height: 4,
                      backgroundColor: seasonTheme.accentColor,
                      opacity: 0.3,
                    }}
                  />
                  <Text
                    className="font-medium"
                    style={{
                      fontSize: getFontSize(12),
                      color: seasonTheme.accentColor,
                      opacity: 0.7,
                    }}
                  >
                    Discover something new every day
                  </Text>
                </View>
              </View>
            </Animated.ScrollView>
          </View>
        </PagerView>
      </SafeAreaView>
    </View>
  );
}
