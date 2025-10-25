import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme, Surface, Chip } from 'react-native-paper';
import type { CreateScreenProps } from '../../types/navigation';

type Props = CreateScreenProps<'PostComposer'>;

const PostComposerScreen: React.FC<Props> = ({ route, navigation }) => {
  const { imageUri } = route.params;
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const availableTags = ['#dog', '#cat', '#puppy', '#kitten', '#cute', '#pets', '#pawspace'];

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handlePost = async () => {
    setLoading(true);
    
    // Simulate posting
    setTimeout(() => {
      setLoading(false);
      // Navigate back to feed
      navigation.navigate('HomeTab', { screen: 'Feed' });
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Surface style={styles.surface} elevation={2}>
          <Image source={{ uri: imageUri }} style={styles.image} />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Add Caption
          </Text>
          <TextInput
            value={caption}
            onChangeText={setCaption}
            mode="outlined"
            multiline
            numberOfLines={4}
            placeholder="Write a caption..."
            style={styles.input}
          />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Location (Optional)
          </Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            mode="outlined"
            placeholder="Add location..."
            left={<TextInput.Icon icon="map-marker" />}
            style={styles.input}
          />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Tags
          </Text>
          <View style={styles.tagsContainer}>
            {availableTags.map((tag) => (
              <Chip
                key={tag}
                selected={tags.includes(tag)}
                onPress={() => toggleTag(tag)}
                style={styles.chip}
              >
                {tag}
              </Chip>
            ))}
          </View>

          <Button
            mode="contained"
            onPress={handlePost}
            loading={loading}
            disabled={loading || !caption}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Post
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            Cancel
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flexGrow: 1,
    padding: 16,
  },
  surface: {
    padding: 20,
    borderRadius: 12,
  },
  image: {
    width: '100%',
    aspectRatio: 4/3,
    borderRadius: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    marginBottom: 4,
  },
  button: {
    marginBottom: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default PostComposerScreen;
