import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@/types/navigation';
import { Button, Card } from '@/components/common';
import { theme } from '@/constants/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Subscription'>;

const SubscriptionScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Basic pet care services',
        'Limited transformations',
        'Community access',
        'Basic support',
      ],
      limitations: [
        '5 transformations per month',
        'Basic service listings',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$9.99',
      period: 'per month',
      features: [
        'Unlimited transformations',
        'Priority booking',
        'Advanced filters',
        'Premium support',
        'Exclusive content',
        'No ads',
      ],
      popular: true,
    },
  ];

  const handleSelectPlan = (planId: 'free' | 'premium') => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    if (selectedPlan === 'free') {
      Alert.alert('Free Plan', 'You are already on the free plan!');
      return;
    }

    Alert.alert(
      'Subscribe to Premium',
      'This will redirect you to the payment screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => {
          // Implement payment flow
          Alert.alert('Payment', 'Payment integration would go here.');
        }},
      ]
    );
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your premium subscription?',
      [
        { text: 'Keep Premium', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: () => {
          Alert.alert('Cancelled', 'Your subscription has been cancelled.');
        }},
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Subscription</Text>
        <Text style={styles.subtitle}>Choose the plan that's right for you</Text>
      </View>

      <View style={styles.plans}>
        {plans.map((plan) => (
          <Card
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.selectedPlan,
              plan.popular && styles.popularPlan,
            ]}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Most Popular</Text>
              </View>
            )}

            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <View style={styles.planPrice}>
                <Text style={styles.price}>{plan.price}</Text>
                <Text style={styles.period}>{plan.period}</Text>
              </View>
            </View>

            <View style={styles.features}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.feature}>
                  <Text style={styles.featureText}>✓ {feature}</Text>
                </View>
              ))}
            </View>

            {plan.limitations && (
              <View style={styles.limitations}>
                <Text style={styles.limitationsTitle}>Limitations:</Text>
                {plan.limitations.map((limitation, index) => (
                  <Text key={index} style={styles.limitationText}>
                    • {limitation}
                  </Text>
                ))}
              </View>
            )}

            <Button
              title={selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
              onPress={() => handleSelectPlan(plan.id as 'free' | 'premium')}
              variant={selectedPlan === plan.id ? 'primary' : 'outline'}
              style={styles.selectButton}
            />
          </Card>
        ))}
      </View>

      <View style={styles.actions}>
        <Button
          title="Subscribe"
          onPress={handleSubscribe}
          style={styles.subscribeButton}
        />
        
        {selectedPlan === 'premium' && (
          <Button
            title="Cancel Subscription"
            onPress={handleCancelSubscription}
            variant="outline"
            style={styles.cancelButton}
          />
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          All plans include access to our community and basic features.
          Premium features are available with a paid subscription.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fonts['3xl'],
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fonts.lg,
    color: theme.colors.textSecondary,
  },
  plans: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  planCard: {
    position: 'relative',
    padding: theme.spacing.lg,
  },
  selectedPlan: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  popularPlan: {
    borderColor: theme.colors.secondary,
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  popularText: {
    color: theme.colors.white,
    fontSize: theme.fonts.sm,
    fontWeight: '600',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  planName: {
    fontSize: theme.fonts.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  planPrice: {
    alignItems: 'center',
  },
  price: {
    fontSize: theme.fonts['3xl'],
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  period: {
    fontSize: theme.fonts.sm,
    color: theme.colors.textSecondary,
  },
  features: {
    marginBottom: theme.spacing.lg,
  },
  feature: {
    marginBottom: theme.spacing.sm,
  },
  featureText: {
    fontSize: theme.fonts.md,
    color: theme.colors.text,
  },
  limitations: {
    marginBottom: theme.spacing.lg,
  },
  limitationsTitle: {
    fontSize: theme.fonts.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  limitationText: {
    fontSize: theme.fonts.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  selectButton: {
    marginTop: theme.spacing.md,
  },
  actions: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  subscribeButton: {
    marginBottom: theme.spacing.sm,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
  footer: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  footerText: {
    fontSize: theme.fonts.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SubscriptionScreen;