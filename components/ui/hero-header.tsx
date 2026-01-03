import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View } from 'react-native';
import Animated, { Extrapolation, FadeInDown, interpolate, useAnimatedStyle } from 'react-native-reanimated';

interface Props {
  dateInfo: any;
  todayData: any;
  scrollY: any;
}

export default function HeroHeader({ dateInfo, todayData, scrollY }: Props) {
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 150, 250],
      [1, 0.5, 0],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollY.value,
      [0, 150],
      [1, 0.95],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, 250],
      [0, -20],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }, { translateY }],
    } as any;
  });

  return (
    <Animated.View entering={FadeInDown.duration(600).springify()}>
      <Animated.View 
        style={[
          headerAnimatedStyle,
          { 
            borderRadius: 32,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 8,
          }
        ]}
      >
        <LinearGradient
          colors={['#8B5CF6', '#7C3AED', '#6366F1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-8 py-8"
        >
            <View className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20" />
            <View className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />
            
            <View className="items-center relative z-10">
              <Text className="text-xs font-semibold tracking-[3px] uppercase text-purple-200 mb-3 opacity-90">
                {dateInfo.formattedDate}
              </Text>
              <Text className="text-6xl font-black text-white mb-1 tracking-tight" style={{ letterSpacing: -1 }}>
                {dateInfo.dayOfWeek}
              </Text>

              {todayData.special ? (
                <View className="mt-4 px-6 py-3 bg-white/15 backdrop-blur-xl rounded-2xl">
                  <Text className="text-2xl font-bold text-yellow-300 text-center" style={{ 
                    textShadowColor: 'rgba(0,0,0,0.3)', 
                    textShadowOffset: { width: 0, height: 2 }, 
                    textShadowRadius: 8 
                  }}>
                    ✨ {todayData.special}
                  </Text>
                </View>
              ) : null}

              {todayData.saint && (
                <>
                  <View className="mt-6 mb-4 h-[1px] bg-white/20 w-3/4" />
                  <View>
                    <Text className="text-2xs font-bold text-yellow-200 uppercase tracking-[2px] text-center mb-2">✝️ Saint of the Day</Text>
                    <Text className="text-lg font-semibold text-white/95 text-center leading-6 px-4" numberOfLines={2}>
                      {todayData.saint}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
}
