import { getFontSize, moderateScale, useResponsive } from '@/utils/responsive';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { SlideInRight } from 'react-native-reanimated';

interface Props {
  celebrities: any[];
  maxCelebCardHeight?: number;
  setCelebHeights: React.Dispatch<React.SetStateAction<number[]>>;
  onCardPress: (url: string) => void;
}

export default function CelebritiesCarousel({ celebrities, maxCelebCardHeight, setCelebHeights, onCardPress }: Props) {
  const { width, isTablet } = useResponsive();
  
  if (!celebrities || celebrities.length === 0) return null;
  
  const CARD_GAP = isTablet ? 16 : 12;
  const CELEB_CARD_WIDTH = isTablet ? Math.min(400, Math.round(width * 0.6)) : Math.min(300, Math.round(width * 0.75));
  const imageSize = isTablet ? 80 : 60;
  const borderRadius = isTablet ? 32 : 24;
  const cardPadding = isTablet ? moderateScale(32) : moderateScale(24);

  return (
    <Animated.View entering={SlideInRight.duration(600)} className="my-6">
      <View className="flex-row items-baseline justify-between mb-4 px-1">
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image 
            source={require('@/assets/images/baby_bird.png')}
            style={{ width: imageSize, height: imageSize }}
            resizeMode="contain"
          />
          <Text className="font-bold text-slate-800" style={{ fontSize: getFontSize(24), marginLeft: 8 }}>Famous Birthdays</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Text className="font-semibold text-slate-500 uppercase" style={{ fontSize: getFontSize(12), letterSpacing: 1 }}>Swipe</Text>
          <Text className="text-slate-400" style={{ fontSize: getFontSize(14) }}>→</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CELEB_CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 4, paddingVertical: 2 }}
      >
        {celebrities.map((item, index) => (
          <TouchableOpacity key={`${item.title}-${index}`} activeOpacity={0.92} onPress={() => onCardPress(item.wikipedia_url)}>
            <View className="overflow-hidden mx-2" style={{ borderRadius, width: CELEB_CARD_WIDTH, ...(maxCelebCardHeight ? { height: maxCelebCardHeight } : {}) }}>
              <LinearGradient colors={["#FBBF24", "#F59E0B", "#EF4444"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: cardPadding, ...(maxCelebCardHeight ? { height: '100%' } : {}) }} onLayout={(event) => {
                if (!maxCelebCardHeight) {
                  const { height } = event.nativeEvent.layout;
                  setCelebHeights(prev => {
                    const newHeights = [...prev];
                    newHeights[index] = height;
                    return newHeights;
                  });
                }
              }}>
                <View style={{ position: 'absolute', top: 0, right: 0, width: isTablet ? 120 : 96, height: isTablet ? 120 : 96, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 9999, marginRight: isTablet ? -60 : -48, marginTop: isTablet ? -60 : -48 }} />
                <View className="relative z-10">
                  <Text className="font-bold text-white mb-3 leading-snug" style={{ fontSize: getFontSize(20) }} numberOfLines={2}>{item.title}</Text>
                  <Text className="text-white/95 leading-relaxed mb-4" style={{ fontSize: getFontSize(16) }} numberOfLines={5}>{item.content}</Text>
                  <View className="flex-row items-center gap-2">
                    <View style={{ width: isTablet ? 6 : 4, height: isTablet ? 6 : 4, borderRadius: 9999, backgroundColor: 'white' }} />
                    <Text className="font-semibold text-white" style={{ fontSize: getFontSize(14) }}>Learn more</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
}
