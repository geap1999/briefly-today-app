import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { SlideInRight } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
const CELEB_CARD_WIDTH = Math.min(300, Math.round(SCREEN_WIDTH * 0.75));

interface Props {
  celebrities: any[];
  maxCelebCardHeight?: number;
  setCelebHeights: React.Dispatch<React.SetStateAction<number[]>>;
  onCardPress: (url: string) => void;
}

export default function CelebritiesCarousel({ celebrities, maxCelebCardHeight, setCelebHeights, onCardPress }: Props) {
  if (!celebrities || celebrities.length === 0) return null;

  return (
    <Animated.View entering={SlideInRight.duration(600)} className="my-6">
      <View className="flex-row items-baseline justify-between mb-4 px-1">
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image 
            source={require('@/assets/images/baby_bird.png')}
            style={{ width: 60, height: 60 }}
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold text-slate-800">Born Today</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Swipe</Text>
          <Text className="text-slate-400">→</Text>
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
            <View className="rounded-[24px] overflow-hidden mx-2" style={{ width: CELEB_CARD_WIDTH, ...(maxCelebCardHeight ? { height: maxCelebCardHeight } : {}) }}>
              <LinearGradient colors={["#FBBF24", "#F59E0B", "#EF4444"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className={`px-6 py-6 ${maxCelebCardHeight ? 'h-full' : ''}`} onLayout={(event) => {
                if (!maxCelebCardHeight) {
                  const { height } = event.nativeEvent.layout;
                  setCelebHeights(prev => {
                    const newHeights = [...prev];
                    newHeights[index] = height;
                    return newHeights;
                  });
                }
              }}>
                <View className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
                <View className="relative z-10">
                  <Text className="text-xl font-bold text-white mb-3 leading-snug" numberOfLines={2}>{item.title}</Text>
                  <Text className="text-base text-white/95 leading-relaxed mb-4" numberOfLines={5}>{item.content}</Text>
                  <View className="flex-row items-center gap-2"><View className="w-1 h-1 rounded-full bg-white" /><Text className="text-sm font-semibold text-white">Learn more</Text></View>
                </View>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
}
