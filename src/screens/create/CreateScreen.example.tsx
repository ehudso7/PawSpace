/**
 * Example: Using payment features in CreateScreen
 * Shows how to gate features based on subscription status
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSubscription } from '../hooks/useSubscription';
import UpgradePromptModal from '../components/modals/UpgradePromptModal';

interface CreateScreenProps {
  userId: string;
  navigation: any;
}

export const CreateScreen: React.FC<CreateScreenProps> = ({ userId, navigation }) => {
  const { 
    status, 
    isPremium, 
    checkFeatureAccess, 
    transformationsRemaining 
  } = useSubscription(userId);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<string>('');

  const handleCreateTransformation = () => {
    // Check if user has access to create transformations
    if (!checkFeatureAccess('create_transformation')) {
      setUpgradeFeature('Create unlimited transformations');
      setShowUpgradeModal(true);
      return;
    }

    // Continue with transformation creation
    console.log('Creating transformation...');
    navigation.navigate('TransformationEditor');
  };

  const handleUsePremiumSticker = () => {
    if (!checkFeatureAccess('premium_stickers')) {
      setUpgradeFeature('Access premium stickers and effects');
      setShowUpgradeModal(true);
      return;
    }

    // Continue with premium sticker
    console.log('Using premium sticker...');
  };

  const handleExportWithoutWatermark = () => {
    if (!checkFeatureAccess('export_without_watermark')) {
      setUpgradeFeature('Export without watermarks');
      setShowUpgradeModal(true);
      return;
    }

    // Export without watermark
    console.log('Exporting without watermark...');
  };

  const handleUpgrade = () => {
    setShowUpgradeModal(false);
    navigation.navigate('Subscription');
  };

  return (
    <View style={styles.container}>
      {/* Premium Status Banner */}
      {!isPremium && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            {transformationsRemaining} free transformation{transformationsRemaining !== 1 ? 's' : ''} remaining this month
          </Text>
          <TouchableOpacity 
            style={styles.upgradeButton}
            onPress={handleUpgrade}
          >
            <Text style={styles.upgradeButtonText}>Upgrade</Text>
          </TouchableOpacity>
        </View>
      )}

      {isPremium && (
        <View style={[styles.banner, styles.premiumBanner]}>
          <Text style={styles.premiumBannerText}>✨ Premium Active</Text>
        </View>
      )}

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Create Transformation</Text>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleCreateTransformation}
        >
          <Text style={styles.actionButtonText}>Create New Transformation</Text>
          {!isPremium && (
            <Text style={styles.limitText}>
              {transformationsRemaining} remaining
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleUsePremiumSticker}
        >
          <Text style={styles.actionButtonText}>
            Premium Stickers 
            {!isPremium && ' 🔒'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleExportWithoutWatermark}
        >
          <Text style={styles.actionButtonText}>
            Export (No Watermark)
            {!isPremium && ' 🔒'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Upgrade Prompt Modal */}
      <UpgradePromptModal
        visible={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
        highlightFeature={upgradeFeature}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  banner: {
    backgroundColor: '#FFF9E6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0E68C',
  },
  premiumBanner: {
    backgroundColor: '#E6F7FF',
    borderBottomColor: '#91D5FF',
  },
  bannerText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  premiumBannerText: {
    fontSize: 14,
    color: '#1890FF',
    fontWeight: '600',
  },
  upgradeButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  limitText: {
    fontSize: 14,
    color: '#999999',
    marginTop: 4,
  },
});

export default CreateScreen;
