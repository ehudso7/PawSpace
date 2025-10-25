import * as Analytics from 'expo-firebase-analytics';

class AnalyticsService {
  logEvent(name: string, params?: object) {
    try {
      Analytics.logEvent(name, params);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  logScreenView(screenName: string) {
    try {
      Analytics.setCurrentScreen(screenName);
    } catch (error) {
      console.error('Analytics screen view error:', error);
    }
  }

  setUserId(userId: string) {
    try {
      Analytics.setUserId(userId);
    } catch (error) {
      console.error('Analytics set user ID error:', error);
    }
  }

  setUserProperty(name: string, value: string) {
    try {
      Analytics.setUserProperty(name, value);
    } catch (error) {
      console.error('Analytics set user property error:', error);
    }
  }

  // Track key events
  trackUserSignup(method: string) {
    this.logEvent('sign_up', { method });
  }

  trackBookingCreated(serviceType: string, providerId: string) {
    this.logEvent('booking_created', {
      service_type: serviceType,
      provider_id: providerId,
    });
  }

  trackTransformationPosted(petType: string) {
    this.logEvent('transformation_posted', {
      pet_type: petType,
    });
  }

  trackSubscriptionPurchased(planType: string, price: number) {
    this.logEvent('purchase', {
      currency: 'USD',
      value: price,
      item_id: planType,
    });
  }

  trackServiceViewed(serviceId: string, serviceType: string) {
    this.logEvent('view_item', {
      item_id: serviceId,
      item_category: serviceType,
    });
  }

  trackProfileViewed(profileId: string, profileType: 'user' | 'provider') {
    this.logEvent('view_profile', {
      profile_id: profileId,
      profile_type: profileType,
    });
  }

  trackSearch(searchTerm: string, category?: string) {
    this.logEvent('search', {
      search_term: searchTerm,
      category: category || 'general',
    });
  }

  trackShare(contentType: string, contentId: string) {
    this.logEvent('share', {
      content_type: contentType,
      item_id: contentId,
    });
  }

  trackLike(contentType: string, contentId: string) {
    this.logEvent('like', {
      content_type: contentType,
      item_id: contentId,
    });
  }

  trackFollow(targetUserId: string) {
    this.logEvent('follow_user', {
      target_user_id: targetUserId,
    });
  }
}

export const analyticsService = new AnalyticsService();