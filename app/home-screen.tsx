import CelebritiesCarousel from '@/components/ui/celebrities-carousel';
import Divider from '@/components/ui/divider';
import EmptyState from '@/components/ui/empty-state';
import HeroHeader from '@/components/ui/hero-header';
import ScoopOfTheDay from '@/components/ui/scoop-of-the-day';
import VerticalSection from '@/components/ui/vertical-section';
import { getScoop } from '@/services/supabase/scoop';
import { getFontSize, getHorizontalPadding, getMaxContentWidth, useResponsive } from '@/utils/responsive';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useMemo, useState } from 'react';
import { Linking, Text, View } from 'react-native';
import { InterstitialAd } from 'react-native-google-mobile-ads';
import PagerView from 'react-native-pager-view';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { adUnitId } from '../adconfigs';
import "../global.css";
import { useCelebHeights } from '../hooks/use-celeb-heights';
import { useCurrentTime } from '../hooks/use-current-time';
import { useDayData } from '../hooks/use-day-data';
import { useInterstitialAd } from '../hooks/use-interstitial-ad';
import { useScoopReveal } from '../hooks/use-scoop-reveal';

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

type Season = 'winter' | 'spring' | 'summer' | 'autumn';

interface SeasonTheme {
  background: readonly [string, string, string];
  divider: string;
  accentColor: string;
  decorativeElements: {
    color: string;
    emoji: string;
  };
}

const getSeason = (month: number): Season => {
  if (month === 12 || month === 1 || month === 2) return 'winter';
  if (month === 3 || month === 4 || month === 5) return 'spring';
  if (month === 6 || month === 7 || month === 8) return 'summer';
  return 'autumn';
};

const seasonThemes: Record<Season, SeasonTheme> = {
  winter: {
    background: ['#E0F2FE', '#DBEAFE', '#E0E7FF'] as const, // Cool blues and icy tones
    divider: 'rgba(147, 197, 253, 0.3)', // Light blue
    accentColor: '#3B82F6',
    decorativeElements: {
      color: 'rgba(191, 219, 254, 0.64)',
      emoji: '❄️',
    },
  },
  spring: {
    background: ['#FEF3C7', '#FEF9C3', '#ECFCCB'] as const, // Warm yellows and fresh greens
    divider: 'rgba(167, 243, 208, 0.4)', // Light green
    accentColor: '#10B981',
    decorativeElements: {
      color: 'rgba(254, 240, 138, 0.4)',
      emoji: '🌸',
    },
  },
  summer: {
    background: ['#FEF3C7', '#FED7AA', '#FECACA'] as const, // Warm oranges and yellows
    divider: 'rgba(253, 186, 116, 0.3)', // Light orange
    accentColor: '#F59E0B',
    decorativeElements: {
      color: 'rgba(254, 215, 170, 0.5)',
      emoji: '☀️',
    },
  },
  autumn: {
    background: ['#FED7AA', '#FECACA', '#FBCFE8'] as const, // Browns, oranges, and warm pinks
    divider: 'rgba(251, 146, 60, 0.3)', // Light orange-brown
    accentColor: '#EA580C',
    decorativeElements: {
      color: 'rgba(254, 215, 170, 0.4)',
      emoji: '🍂',
    },
  },
};

export default function HomeScreen() {
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
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  
  const [scoop, setScoop] = useState<Scoop | null>(null);
  const [loading, setLoading] = useState(true);
  const [maxCelebCardHeight, setMaxCelebCardHeight] = useState<number | undefined>(undefined);
  const [celebHeights, setCelebHeights] = useState<number[]>([]);

  const fetchDailyScoop = useCallback(async () => {
    setLoading(true);
    const data = await getScoop();
    setScoop(data);
    setLoading(false);
  }, []);

  useScoopReveal(setIsScoopRevealed, fetchDailyScoop);
  const currentTime = useCurrentTime(setIsScoopRevealed);
  useInterstitialAd(interstitial, setIsScoopRevealed, setAdLoaded, fetchDailyScoop);
  useCelebHeights(celebHeights, todayData.celebrities.length, setMaxCelebCardHeight);

  const handleScoopPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (adLoaded) {
      interstitial.show();
    } else {
      setIsScoopRevealed(true);
    }
  };

  const handleCardPress = (url: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    openLink(url);
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

  const openLink = (url: string) => {
    Linking.openURL(url);
  };
  
  return (
    <View className="flex-1">
      <LinearGradient
        colors={seasonTheme.background}
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
        <Text className="absolute top-24 right-8 text-6xl" style={{ opacity: 0.20 }}>
          {seasonTheme.decorativeElements.emoji}
        </Text>
        <Text className="absolute top-1/3 left-8 text-5xl" style={{ opacity: 0.19 }}>
          {seasonTheme.decorativeElements.emoji}
        </Text>
        <Text className="absolute bottom-1/4 right-12 text-7xl" style={{ opacity: 0.17 }}>
          {seasonTheme.decorativeElements.emoji}
        </Text>
        <Text className="absolute top-1/2 right-1/4 text-4xl" style={{ opacity: 0.13 }}>
          {seasonTheme.decorativeElements.emoji}
        </Text>
        <Text className="absolute bottom-1/3 left-16 text-5xl" style={{ opacity: 0.14 }}>
          {seasonTheme.decorativeElements.emoji}
        </Text>
      </View>
      
      <SafeAreaView edges={['top']} className="flex-1">
        <PagerView style={{ flex: 1 }} initialPage={0}>
          <View key="1" style={{ flex: 1 }}>
            <Animated.ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ 
                paddingHorizontal: horizontalPadding, 
                paddingTop: 20, 
                paddingBottom: 40,
                alignItems: 'center',
              }}
              onScroll={scrollHandler}
              scrollEventThrottle={16}
            >
              <View style={{ width: '100%', maxWidth: typeof maxContentWidth === 'number' ? maxContentWidth : undefined }}>
                {/* Swipe indicator at top */}
                <View className="items-center mb-6 mt-4">
                  <View className="flex-row items-center gap-2 px-5 py-3 bg-white/50 rounded-full">
                    <Text className="font-bold tracking-wider uppercase" style={{ fontSize: getFontSize(12), color: seasonTheme.accentColor, letterSpacing: 1.5 }}>
                      Swipe for today&apos;s facts
                    </Text>
                    <Text style={{ fontSize: getFontSize(16), color: seasonTheme.accentColor }}>→</Text>
                  </View>
                </View>

                <HeroHeader dateInfo={dateInfo} todayData={todayData} scrollY={scrollY} />

                <ScoopOfTheDay
                  currentTime={currentTime}
                  loading={loading}
                  isScoopRevealed={isScoopRevealed}
                  scoop={scoop}
                  onScoopPress={handleScoopPress}
                  onCardPress={handleCardPress}
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
                alignItems: 'center',
              }}
            >
              <View style={{ width: '100%', maxWidth: typeof maxContentWidth === 'number' ? maxContentWidth : undefined }}>
                <View className="mb-10">
                  <Text 
                    className="font-black text-center mb-1"
                    style={{ 
                      fontSize: getFontSize(48),
                      color: seasonTheme.accentColor,
                      letterSpacing: -1,
                      textShadowColor: 'rgba(0,0,0,0.08)',
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 4,
                    }}
                  >
                    On This Day
                  </Text>
                  <Text className="font-semibold text-slate-600 text-center mt-3" style={{ fontSize: getFontSize(16), letterSpacing: 0.5 }}>
                    Real events that happened on this date in history
                  </Text>
                </View>

                {todayData.celebrities.length > 0 && <Divider />}
                <CelebritiesCarousel
                  celebrities={todayData.celebrities}
                  maxCelebCardHeight={maxCelebCardHeight}
                  setCelebHeights={setCelebHeights}
                  onCardPress={handleCardPress}
                />
                
                {todayData.popCulture.length > 0 && <Divider />}
                <VerticalSection
                  title="Pop Culture"
                  items={todayData.popCulture}
                  imagePath={require('@/assets/images/star_bird.png')}
                  gradientColors={['#EC4899', '#DB2777']}
                  accentColor="#EC4899"
                  onCardPress={handleCardPress}
                />
                
                {todayData.history.length > 0 && <Divider />}
                <VerticalSection
                  title="History"
                  items={todayData.history}
                  imagePath={require('@/assets/images/history_bird.png')}
                  gradientColors={['#3B82F6', '#1E40AF']}
                  accentColor="#3B82F6"
                  onCardPress={handleCardPress}
                />
                
                {todayData.natureTech.length > 0 && <Divider />}
                <VerticalSection
                  title="Breakthroughs"
                  items={todayData.natureTech}
                  imagePath={require('@/assets/images/eureka_bird.png')}
                  gradientColors={['#10B981', '#059669']}
                  accentColor="#10B981"
                  onCardPress={handleCardPress}
                />
                
                <EmptyState hasAnyContent={hasAnyContent} />
                
                <View className="pt-6 items-center">
                  <View className="rounded-full mb-3" style={{ width: isTablet ? 60 : 48, height: 4, backgroundColor: seasonTheme.accentColor, opacity: 0.3 }} />
                  <Text className="font-medium" style={{ fontSize: getFontSize(12), color: seasonTheme.accentColor, opacity: 0.7 }}>
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