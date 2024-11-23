# World Time Converter

![npm Version](https://img.shields.io/npm/v/world-time-converter)
![TypeScript](https://img.shields.io/npm/types/world-time-converter)
![License](https://img.shields.io/npm/l/world-time-converter)
![Downloads](https://img.shields.io/npm/dm/world-time-converter)
![Node Version](https://img.shields.io/node/v/world-time-converter)

A powerful TypeScript library for handling worldwide time conversions, business hours calculations, and timezone management. Perfect for applications dealing with international time coordination, business hours overlap, and holiday scheduling.

## 🌟 Key Features

- 🌍 **Global Timezone Support**: Convert times between any cities worldwide
- 💼 **Business Hours Management**: Calculate working hours overlap across timezones
- 📅 **Holiday Handling**: Manage holidays and business days
- ⚡ **DST Aware**: Automatic handling of Daylight Saving Time transitions
- 🔍 **Type Safety**: Full TypeScript support with comprehensive type definitions
- 🌐 **Locale Support**: Format dates and times according to different locales

## 📦 Installation

```bash
npm install world-time-converter
```

## 🚀 Quick Start

### Basic Time Operations

```typescript
import { WorldTimeConverter } from 'world-time-converter';

// Get current time for a city
const londonTime = WorldTimeConverter.getCurrentTime('London');
console.log(londonTime);
/* Output:
{
  cityName: 'London',
  timezone: 'Europe/London',
  localTime: '14:30:45',
  utcOffset: '+01:00',
  date: '2024-03-15',
  dayOfWeek: 'Friday',
  isDST: true,
  epoch: 1710510645,
  iso8601: '2024-03-15T14:30:45.000Z',
  formattedDateTime: 'Friday, March 15, 2024 2:30 PM'
}
*/

// Convert between cities
const tokyoTime = WorldTimeConverter.convertTime(
  '2024-03-15T14:30:00Z',
  'London',
  'Tokyo'
);
```

## 💡 Advanced Usage

### 🕒 Time Comparison

```typescript
// Compare times between cities
const comparison = WorldTimeConverter.compareTimeBetweenCities('London', 'Tokyo');
console.log(comparison);
/* Output:
{
  city1: { cityName: 'London', ... },
  city2: { cityName: 'Tokyo', ... },
  timeDifference: { hours: 8, minutes: 0 },
  isSameDay: false,
  hoursDifference: 8,
  minutesDifference: 0
}
*/
```

### 💼 Business Hours Management

```typescript
const businessHours1 = {
  start: '09:00',
  end: '17:00',
  timezone: 'Europe/London'
};

const businessHours2 = {
  start: '09:00',
  end: '17:00',
  timezone: 'Asia/Tokyo'
};

const overlap = WorldTimeConverter.findWorkingHoursOverlap(
  'London',
  'Tokyo',
  businessHours1,
  businessHours2
);

// Calculate business days
const businessDays = WorldTimeConverter.getBusinessDaysBetween(
  'London',
  '2024-03-01',
  '2024-03-15',
  true  // Skip holidays
);
```

### 📅 Holiday Management

```typescript
// Add a holiday
const holiday = {
  name: 'Christmas Day',
  date: '2024-12-25',
  recurring: true,
  type: 'public'
};

WorldTimeConverter.addHoliday('London', holiday);

// Check if date is holiday
const isHoliday = WorldTimeConverter.isHoliday('London', '2024-12-25');
```

### 🌐 Locale Support

```typescript
// Format time with specific locale
const formattedTime = WorldTimeConverter.formatTimeWithLocale(
  'Paris',
  'fr',
  'LLLL'
);
console.log(formattedTime);
// Output: 'vendredi 15 mars 2024 14:30'
```

## 📋 Type Definitions

```typescript
interface TimeResult {
  cityName: string;
  timezone: string;
  localTime: string;
  utcOffset: string;
  date: string;
  dayOfWeek: string;
  isDST: boolean;
  epoch: number;
  iso8601: string;
  formattedDateTime: string;
}

interface BusinessHours {
  start: string;     // Format: HH:mm
  end: string;       // Format: HH:mm
  timezone: string;
}

interface HolidayDefinition {
  name: string;
  date: string;      // Format: YYYY-MM-DD
  recurring: boolean;
  type: string;
}

interface TimezoneInfo {
  cityName: string;
  timezone: string;
  currentOffset: string;
  isDST: boolean;
  dstStart: string;
  region: string;
  subregion: string;
}
```

## 🔍 Error Handling

```typescript
try {
  const time = WorldTimeConverter.getCurrentTime('InvalidCity');
} catch (error) {
  if (error instanceof InvalidCityError) {
    console.error('Invalid city:', error.message);
  } else if (error instanceof InvalidTimeFormatError) {
    console.error('Invalid time format:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## 🚀 Best Practices

1. Always use valid city names from the moment-timezone database
2. Use proper time formats:
   - HH:mm for time (24-hour format)
   - YYYY-MM-DD for dates
3. Consider DST when working with dates across different seasons
4. Handle timezone edge cases (e.g., DST transitions)
5. Cache timezone information for frequently used cities
6. Use Unix timestamps for precise calculations

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Build the project
npm run build

# Lint the code
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -am 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

For support, please [open an issue](https://github.com/yourusername/world-time-converter/issues/new) on GitHub.

## 🙏 Credits

This package uses [Moment.js](https://momentjs.com/) and [Moment Timezone](https://momentjs.com/timezone/) for timezone calculations.