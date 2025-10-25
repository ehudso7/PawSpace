import * as Analytics from 'expo-firebase-analytics';

type EventName = 
  | 'user_signup'
  | 'user_login'
  | 'booking_created'
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'transformation_posted'
  | 'transformation_liked'
  | 'transformation_commented'
  | 'subscription_purchased'
  | 'subscription_cancelled'
  | 'service_viewed'
  | 'profile_viewed'
  | 'search_performed'
  | 'filter_applied'
  | 'follow_user'
  | 'unfollow_user'
  | 'pet_added'
  | 'pet_edited';

type UserProperty = 
  | 'user_type'
  | 'subscription_tier'
  | 'pet_count'
  | 'location'
  | 'signup_date';

class AnalyticsService {
  private isEnabled: boolean = true;

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    Analytics.setAnalyticsCollectionEnabled(enabled);
  }

  logEvent(name: EventName, params?: Record<string, any>) {
    if (!this.isEnabled) return;
    
    try {
      Analytics.logEvent(name, params);
      console.log(`Analytics event: ${name}`, params);
    } catch (error) {
      console.error('Error logging analytics event:', error);
    }
  }
  
  logScreenView(screenName: string, screenClass?: string) {
    if (!this.isEnabled) return;
    
    try {
      Analytics.setCurrentScreen(screenName, screenClass);
      console.log(`Screen view: ${screenName}`);
    } catch (error) {
      console.error('Error logging screen view:', error);
    }
  }
  
  setUserId(userId: string) {
    if (!this.isEnabled) return;
    
    try {
      Analytics.setUserId(userId);
    } catch (error) {
      console.error('Error setting user ID:', error);
    }
  }
  
  setUserProperty(name: UserProperty, value: string) {
    if (!this.isEnabled) return;
    
    try {
      Analytics.setUserProperty(name, value);
    } catch (error) {
      console.error('Error setting user property:', error);
    }
  }

  // Track key app events
  trackSignup(method: 'email' | 'google' | 'apple', userType: 'pet_owner' | 'provider') {
    this.logEvent('user_signup', { method, user_type: userType });
  }

  trackLogin(method: 'email' | 'google' | 'apple') {
    this.logEvent('user_login', { method });
  }

  trackBookingCreated(serviceId: string, providerId: string, price: number) {
    this.logEvent('booking_created', {
      service_id: serviceId,
      provider_id: providerId,
      price,
    });
  }

  trackTransformationPosted(postId: string, hasBeforePhoto: boolean, hasAfterPhoto: boolean) {
    this.logEvent('transformation_posted', {
      post_id: postId,
      has_before_photo: hasBeforePhoto,
      has_after_photo: hasAfterPhoto,
    });
  }

  trackSubscriptionPurchased(tier: string, price: number, period: 'monthly' | 'yearly') {
    this.logEvent('subscription_purchased', {
      tier,
      price,
      period,
    });
  }

  trackServiceViewed(serviceId: string, serviceType: string, providerId: string) {
    this.logEvent('service_viewed', {
      service_id: serviceId,
      service_type: serviceType,
      provider_id: providerId,
    });
  }

  trackSearch(query: string, filters?: Record<string, any>) {
    this.logEvent('search_performed', {
      query,
      ...filters,
    });
  }

  trackProfileView(userId: string, isOwnProfile: boolean) {
    this.logEvent('profile_viewed', {
      user_id: userId,
      is_own_profile: isOwnProfile,
    });
  }
}

export const analyticsService = new AnalyticsService();
export type { EventName, UserProperty };
