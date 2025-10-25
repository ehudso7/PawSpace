import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Transformation } from '../types';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 3) / 2;

interface TransformationCardProps {
  transformation: Transformation;
  onPress: () => void;
}

export const TransformationCard: React.FC<TransformationCardProps> = ({
  transformation,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: transformation.after_photo_url }}
        style={styles.image}
      />
      {transformation.before_photo_url && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>B/A</Text>
        </View>
      )}
      <View style={styles.footer}>
        <View style={styles.stats}>
          <Text style={styles.statText}>❤️ {transformation.likes_count}</Text>
          <Text style={styles.statText}>💬 {transformation.comments_count}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: COLORS.backgroundSecondary,
  },
  badge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  footer: {
    padding: SPACING.sm,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  statText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
});
