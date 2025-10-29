import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CreateStackParamList } from '@/types/navigation';
import { useTransformations } from '@/hooks/useTransformations';
import { Button, Loading } from '@/components/common';
import { theme } from '@/constants/theme';

type Props = NativeStackScreenProps<CreateStackParamList, 'Preview'>;

const PreviewScreen: React.FC<Props> = ({ navigation, route }) => {
  const { imageUri, caption, category } = route.params;
  const { createTransformation, isLoading } = useTransformations();
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      const { success, error } = await createTransformation({
        imageUrl: imageUri,
        caption: caption || '',
        category: category || 'Other',
      });

      if (success) {
        Alert.alert(
          'Success!',
          'Your transformation has been published!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('ImageSelector'),
            },
          ]
        );
      } else {
        Alert.alert('Error', error || 'Failed to publish transformation');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleEdit = () => {
    navigation.goBack();
  };

  if (isPublishing) {
    return <Loading text="Publishing..." fullScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Preview</Text>
        <Text style={styles.subtitle}>Review your transformation before publishing</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>

        <View style={styles.details}>
          <Text style={styles.captionLabel}>Caption</Text>
          <Text style={styles.caption}>{caption || 'No caption'}</Text>
          
          {category && (
            <>
              <Text style={styles.categoryLabel}>Category</Text>
              <Text style={styles.category}>{category}</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title="Edit"
          onPress={handleEdit}
          variant="outline"
          style={styles.editButton}
        />
        <Button
          title="Publish"
          onPress={handlePublish}
          style={styles.publishButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fonts['3xl'],
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fonts.lg,
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  imageContainer: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  details: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  captionLabel: {
    fontSize: theme.fonts.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  caption: {
    fontSize: theme.fonts.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  categoryLabel: {
    fontSize: theme.fonts.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  category: {
    fontSize: theme.fonts.md,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  editButton: {
    flex: 1,
  },
  publishButton: {
    flex: 2,
  },
});

export default PreviewScreen;