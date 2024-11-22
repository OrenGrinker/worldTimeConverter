# World Time Converter

A comprehensive TypeScript package for handling worldwide time conversions, business hours calculations, and timezone management.

## Installation

```bash
npm install world-time-converter
```

## Features

- Get current time for any city worldwide
- Convert timestamps between cities
- Compare times between cities
- Calculate working hours overlap
- Manage holidays and business days
- Get timezone differences
- Format times with locale support

## Usage Examples

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

// Convert time between cities
const timestamp = '2024-03-15T14:30:00Z';
const tokyoTime = WorldTimeConverter.convertTime(
  timestamp,
  'London',
  'Tokyo'
);
console.log(tokyoTime);
/* Output:
{
  cityName: 'Tokyo',
  timezone: 'Asia/Tokyo',
  localTime: '23:30:00',
  utcOffset: '+09:00',
  date: '2024-03-15',
  ...
}
*/
```

### Comparing Times Between Cities

```typescript
// Compare times between two cities
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

// Get timezone difference
const difference = WorldTimeConverter.getTimezoneDifference('London', 'Tokyo');
console.log(difference);
/* Output:
{
  hours: 8,
  minutes: 0,
  isAhead: true,
  formattedDifference: '8h 0m'
}
*/
```

### Working Hours and Business Days

```typescript
// Find working hours overlap
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
console.log(overlap);
/* Output:
{
  startTime: '09:00',
  endTime: '17:00',
  overlapDuration: { hours: 2, minutes: 0 },
  hasOverlap: true,
  overlapStartCity1: '09:00',
  overlapEndCity1: '11:00',
  overlapStartCity2: '17:00',
  overlapEndCity2: '19:00',
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
}
*/

// Get next business day
const nextBusinessDay = WorldTimeConverter.getNextBusinessDay('London', true, true);
console.log(nextBusinessDay);
/* Output:
{
  cityName: 'London',
  date: '2024-03-18', // Next Monday if current day is Friday
  ...
}
*/

// Calculate business days between dates
const businessDays = WorldTimeConverter.getBusinessDaysBetween(
  'London',
  '2024-03-01',
  '2024-03-15',
  true  // Skip holidays
);
console.log(businessDays); // Output: 11
```

### Holiday Management

```typescript
// Add a holiday
const holiday = {
  name: 'Christmas Day',
  date: '2024-12-25',
  recurring: true,
  type: 'public'
};

WorldTimeConverter.addHoliday('London', holiday);

// Check if a date is a holiday
const isHoliday = WorldTimeConverter.isHoliday('London', moment('2024-12-25'));
console.log(isHoliday); // Output: true

// Get all holidays for a city
const holidays = WorldTimeConverter.getHolidays('London');
console.log(holidays);
/* Output:
[
  {
    name: 'Christmas Day',
    date: '2024-12-25',
    recurring: true,
    type: 'public'
  }
]
*/
```

### Timezone Information

```typescript
// Get city timezone information
const cityInfo = WorldTimeConverter.getCityInfo('London');
console.log(cityInfo);
/* Output:
{
  cityName: 'London',
  timezone: 'Europe/London',
  currentOffset: '+01:00',
  isDST: true,
  dstStart: 'BST',
  region: 'Europe',
  subregion: 'London'
}
*/

// Get all available timezones
const timezones = WorldTimeConverter.getAvailableTimezones();
console.log(timezones);
/* Output:
[
  {
    city: 'London',
    timezone: 'Europe/London',
    info: { ... }
  },
  ...
]
*/
```

### Locale and Format Support

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

## Types

### TimeResult
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
```

### BusinessHours
```typescript
interface BusinessHours {
  start: string;     // Format: HH:mm
  end: string;       // Format: HH:mm
  timezone: string;
}
```

### HolidayDefinition
```typescript
interface HolidayDefinition {
  name: string;
  date: string;      // Format: YYYY-MM-DD
  recurring: boolean;
  type: string;
}
```

## Error Handling

The package throws errors for various scenarios:

```typescript
try {
  WorldTimeConverter.getCurrentTime('InvalidCity');
} catch (error) {
  console.error(error.message); // "Invalid city name: InvalidCity"
}

try {
  WorldTimeConverter.convertTime('invalid-date', 'London', 'Tokyo');
} catch (error) {
  console.error(error.message); // "Invalid city name or timestamp"
}
```

## Best Practices

1. Always use valid city names from the moment-timezone database
2. Use proper time formats:
   - HH:mm for time (24-hour format)
   - YYYY-MM-DD for dates
3. Consider DST when working with dates across different seasons
4. Always handle potential errors with try-catch blocks

## Performance Considerations

1. Cache timezone information for frequently used cities
2. Batch timezone conversions when possible
3. Use Unix timestamps for precise calculations
4. Consider using the `epoch` property for time comparisons

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## License

MIT

## Credits

This package uses [Moment.js](https://momentjs.com/) and [Moment Timezone](https://momentjs.com/timezone/) for timezone calculations.