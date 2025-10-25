import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Modal } from 'react-native';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  transparent?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Loading...',
  transparent = false,
}) => {
  if (!visible) return null;

  return (
    <Modal
      transparent={transparent}
      visible={visible}
      animationType="fade"
    >
      <View style={[styles.overlay, transparent && styles.transparent]}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  container: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#1a1a1a',
    textAlign: 'center',
  },
});

export default LoadingOverlay;