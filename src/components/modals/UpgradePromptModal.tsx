/**
 * UpgradePromptModal Component
 * Modal that prompts users to upgrade to premium
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { PremiumBenefit } from '../types/payment';

interface UpgradePromptModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  highlightFeature?: string;
}

const { width } = Dimensions.get('window');

const PREMIUM_BENEFITS: PremiumBenefit[] = [
  {
    id: '1',
    title: 'Unlimited Transformations',
    description: 'Create as many pet photo transformations as you want',
    icon: '✨',
    isPremium: true,
  },
  {
    id: '2',
    title: 'No Watermarks',
    description: 'Export photos without any watermarks',
    icon: '🎨',
    isPremium: true,
  },
  {
    id: '3',
    title: 'Premium Stickers & Effects',
    description: 'Access exclusive stickers and special effects',
    icon: '🌟',
    isPremium: true,
  },
  {
    id: '4',
    title: 'Featured Provider Listings',
    description: 'Get featured placement in search results',
    icon: '📍',
    isPremium: true,
  },
  {
    id: '5',
    title: 'Advanced Analytics',
    description: 'Track detailed metrics and insights',
    icon: '📊',
    isPremium: true,
  },
  {
    id: '6',
    title: 'Priority Support',
    description: 'Get help faster with priority customer support',
    icon: '💬',
    isPremium: true,
  },
  {
    id: '7',
    title: 'Ad-Free Experience',
    description: 'Enjoy PawSpace without any advertisements',
    icon: '🚫',
    isPremium: true,
  },
];

export const UpgradePromptModal: React.FC<UpgradePromptModalProps> = ({
  visible,
  onClose,
  onUpgrade,
  highlightFeature,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Upgrade to Premium</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Highlight Feature */}
            {highlightFeature && (
              <View style={styles.highlightSection}>
                <Text style={styles.highlightIcon}>🔒</Text>
                <Text style={styles.highlightTitle}>
                  {highlightFeature}
                </Text>
                <Text style={styles.highlightDescription}>
                  This feature requires a premium subscription
                </Text>
              </View>
            )}

            {/* Pricing */}
            <View style={styles.pricingCard}>
              <Text style={styles.priceAmount}>$4.99</Text>
              <Text style={styles.priceInterval}>/month</Text>
              <Text style={styles.trialText}>Start with 7-day free trial</Text>
              <Text style={styles.cancelText}>Cancel anytime</Text>
            </View>

            {/* Benefits */}
            <View style={styles.benefitsSection}>
              <Text style={styles.benefitsTitle}>Premium Benefits:</Text>
              {PREMIUM_BENEFITS.map((benefit) => (
                <View key={benefit.id} style={styles.benefitItem}>
                  <Text style={styles.benefitIcon}>{benefit.icon}</Text>
                  <View style={styles.benefitContent}>
                    <Text style={styles.benefitTitle}>{benefit.title}</Text>
                    <Text style={styles.benefitDescription}>
                      {benefit.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={onUpgrade}
            >
              <Text style={styles.upgradeButtonText}>
                Start Free Trial
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.maybeLaterButton}
              onPress={onClose}
            >
              <Text style={styles.maybeLaterButtonText}>
                Maybe Later
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  highlightSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  highlightIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  highlightDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  pricingCard: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginVertical: 16,
  },
  priceAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#4A90E2',
  },
  priceInterval: {
    fontSize: 18,
    color: '#666666',
    marginTop: -8,
  },
  trialText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22C55E',
    marginTop: 12,
  },
  cancelText: {
    fontSize: 14,
    color: '#999999',
    marginTop: 4,
  },
  benefitsSection: {
    marginVertical: 16,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  upgradeButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  maybeLaterButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  maybeLaterButtonText: {
    fontSize: 16,
    color: '#666666',
  },
});

export default UpgradePromptModal;
