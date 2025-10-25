import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  rating?: number;
}

export const RatingStars: React.FC<Props> = ({ rating }) => {
  const value = Math.round((rating ?? 0) * 10) / 10;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text accessibilityLabel={`Rating ${value}`}>⭐ {value}</Text>
    </View>
  );
};
