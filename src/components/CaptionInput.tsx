import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
} from 'react-native';

interface CaptionInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
}

const CaptionInput: React.FC<CaptionInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Write a caption...',
  maxLength = 280,
}) => {
  const remainingChars = maxLength - value.length;
  const isNearLimit = remainingChars < 50;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Caption</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        multiline
        maxLength={maxLength}
        textAlignVertical="top"
      />
      <View style={styles.counterContainer}>
        <Text style={[
          styles.counter,
          isNearLimit && styles.counterWarning
        ]}>
          {remainingChars} characters remaining
        </Text>
      </View>
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
    minHeight: 100,
    maxHeight: 150,
  },
  counterContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  counter: {
    fontSize: 12,
    color: '#666',
  },
  counterWarning: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
});

export default CaptionInput;