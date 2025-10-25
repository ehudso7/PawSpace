import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Pet } from '../types';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface PetCardProps {
  pet: Pet;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const PetCard: React.FC<PetCardProps> = ({
  pet,
  onPress,
  onEdit,
  onDelete,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {pet.photo_url ? (
        <Image source={{ uri: pet.photo_url }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            {pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐱' : '🐾'}
          </Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.name}>{pet.name}</Text>
        {pet.breed && <Text style={styles.breed}>{pet.breed}</Text>}
        <View style={styles.details}>
          {pet.age && (
            <Text style={styles.detailText}>{pet.age} years old</Text>
          )}
          {pet.weight && (
            <Text style={styles.detailText}> • {pet.weight} lbs</Text>
          )}
        </View>
        {pet.special_needs && (
          <Text style={styles.specialNeeds} numberOfLines={2}>
            ⚠️ {pet.special_needs}
          </Text>
        )}
      </View>
      {(onEdit || onDelete) && (
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Text style={styles.actionText}>✎</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Text style={styles.deleteText}>🗑</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.backgroundSecondary,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 40,
  },
  content: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  name: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  breed: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
  specialNeeds: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.warning,
    marginTop: SPACING.xs,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: COLORS.error + '20',
  },
  actionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
  },
  deleteText: {
    fontSize: FONT_SIZES.md,
  },
});
