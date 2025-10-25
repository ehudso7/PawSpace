# Quick Reference Guide

## 🚀 Getting Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install react-native-calendars
```

### 2. Import Components
```typescript
import { ProviderProfileScreen } from './src/screens/booking/ProviderProfileScreen';
import { BookingCalendarScreen } from './src/screens/booking/BookingCalendarScreen';
```

### 3. Use in Your App
```typescript
// Show provider profile
<ProviderProfileScreen
  providerId="abc123"
  onBookService={(service) => {
    // Navigate to calendar
  }}
/>

// Show booking calendar
<BookingCalendarScreen
  providerId="abc123"
  providerName="Sarah Johnson"
  service={selectedService}
  onContinue={(bookingDetails) => {
    // Confirm booking
  }}
/>
```

---

## 📁 File Locations

| What | Where |
|------|-------|
| Provider Profile Screen | `src/screens/booking/ProviderProfileScreen.tsx` |
| Booking Calendar Screen | `src/screens/booking/BookingCalendarScreen.tsx` |
| Calendar Component | `src/components/booking/CalendarView.tsx` |
| Time Slot Picker | `src/components/booking/TimeSlotPicker.tsx` |
| Booking Service | `src/services/bookings.service.ts` |
| Type Definitions | `src/types/booking.types.ts` |
| Example App | `App.tsx` |
| Advanced Examples | `examples/AdvancedUsage.tsx` |

---

## 🎨 Key Features

### Provider Profile
- ✅ Parallax header with cover photo
- ✅ 4 tabs: About, Services, Portfolio, Reviews
- ✅ Service selector modal
- ✅ Sticky "Book Service" button

### Booking Calendar
- ✅ Month calendar with availability colors
- ✅ Time slot picker (30-min intervals)
- ✅ Booking summary card
- ✅ Step-by-step booking flow

---

## 🔧 Main Service Methods

```typescript
// Get provider profile
const profile = await getProviderProfile(providerId);

// Get monthly availability
const availability = await getProviderAvailability(providerId, '2024-12');

// Get time slots for a date
const slots = await getTimeSlots(providerId, '2024-12-15', 60);

// Check specific slot
const isAvailable = await checkSlotAvailability(providerId, startTime, 60);

// Create booking
const result = await createBooking(bookingDetails);
```

---

## 🎯 Common Tasks

### Change Primary Color
Find and replace `#6200EE` in StyleSheet objects

### Change Time Slot Interval
Edit `slotInterval` in `bookings.service.ts` (line ~133)

### Add Map to Profile
Replace map placeholder in ProviderProfileScreen's About tab

### Customize Business Hours
Modify `business_hours` object in provider data

### Add More Tabs
Add tab to `TabType` and create render function

---

## 📊 Data Flow

```
User selects provider
    ↓
ProviderProfileScreen
    ↓ (loads profile)
getProviderProfile()
    ↓
User selects service
    ↓
BookingCalendarScreen
    ↓ (loads availability)
getProviderAvailability()
    ↓
User selects date
    ↓ (loads time slots)
getTimeSlots()
    ↓
User selects time
    ↓
BookingDetails created
    ↓
onContinue callback
    ↓
Confirmation screen
```

---

## 🐛 Quick Debugging

### Calendar not showing?
- Check `react-native-calendars` is installed
- Verify `providerId` is valid
- Check console for errors

### Times slots empty?
- Verify `selectedDate` is set
- Check `serviceDuration` is valid number
- Look at business hours for that day

### Images not loading?
- Verify URLs are valid
- Check network permissions
- Test with placeholder URLs

### Animations stuttering?
- Use `useNativeDriver: true`
- Reduce animation complexity
- Test on physical device

---

## 📱 Component Props Quick Reference

### ProviderProfileScreen
- `providerId: string` ⚡ Required
- `onBookService: (service) => void` ⚡ Required
- `onMessage?: () => void`
- `onShare?: () => void`

### BookingCalendarScreen
- `providerId: string` ⚡ Required
- `providerName: string` ⚡ Required
- `service: Service` ⚡ Required
- `onContinue: (details) => void` ⚡ Required
- `onBack?: () => void`

### CalendarView
- `providerId: string` ⚡ Required
- `onDateSelect: (date) => void` ⚡ Required
- `selectedDate?: string`

### TimeSlotPicker
- `providerId: string` ⚡ Required
- `selectedDate: string` ⚡ Required
- `serviceDuration: number` ⚡ Required
- `onSlotSelect: (slot) => void` ⚡ Required
- `selectedSlot?: TimeSlot`

---

## 🎨 Color Legend

| Color | Purpose | Where |
|-------|---------|-------|
| `#6200EE` | Primary (buttons, highlights) | Throughout |
| `#2E7D32` | Success (prices, available) | Prices, badges |
| `#D32F2F` | Error (unavailable, errors) | Error states |
| `#FFB300` | Warning (stars, few slots) | Ratings, calendar |
| `#E8F5E9` | Success light (many slots) | Calendar dates |
| `#FFF9C4` | Warning light (few slots) | Calendar dates |
| `#F5F5F5` | Surface (cards, disabled) | Backgrounds |
| `#666666` | Secondary text | Descriptions |

---

## 📚 Documentation Files

- **README.md** - Complete documentation
- **INTEGRATION_GUIDE.md** - Step-by-step integration
- **IMPLEMENTATION_SUMMARY.md** - What's been built
- **QUICK_REFERENCE.md** - This file!

---

## 🔗 Useful Links

### Dependencies
- [react-native-calendars](https://github.com/wix/react-native-calendars)
- [Supabase](https://supabase.com/docs)
- [React Navigation](https://reactnavigation.org/)

### Documentation
- See `README.md` for full API docs
- See `INTEGRATION_GUIDE.md` for database setup
- See `examples/AdvancedUsage.tsx` for patterns

---

## ⚡ Performance Tips

1. Use `useMemo` for expensive calculations
2. Use `useCallback` for event handlers
3. Enable `useNativeDriver` for animations
4. Implement pagination for long lists
5. Optimize images (use WebP format)
6. Lazy load portfolio images
7. Cache API responses

---

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Copy files to your project
3. ⏭️ Set up Supabase (see INTEGRATION_GUIDE.md)
4. ⏭️ Replace mock data with real queries
5. ⏭️ Add authentication
6. ⏭️ Test on devices
7. ⏭️ Deploy!

---

## 🆘 Need Help?

1. Check inline code comments
2. Review example in `App.tsx`
3. See advanced patterns in `examples/`
4. Read full docs in `README.md`
5. Check integration steps in `INTEGRATION_GUIDE.md`

---

**Happy Coding! 🚀**
