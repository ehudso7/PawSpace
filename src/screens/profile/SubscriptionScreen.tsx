import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '../../hooks/useSubscription';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import stripeService from '../../services/stripe';

interface SubscriptionScreenProps {
  userId: string;
  navigation?: any; // Replace with proper navigation type
}

export const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({
  userId,
  navigation,
}) => {
  const {
    status,
    loading,
    error,
    createSubscription,
    cancelSubscription,
    refreshStatus,
  } = useSubscription(userId);

  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    // Initialize Stripe when component mounts
    const initializeStripe = async () => {
      try {
        if (!stripeService.isInitialized()) {
          await stripeService.initialize();
        }
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
      }
    };

    initializeStripe();
  }, []);

  const handleSubscribe = async () => {
    try {
      setProcessingPayment(true);
      await createSubscription();
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription();
    } catch (error) {
      console.error('Cancel subscription error:', error);
    }
  };

  const handleManageSubscription = () => {
    Alert.alert(
      'Manage Subscription',
      'Choose an action for your subscription:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Cancel Subscription', 
          style: 'destructive',
          onPress: handleCancelSubscription 
        },
        { 
          text: 'Update Payment Method', 
          onPress: () => {
            // Navigate to payment method update
            Alert.alert('Coming Soon', 'Payment method update will be available soon.');
          }
        },
      ]
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && !status) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation?.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Subscription</Text>
        </View>

        {/* Current Plan Card */}
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planTitle}>
                {status?.is_premium ? 'Premium Plan' : 'Free Plan'}
              </Text>
              {status?.is_trial && (
                <View style={styles.trialBadge}>
                  <Text style={styles.trialText}>FREE TRIAL</Text>
                </View>
              )}
            </View>
            <Ionicons 
              name={status?.is_premium ? "diamond" : "paw"} 
              size={32} 
              color={status?.is_premium ? "#FFD700" : "#666"} 
            />
          </View>

          {status?.is_premium ? (
            <View style={styles.planDetails}>
              <Text style={styles.planDetailText}>
                {status.is_trial 
                  ? `Trial ends: ${formatDate(status.trial_ends_at)}`
                  : `Renews: ${formatDate(status.expires_at)}`
                }
              </Text>
              {status.can_cancel && (
                <TouchableOpacity 
                  style={styles.manageButton}
                  onPress={handleManageSubscription}
                >
                  <Text style={styles.manageButtonText}>Manage Subscription</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.planDetails}>
              <Text style={styles.planDetailText}>
                Upgrade to unlock all premium features
              </Text>
              <TouchableOpacity 
                style={styles.upgradeButton}
                onPress={handleSubscribe}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <LoadingSpinner size="small" color="#FFF" />
                ) : (
                  <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Premium Benefits */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Premium Benefits</Text>
          
          {premiumBenefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Ionicons 
                name="checkmark-circle" 
                size={24} 
                color={status?.is_premium ? "#4CAF50" : "#DDD"} 
              />
              <Text style={[
                styles.benefitText,
                !status?.is_premium && styles.benefitTextDisabled
              ]}>
                {benefit}
              </Text>
            </View>
          ))}
        </View>

        {/* Pricing Card */}
        {!status?.is_premium && (
          <View style={styles.pricingCard}>
            <Text style={styles.pricingTitle}>PawSpace Premium</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>$4.99</Text>
              <Text style={styles.pricePeriod}>/month</Text>
            </View>
            <Text style={styles.pricingSubtext}>Cancel anytime</Text>
            
            <TouchableOpacity 
              style={styles.subscribeButton}
              onPress={handleSubscribe}
              disabled={processingPayment}
            >
              {processingPayment ? (
                <LoadingSpinner size="small" color="#FFF" />
              ) : (
                <Text style={styles.subscribeButtonText}>
                  Start 7-day Free Trial
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          {faqItems.map((item, index) => (
            <FAQItem 
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </View>

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={refreshStatus} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({ 
  question, 
  answer 
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity 
        style={styles.faqQuestion}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.faqQuestionText}>{question}</Text>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#666" 
        />
      </TouchableOpacity>
      {expanded && (
        <Text style={styles.faqAnswer}>{answer}</Text>
      )}
    </View>
  );
};

const premiumBenefits = [
  "Unlimited transformations (vs 3/month free)",
  "No watermarks on exports",
  "Access to premium stickers and effects",
  "Featured provider listings (for providers)",
  "Advanced analytics",
  "Priority support",
  "Ad-free experience",
];

const faqItems = [
  {
    question: "How does the trial work?",
    answer: "You get 7 days of full Premium access for free. You can cancel anytime during the trial without being charged."
  },
  {
    question: "How do I cancel?",
    answer: "You can cancel anytime from this screen or through your device's subscription settings. Your Premium features will remain active until the end of your billing period."
  },
  {
    question: "Will I be charged immediately?",
    answer: "No, you won't be charged during your 7-day free trial. After the trial ends, you'll be charged $4.99/month unless you cancel."
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  planCard: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  trialBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  trialText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  planDetails: {
    marginTop: 8,
  },
  planDetailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  manageButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  manageButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  upgradeButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  upgradeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  benefitsSection: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  benefitTextDisabled: {
    color: '#999',
  },
  pricingCard: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  price: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FF6B6B',
  },
  pricePeriod: {
    fontSize: 18,
    color: '#666',
    marginLeft: 4,
  },
  pricingSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  subscribeButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  faqSection: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 12,
    marginBottom: 12,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    flex: 1,
  },
  retryButton: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SubscriptionScreen;