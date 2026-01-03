import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface Props {
  title: string;
  items: any[];
  imagePath: any;
  gradientColors: string[];
  accentColor: string;
  onCardPress: (url: string) => void;
}

export default function VerticalSection({ title, items, imagePath, gradientColors, accentColor, onCardPress }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <Animated.View entering={FadeInUp.duration(500).delay(200)} className="my-6">
      <View className="mb-4 px-1">
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image 
            source={imagePath}
            style={{ width: 60, height: 60 }}
            resizeMode="contain"
          />
          <Text 
            className="text-2xl font-black text-slate-800"
            style={{ 
              flex: 1,
              letterSpacing: -0.3,
              textShadowColor: 'rgba(0,0,0,0.04)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
              marginLeft: 8,
            }}
          >
            {title}
          </Text>
        </View>
      </View>

      <View className="gap-3">
        {items.map((item, index) => (
          <TouchableOpacity key={`${item.title}-${index}`} activeOpacity={0.95} onPress={() => onCardPress(item.wikipedia_url)}>
            <View className="relative overflow-hidden rounded-[24px]" style={{ shadowColor: gradientColors[0], shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}>
              <View className="bg-white">
                <View className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: accentColor }} />
                <View className="pl-5 pr-5 py-5">
                  <Text 
                    className="text-lg font-black text-slate-900 mb-2 leading-tight"
                    style={{ letterSpacing: -0.2 }}
                  >
                    {item.title}
                  </Text>
                  <Text className="text-sm text-slate-600 leading-relaxed mb-3 font-medium">{item.content}</Text>
                  <View className="flex-row items-center gap-2">
                    <View className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }} />
                    <Text className="text-sm font-bold tracking-wide" style={{ color: accentColor }}>Learn more</Text>
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
