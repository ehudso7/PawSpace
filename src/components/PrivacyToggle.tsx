import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PrivacyToggleProps {
  value: 'public' | 'private';
  onValueChange: (value: 'public' | 'private') => void;
}

const PrivacyToggle: React.FC<PrivacyToggleProps> = ({
  value,
  onValueChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Privacy</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.option,
            value === 'public' && styles.selectedOption
          ]}
          onPress={() => onValueChange('public')}
        >
          <Ionicons
            name="globe-outline"
            size={20}
            color={value === 'public' ? '#fff' : '#666'}
          />
          <Text style={[
            styles.optionText,
            value === 'public' && styles.selectedOptionText
          ]}>
            Public
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.option,
            value === 'private' && styles.selectedOption
          ]}
          onPress={() => onValueChange('private')}
        >
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={value === 'private' ? '#fff' : '#666'}
          />
          <Text style={[
            styles.optionText,
            value === 'private' && styles.selectedOptionText
          ]}>
            Private
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.description}>
        {value === 'public' 
          ? 'Anyone can see your transformation' 
          : 'Only you can see your transformation'
        }
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 8,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#FF6B6B',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 8,
  },
  selectedOptionText: {
    color: '#fff',
  },
  description: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default PrivacyToggle;