/**
 * PublishBottomSheet Component
 * Bottom sheet for caption input, hashtags, and publishing options
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PublishOptions } from '../types/video.types';

interface PublishBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onPublish: (options: PublishOptions) => void;
  initialCaption?: string;
  provider?: {
    name: string;
    link: string;
  };
}

const SUGGESTED_HASHTAGS = [
  '#petgrooming',
  '#doggrooming',
  '#catsofinstagram',
  '#dogsofinstagram',
  '#pettransformation',
  '#beforeandafter',
  '#grooming',
  '#petcare',
  '#dogmakeover',
  '#groomingsalon',
  '#petstyling',
  '#fluffypuppy',
];

export const PublishBottomSheet: React.FC<PublishBottomSheetProps> = ({
  isVisible,
  onClose,
  onPublish,
  initialCaption = '',
  provider,
}) => {
  const [caption, setCaption] = useState(initialCaption);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [serviceTag, setServiceTag] = useState('');

  useEffect(() => {
    if (provider) {
      setServiceTag(`✨ Groomed by ${provider.name} - ${provider.link}`);
    }
  }, [provider]);

  const toggleHashtag = (hashtag: string) => {
    setSelectedHashtags(prev => {
      if (prev.includes(hashtag)) {
        return prev.filter(tag => tag !== hashtag);
      }
      return [...prev, hashtag];
    });
  };

  const handlePublish = () => {
    const options: PublishOptions = {
      caption,
      serviceTag: provider ? serviceTag : undefined,
      hashtags: selectedHashtags,
      isPrivate,
      provider,
    };
    onPublish(options);
  };

  const remainingChars = 280 - caption.length;

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      
      <View style={styles.container}>
        {/* Handle bar */}
        <View style={styles.handleBar} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Publish Video</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Caption Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Caption</Text>
            <TextInput
              style={styles.captionInput}
              placeholder="Write a caption..."
              placeholderTextColor="#999"
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={280}
              textAlignVertical="top"
            />
            <Text style={[
              styles.charCounter,
              remainingChars < 0 && styles.charCounterError,
            ]}>
              {remainingChars} characters remaining
            </Text>
          </View>

          {/* Service Tag */}
          {provider && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Service Tag</Text>
              <View style={styles.serviceTagContainer}>
                <Ionicons name="business" size={20} color="#4CAF50" />
                <Text style={styles.serviceTagText}>
                  Groomed by {provider.name}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    // Open provider link
                  }}
                >
                  <Ionicons name="open-outline" size={18} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Hashtag Suggestions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hashtags</Text>
            <View style={styles.hashtagContainer}>
              {SUGGESTED_HASHTAGS.map((hashtag) => (
                <TouchableOpacity
                  key={hashtag}
                  style={[
                    styles.hashtagButton,
                    selectedHashtags.includes(hashtag) && styles.hashtagButtonSelected,
                  ]}
                  onPress={() => toggleHashtag(hashtag)}
                >
                  <Text
                    style={[
                      styles.hashtagText,
                      selectedHashtags.includes(hashtag) && styles.hashtagTextSelected,
                    ]}
                  >
                    {hashtag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Privacy Toggle */}
          <View style={styles.section}>
            <View style={styles.privacyRow}>
              <View style={styles.privacyInfo}>
                <Text style={styles.sectionTitle}>Privacy</Text>
                <Text style={styles.privacyDescription}>
                  {isPrivate ? 'Only you can see this video' : 'Everyone can see this video'}
                </Text>
              </View>
              <Switch
                value={isPrivate}
                onValueChange={setIsPrivate}
                trackColor={{ false: '#ccc', true: '#4CAF50' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </ScrollView>

        {/* Publish Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.publishButton,
              remainingChars < 0 && styles.publishButtonDisabled,
            ]}
            onPress={handlePublish}
            disabled={remainingChars < 0}
          >
            <Text style={styles.publishButtonText}>Publish</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
    paddingBottom: 20,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  captionInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#333',
    minHeight: 100,
    maxHeight: 150,
  },
  charCounter: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  charCounterError: {
    color: '#f44336',
  },
  serviceTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9f4',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  serviceTagText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hashtagButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  hashtagButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  hashtagText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  hashtagTextSelected: {
    color: '#fff',
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  privacyInfo: {
    flex: 1,
  },
  privacyDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  publishButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  publishButtonDisabled: {
    backgroundColor: '#ccc',
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
