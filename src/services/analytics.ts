import * as Analytics from 'expo-firebase-analytics';
import { AnalyticsEvent } from '../types';

class AnalyticsService {
  async initialize() {
    // Analytics is automatically initialized with Firebase
    // No additional setup needed for Expo Firebase Analytics
  }
  
  logEvent(name: string, params?: object) {
    Analytics.logEvent(name, params);
  }
  
  logScreenView(screenName: string) {
    Analytics.setCurrentScreen(screenName);
  }
  
  setUserId(userId: string) {
    Analytics.setUserId(userId);
  }
  
  setUserProperty(name: string, value: string) {
    Analytics.setUserProperty(name, value);
  }
  
  // Track key events
  logUserSignup(userType: 'pet_owner' | 'provider') {
    this.logEvent('user_signup', {
      user_type: userType,
      timestamp: new Date().toISOString(),
    });
  }
  
  logBookingCreated(bookingId: string, serviceType: string, price: number) {
    this.logEvent('booking_created', {
      booking_id: bookingId,
      service_type: serviceType,
      price: price,
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
  
  logSubscriptionPurchased(subscriptionType: string, price: number) {
    this.logEvent('subscription_purchased', {
      subscription_type: subscriptionType,
      price: price,
      timestamp: new Date().toISOString(),
    });
  }
  
  logServiceViewed(serviceType: string, providerId: string) {
    this.logEvent('service_viewed', {
      service_type: serviceType,
      provider_id: providerId,
      timestamp: new Date().toISOString(),
    });
  }
  
  logProfileView(viewedUserId: string, viewerUserId: string) {
    this.logEvent('profile_viewed', {
      viewed_user_id: viewedUserId,
      viewer_user_id: viewerUserId,
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
  
  logSearchPerformed(searchTerm: string, filters: any) {
    this.logEvent('search_performed', {
      search_term: searchTerm,
      filters: JSON.stringify(filters),
      timestamp: new Date().toISOString(),
    });
  }
  
  logError(error: string, context: string) {
    this.logEvent('error_occurred', {
      error_message: error,
      context: context,
      timestamp: new Date().toISOString(),
    });
  }
}

export const analyticsService = new AnalyticsService();
