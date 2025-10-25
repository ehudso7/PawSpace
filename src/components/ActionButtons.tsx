import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActionButtonsProps {
  onSaveToDevice: () => void;
  onPostToPawSpace: () => void;
  onShareToInstagram: () => void;
  onShareToTikTok: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSaveToDevice,
  onPostToPawSpace,
  onShareToInstagram,
  onShareToTikTok,
}) => {
  return (
    <View style={styles.container}>
      {/* Primary Actions */}
      <View style={styles.primaryActions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onPostToPawSpace}
        >
          <Ionicons name="paw" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Post to PawSpace</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onSaveToDevice}
        >
          <Ionicons name="download-outline" size={20} color="#FF6B6B" />
          <Text style={styles.secondaryButtonText}>Save to Device</Text>
        </TouchableOpacity>
      </View>

      {/* Social Media Actions */}
      <View style={styles.socialActions}>
        <Text style={styles.socialLabel}>Share to Social Media</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={onShareToInstagram}
          >
            <Ionicons name="logo-instagram" size={24} color="#E4405F" />
            <Text style={styles.socialButtonText}>Instagram</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.socialButton}
            onPress={onShareToTikTok}
          >
            <Ionicons name="musical-notes" size={24} color="#000" />
            <Text style={styles.socialButtonText}>TikTok</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Additional Options */}
      <View style={styles.additionalOptions}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => Alert.alert('Coming Soon', 'YouTube sharing will be available soon!')}
        >
          <Ionicons name="logo-youtube" size={20} color="#FF0000" />
          <Text style={styles.optionButtonText}>YouTube</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => Alert.alert('Coming Soon', 'Facebook sharing will be available soon!')}
        >
          <Ionicons name="logo-facebook" size={20} color="#1877F2" />
          <Text style={styles.optionButtonText}>Facebook</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => Alert.alert('Coming Soon', 'Twitter sharing will be available soon!')}
        >
          <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
          <Text style={styles.optionButtonText}>Twitter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  primaryActions: {
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  socialActions: {
    marginBottom: 20,
  },
  socialLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  socialButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    minWidth: 100,
  },
  socialButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginTop: 4,
  },
  additionalOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
    minWidth: 80,
    justifyContent: 'center',
  },
  optionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginLeft: 4,
  },
});

export default ActionButtons;