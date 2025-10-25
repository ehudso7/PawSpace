import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, SHADOWS } from '../constants/theme';

interface AvatarProps {
  uri?: string;
  name: string;
  size?: number;
  editable?: boolean;
  onPress?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 50,
  editable = false,
  onPress,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const Component = editable || onPress ? TouchableOpacity : View;

  return (
    <Component
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={[styles.initials, { fontSize: size / 2.5 }]}>
            {getInitials(name)}
          </Text>
        </View>
      )}
      {editable && (
        <View style={styles.editBadge}>
          <Text style={styles.editText}>✎</Text>
        </View>
      )}
    </Component>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: COLORS.backgroundSecondary,
    ...SHADOWS.sm,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  editText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
  },
});
