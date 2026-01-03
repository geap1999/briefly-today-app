import React from 'react';
import { View } from 'react-native';

interface Props {
  backgroundColor?: string;
  style?: any;
}

export default function Divider({ backgroundColor = 'rgba(0,0,0,0.06)', style }: Props) {
  return <View style={[{ width: '100%', height: 1, backgroundColor }, style]} />;
}
