import * as Analytics from 'expo-firebase-analytics';

class AnalyticsService {
  private static instance: AnalyticsService;

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

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
  logUserSignup(userType: 'pet_owner' | 'provider') {
    this.logEvent('user_signup', {
      user_type: userType,
      timestamp: new Date().toISOString(),
    });
  }

  logBookingCreated(bookingId: string, serviceType: string, providerId: string) {
    this.logEvent('booking_created', {
      booking_id: bookingId,
      service_type: serviceType,
      provider_id: providerId,
      timestamp: new Date().toISOString(),
    });
  }

  logTransformationPosted(transformationId: string, serviceType: string) {
    this.logEvent('transformation_posted', {
      transformation_id: transformationId,
      service_type: serviceType,
      timestamp: new Date().toISOString(),
    });
  }

  logSubscriptionPurchased(planType: string, amount: number) {
    this.logEvent('subscription_purchased', {
      plan_type: planType,
      amount: amount,
      currency: 'USD',
      timestamp: new Date().toISOString(),
    });
  }

  logServiceViewed(serviceId: string, serviceType: string, providerId: string) {
    this.logEvent('service_viewed', {
      service_id: serviceId,
      service_type: serviceType,
      provider_id: providerId,
      timestamp: new Date().toISOString(),
    });
  }

  logProfileView(profileId: string, userType: 'pet_owner' | 'provider') {
    this.logEvent('profile_viewed', {
      profile_id: profileId,
      user_type: userType,
      timestamp: new Date().toISOString(),
    });
  }

  logPetAdded(petId: string, species: string) {
    this.logEvent('pet_added', {
      pet_id: petId,
      species: species,
      timestamp: new Date().toISOString(),
    });
  }

  logSearchPerformed(query: string, category: string) {
    this.logEvent('search_performed', {
      search_query: query,
      category: category,
      timestamp: new Date().toISOString(),
    });
  }
}

export default AnalyticsService;