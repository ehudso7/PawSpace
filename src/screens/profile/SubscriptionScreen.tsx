import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscription } from '../../hooks/useSubscription';

interface SubscriptionScreenProps {
  userId: string;
}

const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ userId }) => {
  const {
    status,
    loading,
    error,
    refreshSubscription,
    createSubscription,
    cancelSubscription,
  } = useSubscription(userId);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshSubscription();
    setRefreshing(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getPlanStatus = () => {
    if (!status) return { title: 'Loading...', subtitle: '', isPremium: false };
    
    if (status.is_premium) {
      return {
        title: 'Premium Plan',
        subtitle: status.is_trial 
          ? `Trial ends ${formatDate(status.trial_ends_at)}`
          : `Expires ${formatDate(status.expires_at)}`,
        isPremium: true,
      };
    }
    
    return {
      title: 'Free Plan',
      subtitle: 'Upgrade to unlock premium features',
      isPremium: false,
    };
  };

  const planStatus = getPlanStatus();

  if (loading && !status) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading subscription...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Subscription</Text>
          <Text style={styles.subtitle}>Manage your PawSpace plan</Text>
        </View>

        {/* Current Plan Card */}
        <View style={[styles.planCard, status?.is_premium && styles.premiumCard]}>
          <View style={styles.planHeader}>
            <Text style={[styles.planTitle, status?.is_premium && styles.premiumText]}>
              {planStatus.title}
            </Text>
            {status?.is_premium && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>ACTIVE</Text>
              </View>
            )}
          </View>
          <Text style={styles.planSubtitle}>{planStatus.subtitle}</Text>
          
          {status?.is_premium && status.can_cancel && (
            <TouchableOpacity
              style={styles.manageButton}
              onPress={cancelSubscription}
              disabled={loading}
            >
              <Text style={styles.manageButtonText}>Manage Subscription</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Premium Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Premium Benefits</Text>
          
          {[
            '✓ Unlimited transformations (vs 3/month free)',
            '✓ No watermarks on exports',
            '✓ Access to premium stickers and effects',
            '✓ Featured provider listings (for providers)',
            '✓ Advanced analytics',
            '✓ Priority support',
            '✓ Ad-free experience',
          ].map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Text style={[
                styles.benefitText,
                status?.is_premium && styles.benefitActive
              ]}>
                {benefit}
              </Text>
            </View>
          ))}
        </View>

        {/* Pricing Card */}
        {!status?.is_premium && (
          <View style={styles.pricingCard}>
            <View style={styles.pricingHeader}>
              <Text style={styles.pricingTitle}>PawSpace Premium</Text>
              <Text style={styles.pricingPrice}>$4.99</Text>
              <Text style={styles.pricingPeriod}>per month</Text>
            </View>
            
            <Text style={styles.pricingSubtext}>Cancel anytime</Text>
            
            <TouchableOpacity
              style={[styles.upgradeButton, loading && styles.disabledButton]}
              onPress={createSubscription}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.upgradeButtonText}>
                  Start 7-day free trial
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          {[
            {
              question: 'How does the trial work?',
              answer: 'You get 7 days of full premium access for free. No payment required upfront. Cancel anytime during the trial with no charges.',
            },
            {
              question: 'How do I cancel?',
              answer: 'You can cancel anytime from your subscription settings. You\'ll retain premium access until the end of your billing period.',
            },
            {
              question: 'Will I be charged immediately?',
              answer: 'No! You start with a 7-day free trial. You\'ll only be charged after the trial period ends.',
            },
          ].map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            </View>
          ))}
        </View>

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={refreshSubscription}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  planCard: {
    margin: 20,
    marginTop: 10,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  premiumCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  premiumText: {
    color: '#007AFF',
  },
  premiumBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  manageButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  manageButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  benefitsSection: {
    margin: 20,
    marginTop: 10,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  benefitItem: {
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#666',
  },
  benefitActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  pricingCard: {
    margin: 20,
    marginTop: 10,
    padding: 24,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    alignItems: 'center',
  },
  pricingHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pricingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  pricingPrice: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  pricingPeriod: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  pricingSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 24,
  },
  upgradeButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  upgradeButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  faqSection: {
    margin: 20,
    marginTop: 10,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faqItem: {
    marginBottom: 20,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  errorContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderColor: '#f44336',
    borderWidth: 1,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SubscriptionScreen;