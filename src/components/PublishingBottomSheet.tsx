import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Switch,
  Image,
  Alert,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { PublishingOptions, Platform } from '../types';
import { socialSharingService } from '../services/socialSharing';

const { height: screenHeight } = Dimensions.get('window');

interface PublishingBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onPublish: (options: PublishingOptions) => void;
  videoUrl: string;
  beforeImageUrl: string;
  afterImageUrl: string;
}

export const PublishingBottomSheet: React.FC<PublishingBottomSheetProps> = ({
  visible,
  onClose,
  onPublish,
  videoUrl,
  beforeImageUrl,
  afterImageUrl
}) => {
  const [caption, setCaption] = useState('');
  const [serviceTag, setServiceTag] = useState('');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['pawspace']);
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  const [platformAppsInstalled, setPlatformAppsInstalled] = useState<{[key in Platform]?: boolean}>({});

  useEffect(() => {
    if (visible) {
      loadSuggestedHashtags();
      checkInstalledApps();
    }
  }, [visible]);

  const loadSuggestedHashtags = () => {
    // Get platform-specific hashtags
    const allSuggestions = new Set<string>();
    
    selectedPlatforms.forEach(platform => {
      const platformTags = socialSharingService.getPlatformHashtags(platform);
      platformTags.forEach(tag => allSuggestions.add(tag));
    });

    setSuggestedHashtags(Array.from(allSuggestions));
  };

  const checkInstalledApps = async () => {
    const platforms: Platform[] = ['instagram', 'tiktok', 'twitter'];
    const installed: {[key in Platform]?: boolean} = { pawspace: true };

    for (const platform of platforms) {
      installed[platform] = await socialSharingService.isPlatformAppInstalled(platform);
    }

    setPlatformAppsInstalled(installed);
  };

  const handleHashtagToggle = (hashtag: string) => {
    setSelectedHashtags(prev => {
      if (prev.includes(hashtag)) {
        return prev.filter(tag => tag !== hashtag);
      } else {
        return [...prev, hashtag];
      }
    });
  };

  const handlePlatformToggle = (platform: Platform) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platform)) {
        return prev.filter(p => p !== platform);
      } else {
        return [...prev, platform];
      }
    });
  };

  const validateAndPublish = () => {
    if (selectedPlatforms.length === 0) {
      Alert.alert('Error', 'Please select at least one platform to share to.');
      return;
    }

    if (caption.trim().length === 0) {
      Alert.alert('Error', 'Please add a caption for your post.');
      return;
    }

    // Validate caption length for selected platforms
    for (const platform of selectedPlatforms) {
      const validation = socialSharingService.validateCaptionLength(caption, platform);
      if (!validation.isValid) {
        Alert.alert(
          'Caption Too Long',
          `Caption exceeds ${validation.maxLength} characters for ${platform}. Current: ${validation.currentLength}`,
          [{ text: 'OK' }]
        );
        return;
      }
    }

    const publishingOptions: PublishingOptions = {
      caption: caption.trim(),
      serviceTag: serviceTag.trim() || undefined,
      hashtags: selectedHashtags,
      privacy: isPublic ? 'public' : 'private',
      platforms: selectedPlatforms
    };

    onPublish(publishingOptions);
  };

  const getPlatformIcon = (platform: Platform): string => {
    const icons = {
      pawspace: 'paw',
      instagram: 'logo-instagram',
      tiktok: 'musical-notes',
      twitter: 'logo-twitter'
    };
    return icons[platform];
  };

  const getPlatformColor = (platform: Platform): string => {
    const colors = {
      pawspace: '#4CAF50',
      instagram: '#E4405F',
      tiktok: '#000000',
      twitter: '#1DA1F2'
    };
    return colors[platform];
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={20} style={styles.blurOverlay} />
        
        <View style={styles.bottomSheet}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Share Transformation</Text>
            <TouchableOpacity onPress={validateAndPublish}>
              <Text style={styles.publishButton}>Publish</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Video Preview */}
            <View style={styles.previewContainer}>
              <View style={styles.imagePreview}>
                <Image source={{ uri: beforeImageUrl }} style={styles.previewImage} />
                <Ionicons name="arrow-forward" size={20} color="#666" style={styles.arrowIcon} />
                <Image source={{ uri: afterImageUrl }} style={styles.previewImage} />
              </View>
            </View>

            {/* Caption Input */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Caption</Text>
              <TextInput
                style={styles.captionInput}
                placeholder="Write a caption for your transformation..."
                placeholderTextColor="#999"
                value={caption}
                onChangeText={setCaption}
                multiline
                maxLength={280}
                textAlignVertical="top"
              />
              <Text style={styles.characterCount}>{caption.length}/280</Text>
            </View>

            {/* Service Tag */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Service Tag (Optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Tag your grooming service..."
                placeholderTextColor="#999"
                value={serviceTag}
                onChangeText={setServiceTag}
                maxLength={50}
              />
            </View>

            {/* Hashtag Suggestions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Suggested Hashtags</Text>
              <View style={styles.hashtagContainer}>
                {suggestedHashtags.map(hashtag => (
                  <TouchableOpacity
                    key={hashtag}
                    style={[
                      styles.hashtagChip,
                      selectedHashtags.includes(hashtag) && styles.selectedHashtag
                    ]}
                    onPress={() => handleHashtagToggle(hashtag)}
                  >
                    <Text style={[
                      styles.hashtagText,
                      selectedHashtags.includes(hashtag) && styles.selectedHashtagText
                    ]}>
                      #{hashtag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Platform Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Share To</Text>
              <View style={styles.platformContainer}>
                {(['pawspace', 'instagram', 'tiktok', 'twitter'] as Platform[]).map(platform => (
                  <TouchableOpacity
                    key={platform}
                    style={[
                      styles.platformOption,
                      selectedPlatforms.includes(platform) && styles.selectedPlatform
                    ]}
                    onPress={() => handlePlatformToggle(platform)}
                  >
                    <View style={styles.platformInfo}>
                      <Ionicons
                        name={getPlatformIcon(platform) as any}
                        size={24}
                        color={selectedPlatforms.includes(platform) ? getPlatformColor(platform) : '#666'}
                      />
                      <Text style={[
                        styles.platformName,
                        selectedPlatforms.includes(platform) && styles.selectedPlatformName
                      ]}>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </Text>
                      {!platformAppsInstalled[platform] && platform !== 'pawspace' && (
                        <Text style={styles.webOnlyText}>Web only</Text>
                      )}
                    </View>
                    <View style={[
                      styles.checkbox,
                      selectedPlatforms.includes(platform) && styles.checkedBox
                    ]}>
                      {selectedPlatforms.includes(platform) && (
                        <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Privacy Toggle */}
            <View style={styles.section}>
              <View style={styles.privacyContainer}>
                <View>
                  <Text style={styles.sectionTitle}>Privacy</Text>
                  <Text style={styles.privacyDescription}>
                    {isPublic ? 'Anyone can see this post' : 'Only you can see this post'}
                  </Text>
                </View>
                <View style={styles.privacyToggle}>
                  <Text style={[styles.privacyLabel, !isPublic && styles.activePrivacyLabel]}>
                    Private
                  </Text>
                  <Switch
                    value={isPublic}
                    onValueChange={setIsPublic}
                    trackColor={{ false: '#767577', true: '#4CAF50' }}
                    thumbColor={isPublic ? '#ffffff' : '#f4f3f4'}
                  />
                  <Text style={[styles.privacyLabel, isPublic && styles.activePrivacyLabel]}>
                    Public
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.9,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  publishButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  content: {
    paddingHorizontal: 20,
  },
  previewContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  imagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  arrowIcon: {
    marginHorizontal: 8,
  },
  section: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  characterCount: {
    textAlign: 'right',
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hashtagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedHashtag: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  hashtagText: {
    fontSize: 14,
    color: '#666',
  },
  selectedHashtagText: {
    color: 'white',
  },
  platformContainer: {
    gap: 12,
  },
  platformOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedPlatform: {
    borderColor: '#4CAF50',
    backgroundColor: '#f8fff8',
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  platformName: {
    fontSize: 16,
    color: '#333',
  },
  selectedPlatformName: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  webOnlyText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  privacyDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  privacyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  privacyLabel: {
    fontSize: 14,
    color: '#666',
  },
  activePrivacyLabel: {
    color: '#4CAF50',
    fontWeight: '500',
  },
});

export default PublishingBottomSheet;