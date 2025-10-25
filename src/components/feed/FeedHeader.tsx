import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';

interface FeedHeaderProps {
  onSearchPress: () => void;
  onFilterPress: () => void;
  hasActiveFilters?: boolean;
}

export const FeedHeader: React.FC<FeedHeaderProps> = ({
  onSearchPress,
  onFilterPress,
  hasActiveFilters = false,
}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text style={styles.logo}>PawSpace</Text>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onSearchPress}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>🔍</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.iconButton,
              hasActiveFilters && styles.activeFilterButton,
            ]}
            onPress={onFilterPress}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.icon,
              hasActiveFilters && styles.activeFilterIcon,
            ]}>
              🎛️
            </Text>
            {hasActiveFilters && <View style={styles.filterIndicator} />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
    paddingTop: Platform.OS === 'ios' ? 44 : 0, // Status bar height
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },
  leftSection: {
    flex: 1,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
    letterSpacing: -0.5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    position: 'relative',
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
  },
  icon: {
    fontSize: 20,
  },
  activeFilterIcon: {
    color: '#fff',
  },
  filterIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
});