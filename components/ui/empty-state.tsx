import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View } from 'react-native';

interface Props {
  hasAnyContent: boolean;
}

export default function EmptyState({ hasAnyContent }: Props) {
  if (hasAnyContent) return null;
  return (
    <View className="relative overflow-hidden rounded-[24px] mt-4">
      <LinearGradient colors={["#F0F9FF", "#E0F2FE"]} className="px-6 py-8 items-center">
        <Text className="text-5xl mb-4">📅</Text>
        <Text className="text-xl font-bold text-slate-800 mb-2 text-center">Nothing for Today Yet</Text>
        <Text className="text-sm text-slate-600 text-center leading-relaxed px-4">Once your dataset includes today's date, you'll discover saints, celebrities, history, and fascinating facts here.</Text>
      </LinearGradient>
    </View>
  );
}
