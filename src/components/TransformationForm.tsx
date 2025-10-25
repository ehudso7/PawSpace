import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { TransitionType } from '@/types/transformation';

interface TransformationFormProps {
  beforeImageUri: string;
  afterImageUri: string;
  onPreview: (data: {
    beforeImageUri: string;
    afterImageUri: string;
    caption: string;
    transitionType: TransitionType;
    isPublic: boolean;
  }) => void;
  onSaveDraft: (data: {
    beforeImageUri: string;
    afterImageUri: string;
    caption: string;
    transitionType: TransitionType;
    isPublic: boolean;
  }) => void;
}

const transitionTypes: { value: TransitionType; label: string; icon: string }[] = [
  { value: 'crossfade', label: 'Crossfade', icon: '✨' },
  { value: 'slide', label: 'Slide', icon: '➡️' },
  { value: 'zoom', label: 'Zoom', icon: '🔍' },
  { value: 'fade', label: 'Fade', icon: '🌅' },
  { value: 'dissolve', label: 'Dissolve', icon: '💫' },
];

export const TransformationForm: React.FC<TransformationFormProps> = ({
  beforeImageUri,
  afterImageUri,
  onPreview,
  onSaveDraft,
}) => {
  const [caption, setCaption] = useState('');
  const [selectedTransition, setSelectedTransition] = useState<TransitionType>('crossfade');
  const [isPublic, setIsPublic] = useState(true);
  const [hasMusic, setHasMusic] = useState(false);

  const handlePreview = () => {
    if (!caption.trim()) {
      Alert.alert('Caption Required', 'Please enter a caption for your transformation');
      return;
    }

    onPreview({
      beforeImageUri,
      afterImageUri,
      caption: caption.trim(),
      transitionType: selectedTransition,
      isPublic,
    });
  };

  const handleSaveDraft = () => {
    onSaveDraft({
      beforeImageUri,
      afterImageUri,
      caption: caption.trim() || 'My transformation',
      transitionType: selectedTransition,
      isPublic,
    });
    
    Alert.alert('Draft Saved', 'Your transformation has been saved as a draft');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imagesContainer}>
        <View style={styles.imageWrapper}>
          <Text style={styles.imageLabel}>Before</Text>
          <Image source={{ uri: beforeImageUri }} style={styles.image} />
        </View>
        
        <View style={styles.imageWrapper}>
          <Text style={styles.imageLabel}>After</Text>
          <Image source={{ uri: afterImageUri }} style={styles.image} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Caption</Text>
        <TextInput
          style={styles.captionInput}
          placeholder="Describe your transformation..."
          placeholderTextColor="#8E8E93"
          value={caption}
          onChangeText={setCaption}
          multiline
          maxLength={200}
        />
        <Text style={styles.characterCount}>{caption.length}/200</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transition Effect</Text>
        <View style={styles.transitionGrid}>
          {transitionTypes.map((transition) => (
            <TouchableOpacity
              key={transition.value}
              style={[
                styles.transitionOption,
                selectedTransition === transition.value && styles.transitionOptionSelected,
              ]}
              onPress={() => setSelectedTransition(transition.value)}
            >
              <Text style={styles.transitionIcon}>{transition.icon}</Text>
              <Text
                style={[
                  styles.transitionLabel,
                  selectedTransition === transition.value && styles.transitionLabelSelected,
                ]}
              >
                {transition.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => setIsPublic(!isPublic)}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Public</Text>
            <Text style={styles.settingDescription}>
              Make this transformation visible to others
            </Text>
          </View>
          <View style={[styles.toggle, isPublic && styles.toggleActive]}>
            <View style={[styles.toggleThumb, isPublic && styles.toggleThumbActive]} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => setHasMusic(!hasMusic)}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Add Music</Text>
            <Text style={styles.settingDescription}>
              Include background music in your video
            </Text>
          </View>
          <View style={[styles.toggle, hasMusic && styles.toggleActive]}>
            <View style={[styles.toggleThumb, hasMusic && styles.toggleThumbActive]} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.draftButton} onPress={handleSaveDraft}>
          <Text style={styles.draftButtonText}>Save Draft</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.previewButton} onPress={handlePreview}>
          <Text style={styles.previewButtonText}>Preview</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  imagesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  imageWrapper: {
    flex: 1,
  },
  imageLabel: {
    color: '#8E8E93',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  captionInput: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  characterCount: {
    color: '#8E8E93',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  transitionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  transitionOption: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 80,
    flex: 1,
  },
  transitionOptionSelected: {
    backgroundColor: '#007AFF',
  },
  transitionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  transitionLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  transitionLabelSelected: {
    color: '#fff',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    color: '#8E8E93',
    fontSize: 14,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3A3A3C',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#007AFF',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  draftButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  draftButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  previewButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  previewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});