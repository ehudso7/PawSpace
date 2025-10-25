import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onStartTrial: () => void;
  loading?: boolean;
}

export const UpgradeModal: React.FC<Props> = ({ visible, onClose, onStartTrial, loading }) => {
  if (!visible) return null;
  return (
    <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <View style={{ backgroundColor: 'white', borderRadius: 12, width: '100%', maxWidth: 420, padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Go Premium</Text>
        <Text style={{ color: '#444', marginBottom: 16 }}>Unlock unlimited transformations, no watermarks, premium assets and more.</Text>
        <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 4 }}>$4.99/month</Text>
        <Text style={{ color: '#666', marginBottom: 20 }}>Start 7-day free trial. Cancel anytime.</Text>
        <TouchableOpacity onPress={onStartTrial} disabled={!!loading} style={{ backgroundColor: '#6C47FF', padding: 12, borderRadius: 8, alignItems: 'center' }}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: 'white', fontWeight: '600' }}>Start free trial</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={{ padding: 12, alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: '#333' }}>Not now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
