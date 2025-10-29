import { createBooking } from '../services/bookings';
import { createPaymentIntent, presentPaymentSheet } from '../services/stripe';
import { BookingData, CreateBookingData } from '../types/booking.types';

// Mock data for testing
const mockBookingData: BookingData = {
  service: {
    id: 'service-1',
    title: 'Dog Grooming',
    description: 'Professional dog grooming service',
    duration: 120,
    price: 75,
    category: 'Grooming',
    providerId: 'provider-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  provider: {
    id: 'provider-1',
    userId: 'user-1',
    name: 'Paws & Claws Grooming',
    title: 'Professional Pet Groomer',
    description: 'Experienced pet grooming services',
    avatar: 'https://example.com/avatar.jpg',
    rating: 4.8,
    reviewCount: 150,
    location: '123 Main St, City, State 12345',
    startingPrice: 50,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    total_bookings: 150,
    services: [],
    business_hours: {},
    portfolio_items: [],
    service_types: ['Grooming'],
  },
  pet: {
    id: 'pet-1',
    name: 'Buddy',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 3,
    weight: 30,
    ownerId: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  date: '2024-01-15',
  time: '10:00',
  location: {
    address: '123 Main St',
    city: 'City',
    state: 'State',
    zip_code: '12345',
    latitude: 40.7128,
    longitude: -74.0060,
  },
  notes: 'Please be gentle with my dog',
};

const mockCreateBookingData: CreateBookingData = {
  serviceId: 'service-1',
  providerId: 'provider-1',
  petId: 'pet-1',
  date: '2024-01-15',
  time: '10:00',
  location: {
    address: '123 Main St',
    city: 'City',
    state: 'State',
    zip_code: '12345',
    latitude: 40.7128,
    longitude: -74.0060,
  },
  notes: 'Please be gentle with my dog',
};

// Mock fetch for testing
global.fetch = jest.fn();

describe('Booking Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Payment Intent Creation', () => {
    it('should create payment intent successfully', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          paymentIntent: {
            id: 'pi_1234567890',
            client_secret: 'pi_1234567890_secret_abc123',
            amount: 5500, // $55.00 in cents
            currency: 'usd',
            status: 'requires_payment_method',
          },
        }),
      };

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await createPaymentIntent(55, mockBookingData);

      expect(fetch).toHaveBeenCalledWith('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-auth-token',
        },
        body: JSON.stringify({
          amount: 5500,
          currency: 'usd',
          metadata: {
            service_id: 'service-1',
            provider_id: 'provider-1',
            appointment_time: '2024-01-15T10:00:00Z',
            pet_id: 'pet-1',
          },
        }),
      });

      expect(result).toEqual({
        id: 'pi_1234567890',
        client_secret: 'pi_1234567890_secret_abc123',
        amount: 5500,
        currency: 'usd',
        status: 'requires_payment_method',
      });
    });

    it('should handle payment intent creation errors', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: async () => ({
          message: 'Invalid amount',
          code: 'INVALID_AMOUNT',
        }),
      };

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      await expect(createPaymentIntent(-10, mockBookingData)).rejects.toThrow();
    });
  });

  describe('Payment Sheet Presentation', () => {
    it('should present payment sheet successfully', async () => {
      const mockPaymentIntent = {
        id: 'pi_1234567890',
        client_secret: 'pi_1234567890_secret_abc123',
        amount: 5500,
        currency: 'usd',
        status: 'requires_payment_method',
      };

      // Mock the Stripe presentPaymentSheet function
      const mockPresentPaymentSheet = jest.fn().mockResolvedValue({ error: null });
      
      // This would need to be properly mocked in a real test environment
      jest.doMock('@stripe/stripe-react-native', () => ({
        presentPaymentSheet: mockPresentPaymentSheet,
      }));

      const result = await presentPaymentSheet(mockPaymentIntent);

      expect(result).toEqual({
        success: true,
        payment_intent_id: 'pi_1234567890',
      });
    });

    it('should handle payment sheet errors', async () => {
      const mockPaymentIntent = {
        id: 'pi_1234567890',
        client_secret: 'pi_1234567890_secret_abc123',
        amount: 5500,
        currency: 'usd',
        status: 'requires_payment_method',
      };

      // Mock the Stripe presentPaymentSheet function to return an error
      const mockPresentPaymentSheet = jest.fn().mockResolvedValue({
        error: { message: 'Card declined' },
      });

      jest.doMock('@stripe/stripe-react-native', () => ({
        presentPaymentSheet: mockPresentPaymentSheet,
      }));

      const result = await presentPaymentSheet(mockPaymentIntent);

      expect(result).toEqual({
        success: false,
        error: 'Card declined',
      });
    });
  });

  describe('Booking Creation', () => {
    it('should create booking successfully', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          id: 'booking-123',
          service_id: 'service-1',
          appointment_time: '2024-01-15T10:00:00Z',
          status: 'confirmed',
          total_price: 50,
          platform_fee: 5,
          payment_intent_id: 'pi_1234567890',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        }),
      };

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await createBooking(mockCreateBookingData);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-auth-token',
        },
        body: JSON.stringify(mockCreateBookingData),
      });

      expect(result).toEqual({
        id: 'booking-123',
        service_id: 'service-1',
        appointment_time: '2024-01-15T10:00:00Z',
        status: 'confirmed',
        total_price: 50,
        platform_fee: 5,
        payment_intent_id: 'pi_1234567890',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      });
    });

    it('should handle booking creation errors', async () => {
      const mockResponse = {
        ok: false,
        status: 409,
        json: async () => ({
          message: 'Time slot not available',
          code: 'SLOT_UNAVAILABLE',
        }),
      };

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      await expect(createBooking(mockCreateBookingData)).rejects.toThrow();
    });
  });

  describe('Complete Booking Flow', () => {
    it('should complete full booking flow successfully', async () => {
      // Mock payment intent creation
      const mockPaymentIntentResponse = {
        ok: true,
        json: async () => ({
          paymentIntent: {
            id: 'pi_1234567890',
            client_secret: 'pi_1234567890_secret_abc123',
            amount: 5500,
            currency: 'usd',
            status: 'requires_payment_method',
          },
        }),
      };

      // Mock booking creation
      const mockBookingResponse = {
        ok: true,
        json: async () => ({
          id: 'booking-123',
          service_id: 'service-1',
          appointment_time: '2024-01-15T10:00:00Z',
          status: 'confirmed',
          total_price: 50,
          platform_fee: 5,
          payment_intent_id: 'pi_1234567890',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        }),
      };

      (fetch as jest.Mock)
        .mockResolvedValueOnce(mockPaymentIntentResponse)
        .mockResolvedValueOnce(mockBookingResponse);

      // Mock successful payment sheet
      const mockPresentPaymentSheet = jest.fn().mockResolvedValue({ error: null });
      jest.doMock('@stripe/stripe-react-native', () => ({
        presentPaymentSheet: mockPresentPaymentSheet,
      }));

      // Execute the flow
      const paymentIntent = await createPaymentIntent(55, mockBookingData);
      const paymentResult = await presentPaymentSheet(paymentIntent);
      
      expect(paymentResult.success).toBe(true);
      
      if (paymentResult.success) {
        const booking = await createBooking({
          ...mockCreateBookingData,
          payment_method_id: paymentResult.payment_intent_id!,
        });
        
        expect(booking.id).toBe('booking-123');
        expect(booking.status).toBe('confirmed');
      }
    });
  });
});

// Integration test helpers
export const testBookingFlow = async (bookingData: BookingData) => {
  try {
    // Step 1: Create payment intent
    const paymentIntent = await createPaymentIntent(
      bookingData.total_price + bookingData.platform_fee,
      bookingData
    );

    // Step 2: Present payment sheet
    const paymentResult = await presentPaymentSheet(paymentIntent);

    if (!paymentResult.success) {
      throw new Error(`Payment failed: ${paymentResult.error}`);
    }

    // Step 3: Create booking
    const booking = await createBooking({
      service_id: bookingData.service.id,
      appointment_time: bookingData.appointment_time,
      pet_id: bookingData.pet_id,
      notes: bookingData.notes,
      payment_method_id: paymentResult.payment_intent_id!,
    });

    return {
      success: true,
      booking,
      payment_intent_id: paymentResult.payment_intent_id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};