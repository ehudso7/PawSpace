/**
 * SubscriptionScreen
 * Displays subscription status, benefits, pricing, and manages subscriptions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSubscription } from '../../hooks/useSubscription';
import stripeService from '../../services/stripe';
import { PremiumBenefit, PricingPlan } from '../../types/payment';

interface SubscriptionScreenProps {
  userId: string;
  userEmail: string;
  navigation?: any;
}

const PREMIUM_BENEFITS: PremiumBenefit[] = [
  {
    id: '1',
    title: 'Unlimited Transformations',
    description: 'vs 3/month free',
    icon: '✨',
    isPremium: true,
  },
  {
    id: '2',
    title: 'No Watermarks on Exports',
    description: 'Professional quality outputs',
    icon: '🎨',
    isPremium: true,
  },
  {
    id: '3',
    title: 'Premium Stickers and Effects',
    description: 'Access exclusive content',
    icon: '🌟',
    isPremium: true,
  },
  {
    id: '4',
    title: 'Featured Provider Listings',
    description: 'For service providers',
    icon: '📍',
    isPremium: true,
  },
  {
    id: '5',
    title: 'Advanced Analytics',
    description: 'Detailed insights and metrics',
    icon: '📊',
    isPremium: true,
  },
  {
    id: '6',
    title: 'Priority Support',
    description: 'Get help faster',
    icon: '💬',
    isPremium: true,
  },
  {
    id: '7',
    title: 'Ad-Free Experience',
    description: 'No interruptions',
    icon: '🚫',
    isPremium: true,
  },
];

const PRICING_PLAN: PricingPlan = {
  id: 'premium',
  name: 'Premium Plan',
  price: 4.99,
  interval: 'month',
  stripePriceId: 'price_premium_monthly',
  features: [
    'Unlimited transformations',
    'No watermarks',
    'Premium content',
    'Featured listings',
    'Advanced analytics',
    'Priority support',
    'Ad-free',
  ],
  trialDays: 7,
};

const FAQ_ITEMS = [
  {
    question: 'How does the trial work?',
    answer: 'You get 7 days of full premium access for free. Cancel anytime during the trial and you won\'t be charged.',
  },
  {
    question: 'How do I cancel?',
    answer: 'You can cancel anytime from this screen by tapping "Manage Subscription" and selecting "Cancel Subscription".',
  },
  {
    question: 'Will I be charged immediately?',
    answer: 'No, you won\'t be charged during your 7-day free trial. Your first payment will be processed after the trial ends.',
  },
];

export const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({
  userId,
  userEmail,
  navigation,
}) => {
  const { status, loading, refreshStatus, isPremium, isTrialActive } = useSubscription(userId);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const handleStartSubscription = async () => {
    try {
      setProcessingPayment(true);

      const result = await stripeService.createSubscription(
        userId,
        PRICING_PLAN.stripePriceId
      );

      Alert.alert(
        'Success!',
        'Welcome to Premium! Your subscription is now active.',
        [
          {
            text: 'OK',
            onPress: () => refreshStatus(),
          },
        ]
      );
    } catch (error) {
      console.error('Subscription error:', error);
      Alert.alert(
        'Subscription Failed',
        error instanceof Error ? error.message : 'Unable to process subscription. Please try again.'
      );
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleManageSubscription = () => {
    Alert.alert(
      'Manage Subscription',
      'What would you like to do?',
      [
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: handleCancelSubscription,
        },
        {
          text: 'View Billing History',
          onPress: () => {
            // TODO: Navigate to billing history
            Alert.alert('Coming Soon', 'Billing history will be available soon.');
          },
        },
        {
          text: 'Close',
          style: 'cancel',
        },
      ]
    );
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription?',
      'You\'ll lose access to premium features at the end of your billing period. Are you sure?',
      [
        {
          text: 'Keep Subscription',
          style: 'cancel',
        },
        {
          text: 'Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              if (status?.expires_at) {
                await stripeService.cancelSubscription('sub_id', userId);
                Alert.alert(
                  'Subscription Cancelled',
                  'Your subscription will remain active until ' + 
                  new Date(status.expires_at).toLocaleDateString()
                );
                refreshStatus();
              }
            } catch (error) {
              Alert.alert(
                'Error',
                'Unable to cancel subscription. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading subscription status...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Current Plan Card */}
      <View style={styles.currentPlanCard}>
        {isPremium ? (
          <>
            <View style={styles.planHeader}>
              <Text style={styles.planBadge}>✨ PREMIUM</Text>
              {isTrialActive && (
                <Text style={styles.trialBadge}>FREE TRIAL</Text>
              )}
            </View>
            <Text style={styles.planTitle}>Premium Plan</Text>
            <Text style={styles.planDescription}>
              You have access to all premium features
            </Text>
            {status?.expires_at && (
              <Text style={styles.renewalDate}>
                Renews on {formatDate(status.expires_at)}
              </Text>
            )}
            {isTrialActive && status?.trial_ends_at && (
              <Text style={styles.trialEndDate}>
                Trial ends {formatDate(status.trial_ends_at)}
              </Text>
            )}
            {status?.can_cancel && (
              <TouchableOpacity
                style={styles.manageButton}
                onPress={handleManageSubscription}
              >
                <Text style={styles.manageButtonText}>Manage Subscription</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <Text style={styles.planTitle}>Free Plan</Text>
            <Text style={styles.planDescription}>
              {status?.transformations_used || 0} of {status?.transformations_limit || 3} monthly transformations used
            </Text>
            <TouchableOpacity
              style={styles.upgradeCtaButton}
              onPress={handleStartSubscription}
              disabled={processingPayment}
            >
              {processingPayment ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.upgradeCtaButtonText}>
                  Upgrade to Premium
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Premium Benefits Section */}
      {!isPremium && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium Benefits</Text>
          <View style={styles.benefitsGrid}>
            {PREMIUM_BENEFITS.map((benefit) => (
              <View key={benefit.id} style={styles.benefitCard}>
                <Text style={styles.benefitIcon}>{benefit.icon}</Text>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>
                  {benefit.description}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Pricing Card */}
      {!isPremium && (
        <View style={styles.section}>
          <View style={styles.pricingCard}>
            <Text style={styles.priceAmount}>${PRICING_PLAN.price}</Text>
            <Text style={styles.priceInterval}>/{PRICING_PLAN.interval}</Text>
            <Text style={styles.cancelAnytime}>Cancel anytime</Text>
            
            <TouchableOpacity
              style={styles.startTrialButton}
              onPress={handleStartSubscription}
              disabled={processingPayment}
            >
              {processingPayment ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.startTrialButtonText}>
                    Start 7-Day Free Trial
                  </Text>
                  <Text style={styles.startTrialSubtext}>
                    Then ${PRICING_PLAN.price}/month
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* FAQ Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {FAQ_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faqItem}
            onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
          >
            <View style={styles.faqQuestion}>
              <Text style={styles.faqQuestionText}>{item.question}</Text>
              <Text style={styles.faqIcon}>
                {expandedFaq === index ? '−' : '+'}
              </Text>
            </View>
            {expandedFaq === index && (
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Spacer */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  currentPlanCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  planHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  planBadge: {
    backgroundColor: '#FFD700',
    color: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '700',
    marginRight: 8,
  },
  trialBadge: {
    backgroundColor: '#22C55E',
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '700',
  },
  planTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 12,
  },
  renewalDate: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 4,
  },
  trialEndDate: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '600',
    marginBottom: 12,
  },
  manageButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  manageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  upgradeCtaButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  upgradeCtaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  benefitsGrid: {
    paddingHorizontal: 16,
  },
  benefitCard: {
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
  benefitIcon: {
    fontSize: 32,
    marginBottom: 8,
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
  },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
    marginBottom: 8,
  },
  cancelAnytime: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 24,
  },
  startTrialButton: {
    backgroundColor: '#4A90E2',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startTrialButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  startTrialSubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  faqIcon: {
    fontSize: 24,
    color: '#4A90E2',
    marginLeft: 12,
  },
  faqAnswer: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 32,
  },
});

export default SubscriptionScreen;
