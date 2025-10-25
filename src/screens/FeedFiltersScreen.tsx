import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { feedService } from '../services/feed';
import { FeedFilter, ServiceType, FeedNavigationProps } from '../types';

interface FeedFiltersScreenProps {
  route: {
    params: {
      onApplyFilters: (filters: FeedFilter) => void;
      currentFilters?: FeedFilter;
    };
  };
  navigation: FeedNavigationProps;
}

export const FeedFiltersScreen: React.FC<FeedFiltersScreenProps> = ({
  route,
  navigation,
}) => {
  const { onApplyFilters, currentFilters = {} } = route.params;
  
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>(
    currentFilters.service_types || []
  );
  const [selectedUserTypes, setSelectedUserTypes] = useState<('user' | 'provider')[]>(
    currentFilters.user_types || []
  );
  const [showOnlyFollowing, setShowOnlyFollowing] = useState(false);
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServiceTypes();
  }, []);

  const loadServiceTypes = async () => {
    try {
      const types = await feedService.getServiceTypes();
      setServiceTypes(types);
    } catch (error) {
      console.error('Failed to load service types:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleServiceType = (serviceTypeId: string) => {
    setSelectedServiceTypes(prev => 
      prev.includes(serviceTypeId)
        ? prev.filter(id => id !== serviceTypeId)
        : [...prev, serviceTypeId]
    );
  };

  const toggleUserType = (userType: 'user' | 'provider') => {
    setSelectedUserTypes(prev => 
      prev.includes(userType)
        ? prev.filter(type => type !== userType)
        : [...prev, userType]
    );
  };

  const clearAllFilters = () => {
    setSelectedServiceTypes([]);
    setSelectedUserTypes([]);
    setShowOnlyFollowing(false);
    setShowOnlyVerified(false);
  };

  const applyFilters = () => {
    const filters: FeedFilter = {};
    
    if (selectedServiceTypes.length > 0) {
      filters.service_types = selectedServiceTypes;
    }
    
    if (selectedUserTypes.length > 0) {
      filters.user_types = selectedUserTypes;
    }
    
    // Add other filters as needed
    // if (showOnlyFollowing) filters.following_only = true;
    // if (showOnlyVerified) filters.verified_only = true;
    
    onApplyFilters(filters);
    navigation.goBack();
  };

  const hasActiveFilters = () => {
    return selectedServiceTypes.length > 0 || 
           selectedUserTypes.length > 0 || 
           showOnlyFollowing || 
           showOnlyVerified;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.headerButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Filters</Text>
        
        <TouchableOpacity
          style={styles.headerButton}
          onPress={applyFilters}
          activeOpacity={0.7}
        >
          <Text style={[styles.headerButtonText, styles.applyButtonText]}>
            Apply
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Types</Text>
          <Text style={styles.sectionSubtitle}>
            Filter by specific beauty and wellness services
          </Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading services...</Text>
            </View>
          ) : (
            <View style={styles.optionsContainer}>
              {serviceTypes.map((serviceType) => (
                <TouchableOpacity
                  key={serviceType.id}
                  style={[
                    styles.option,
                    selectedServiceTypes.includes(serviceType.id) && styles.selectedOption,
                  ]}
                  onPress={() => toggleServiceType(serviceType.id)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.serviceIcon,
                    { backgroundColor: serviceType.color || '#007AFF' }
                  ]}>
                    <Text style={styles.serviceIconText}>
                      {serviceType.icon || serviceType.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={[
                      styles.optionTitle,
                      selectedServiceTypes.includes(serviceType.id) && styles.selectedOptionTitle,
                    ]}>
                      {serviceType.name}
                    </Text>
                    <Text style={styles.optionSubtitle}>
                      {serviceType.category}
                    </Text>
                  </View>
                  <View style={[
                    styles.checkbox,
                    selectedServiceTypes.includes(serviceType.id) && styles.checkedBox,
                  ]}>
                    {selectedServiceTypes.includes(serviceType.id) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* User Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Type</Text>
          <Text style={styles.sectionSubtitle}>
            Show content from specific user types
          </Text>
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.option,
                selectedUserTypes.includes('user') && styles.selectedOption,
              ]}
              onPress={() => toggleUserType('user')}
              activeOpacity={0.7}
            >
              <View style={styles.userTypeIcon}>
                <Text style={styles.userTypeIconText}>👤</Text>
              </View>
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionTitle,
                  selectedUserTypes.includes('user') && styles.selectedOptionTitle,
                ]}>
                  Regular Users
                </Text>
                <Text style={styles.optionSubtitle}>
                  Personal transformation journeys
                </Text>
              </View>
              <View style={[
                styles.checkbox,
                selectedUserTypes.includes('user') && styles.checkedBox,
              ]}>
                {selectedUserTypes.includes('user') && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                selectedUserTypes.includes('provider') && styles.selectedOption,
              ]}
              onPress={() => toggleUserType('provider')}
              activeOpacity={0.7}
            >
              <View style={styles.userTypeIcon}>
                <Text style={styles.userTypeIconText}>⭐</Text>
              </View>
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionTitle,
                  selectedUserTypes.includes('provider') && styles.selectedOptionTitle,
                ]}>
                  Service Providers
                </Text>
                <Text style={styles.optionSubtitle}>
                  Professional transformations and tutorials
                </Text>
              </View>
              <View style={[
                styles.checkbox,
                selectedUserTypes.includes('provider') && styles.checkedBox,
              ]}>
                {selectedUserTypes.includes('provider') && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Additional Filters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Filters</Text>
          
          <View style={styles.switchContainer}>
            <View style={styles.switchOption}>
              <View>
                <Text style={styles.switchTitle}>Following Only</Text>
                <Text style={styles.switchSubtitle}>
                  Show content only from users you follow
                </Text>
              </View>
              <Switch
                value={showOnlyFollowing}
                onValueChange={setShowOnlyFollowing}
                trackColor={{ false: '#E1E1E1', true: '#007AFF' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.switchOption}>
              <View>
                <Text style={styles.switchTitle}>Verified Only</Text>
                <Text style={styles.switchSubtitle}>
                  Show content only from verified accounts
                </Text>
              </View>
              <Switch
                value={showOnlyVerified}
                onValueChange={setShowOnlyVerified}
                trackColor={{ false: '#E1E1E1', true: '#007AFF' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {hasActiveFilters() && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearAllFilters}
            activeOpacity={0.7}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.applyButton, !hasActiveFilters() && styles.disabledButton]}
          onPress={applyFilters}
          activeOpacity={0.8}
        >
          <Text style={styles.applyButtonText}>
            Apply Filters {hasActiveFilters() && `(${
              selectedServiceTypes.length + selectedUserTypes.length + 
              (showOnlyFollowing ? 1 : 0) + (showOnlyVerified ? 1 : 0)
            })`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerButtonText: {
    fontSize: 16,
    color: '#666',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  applyButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 16,
    marginBottom: 16,
    lineHeight: 20,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  optionsContainer: {
    paddingHorizontal: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F8F8F8',
  },
  selectedOption: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  userTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userTypeIconText: {
    fontSize: 20,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  selectedOptionTitle: {
    color: '#007AFF',
    fontWeight: '600',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  switchContainer: {
    paddingHorizontal: 16,
  },
  switchOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  switchSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
    backgroundColor: '#F8F8F8',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
    marginRight: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#DDD',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});