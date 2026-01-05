import { getFontSize, moderateScale, useResponsive } from '@/utils/responsive';
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
  const { isTablet } = useResponsive();
  
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
  
  const borderRadius = isTablet ? 40 : 32;
  const paddingH = isTablet ? moderateScale(45) : moderateScale(36);
  const paddingV = isTablet ? moderateScale(45) : moderateScale(48);

  return (
    <Animated.View entering={FadeInDown.duration(600).springify()}>
      <Animated.View 
        style={[
          headerAnimatedStyle,
          { 
            borderRadius,
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
          style={{ paddingHorizontal: paddingH, paddingVertical: paddingV }}
        >
            <View style={{ position: 'absolute', top: 0, right: 0, width: isTablet ? 200 : 160, height: isTablet ? 200 : 160, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 9999, marginRight: isTablet ? -100 : -80, marginTop: isTablet ? -100 : -80 }} />
            <View style={{ position: 'absolute', bottom: 0, left: 0, width: isTablet ? 160 : 128, height: isTablet ? 160 : 128, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 9999, marginLeft: isTablet ? -80 : -64, marginBottom: isTablet ? -80 : -64 }} />
            
            <View className="items-center relative z-10">
              <Text className="font-semibold uppercase text-purple-200 mb-2 opacity-90" style={{ fontSize: getFontSize(11), letterSpacing: 3 }}>
                {dateInfo.formattedDate}
              </Text>
              <Text className="font-black text-white mb-1 tracking-tight" style={{ fontSize: getFontSize(52), letterSpacing: -1 }}>
                {dateInfo.dayOfWeek}
              </Text>

              {todayData.special ? (
                <View style={{ marginTop: isTablet ? 16 : 12, paddingHorizontal: isTablet ? 28 : 20, paddingVertical: isTablet ? 12 : 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: isTablet ? 24 : 16 }}>
                  <Text className="font-bold text-yellow-300 text-center" style={{ 
                    fontSize: getFontSize(22),
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
                  <View style={{ marginTop: isTablet ? 20 : 16, marginBottom: isTablet ? 14 : 12, height: 1, backgroundColor: 'rgba(255,255,255,0.2)', width: '75%' }} />
                  <View>
                    <Text className="font-bold text-yellow-200 uppercase text-center mb-1.5" style={{ fontSize: getFontSize(9), letterSpacing: 2 }}>✝️ Saint of the Day</Text>
                    <Text className="font-semibold text-white/95 text-center px-4" style={{ fontSize: getFontSize(16), lineHeight: getFontSize(22) }} numberOfLines={2}>
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
