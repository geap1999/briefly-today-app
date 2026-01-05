import { useResponsive } from '@/utils/responsive';
import React from 'react';
import { View } from 'react-native';

interface Props {
  backgroundColor?: string;
  style?: any;
}

export default function Divider({ backgroundColor = 'rgba(0,0,0,0.06)', style }: Props) {
  const { isTablet } = useResponsive();
  const height = isTablet ? 2 : 1;
  
  return <View style={[{ width: '100%', height, backgroundColor }, style]} />;
}
