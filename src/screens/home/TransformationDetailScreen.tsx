import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/types/navigation';
import { useTransformation } from '@/hooks/useTransformations';
import { Button, Loading, ErrorMessage } from '@/components/common';
import { theme } from '@/constants/theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'TransformationDetail'>;

const TransformationDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { id } = route.params;
  const { transformation, isLoading, error } = useTransformation(id);

  const handleLike = () => {
    // Implement like functionality
    console.log('Like transformation:', id);
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share transformation:', id);
  };

  if (isLoading) {
    return <Loading text="Loading transformation..." fullScreen />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ErrorMessage message={error} />
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </View>
    );
  }

  if (!transformation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Transformation not found</Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: transformation.imageUrl }} style={styles.image} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image source={{ uri: transformation.user.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.username}>{transformation.user.name}</Text>
              <Text style={styles.timestamp}>{transformation.createdAt}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.caption}>{transformation.caption}</Text>

        <View style={styles.actions}>
          <Button
            title={`❤️ ${transformation.likesCount || 0}`}
            onPress={handleLike}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="Share"
            onPress={handleShare}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  imageContainer: {
    height: 400,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.md,
  },
  username: {
    fontSize: theme.fonts.lg,
    fontWeight: '600',
    color: theme.colors.text,
  },
  timestamp: {
    fontSize: theme.fonts.sm,
    color: theme.colors.textSecondary,
  },
  caption: {
    fontSize: theme.fonts.md,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  errorTitle: {
    fontSize: theme.fonts.xl,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    marginTop: theme.spacing.lg,
  },
});

export default TransformationDetailScreen;