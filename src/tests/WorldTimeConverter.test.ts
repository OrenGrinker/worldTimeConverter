// src/__tests__/WorldTimeConverter.test.ts
import { WorldTimeConverter } from '../WorldTimeConverter';
import moment from 'moment-timezone';
import { BusinessHours, HolidayDefinition } from '../types';

describe('WorldTimeConverter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the holidays map
    WorldTimeConverter['holidays'] = new Map();
  });

  describe('getCurrentTime', () => {
    it('should return correct time format for a valid city', () => {
      const result = WorldTimeConverter.getCurrentTime('London');
      
      expect(result).toMatchObject({
        cityName: 'London',
        timezone: expect.stringContaining('London'),
        localTime: expect.stringMatching(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/),
        utcOffset: expect.stringMatching(/^[+-]\d{2}:?\d{2}$/),
        date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        dayOfWeek: expect.any(String),
        isDST: expect.any(Boolean),
        epoch: expect.any(Number),
        iso8601: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
      });
    });

    it('should throw error for invalid city', () => {
      expect(() => {
        WorldTimeConverter.getCurrentTime('InvalidCity');
      }).toThrow('Invalid city name: InvalidCity');
    });
  });

  describe('convertTime', () => {
    it('should convert time between cities correctly', () => {
      const timestamp = '2024-01-01T12:00:00Z';
      const result = WorldTimeConverter.convertTime(timestamp, 'London', 'Tokyo');

      expect(result).toMatchObject({
        cityName: 'Tokyo',
        timezone: expect.stringContaining('Tokyo'),
        localTime: expect.stringMatching(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/),
        date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/)
      });
    });

    it('should handle unix timestamp input', () => {
      const timestamp = 1704110400000; // 2024-01-01 12:00:00 UTC
      const result = WorldTimeConverter.convertTime(timestamp, 'New_York', 'Paris');

      expect(result).toMatchObject({
        cityName: 'Paris',
        timezone: expect.stringContaining('Paris')
      });
    });

    it('should throw error for invalid cities', () => {
      expect(() => {
        WorldTimeConverter.convertTime('2024-01-01T12:00:00Z', 'InvalidCity', 'Tokyo');
      }).toThrow('Invalid city name or timestamp');
    });
  });

  describe('compareTimeBetweenCities', () => {
    it('should return correct comparison between two cities', () => {
      const result = WorldTimeConverter.compareTimeBetweenCities('London', 'Tokyo');

      expect(result).toMatchObject({
        city1: expect.objectContaining({ cityName: 'London' }),
        city2: expect.objectContaining({ cityName: 'Tokyo' }),
        timeDifference: expect.objectContaining({
          hours: expect.any(Number),
          minutes: expect.any(Number)
        }),
        isSameDay: expect.any(Boolean),
        hoursDifference: expect.any(Number),
        minutesDifference: expect.any(Number)
      });
    });
  });

  describe('findWorkingHoursOverlap', () => {
    const businessHours1: BusinessHours = {
      start: '09:00',
      end: '17:00',
      timezone: 'Europe/London'
    };

    const businessHours2: BusinessHours = {
      start: '09:00',
      end: '17:00',
      timezone: 'Asia/Tokyo'
    };

    it('should find correct overlap between working hours', () => {
      const result = WorldTimeConverter.findWorkingHoursOverlap(
        'London',
        'Tokyo',
        businessHours1,
        businessHours2
      );

      expect(result).toMatchObject({
        hasOverlap: expect.any(Boolean),
        startTime: expect.any(String),
        endTime: expect.any(String),
        overlapDuration: expect.objectContaining({
          hours: expect.any(Number),
          minutes: expect.any(Number)
        })
      });
    });

    it('should throw error for invalid time format', () => {
      const invalidBusinessHours = {
        ...businessHours1,
        start: '9:00' // Invalid format, should be 09:00
      };

      expect(() => {
        WorldTimeConverter.findWorkingHoursOverlap(
          'London',
          'Tokyo',
          invalidBusinessHours,
          businessHours2
        );
      }).toThrow('Invalid time format');
    });
  });

  describe('getNextBusinessDay', () => {
    it('should return next business day correctly', () => {
      const result = WorldTimeConverter.getNextBusinessDay('London');

      expect(result).toMatchObject({
        cityName: 'London',
        timezone: expect.stringContaining('London'),
        date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        dayOfWeek: expect.any(String)
      });
    });

    it('should skip weekends when specified', () => {
      // Create a Friday date
      const friday = moment().day(5).startOf('day');
      jest.spyOn(moment, 'now').mockReturnValue(friday.valueOf());

      const result = WorldTimeConverter.getNextBusinessDay('London', true);
      
      // Next business day should be Monday (day 1)
      expect(moment(result.date).day()).toBe(1);
    });
  });

  describe('holiday management', () => {
    const testHoliday: HolidayDefinition = {
      name: 'Test Holiday',
      date: '2024-12-25',
      recurring: true,
      type: 'public'
    };

    it('should add and retrieve holidays correctly', () => {
      WorldTimeConverter.addHoliday('London', testHoliday);
      const holidays = WorldTimeConverter.getHolidays('London');

      expect(holidays).toContainEqual(testHoliday);
    });

    it('should correctly identify holidays', () => {
      WorldTimeConverter.addHoliday('London', testHoliday);
      const isHoliday = WorldTimeConverter.isHoliday('London', moment('2024-12-25'));

      expect(isHoliday).toBe(true);
    });

    it('should handle recurring holidays', () => {
      WorldTimeConverter.addHoliday('London', testHoliday);
      const isHoliday2025 = WorldTimeConverter.isHoliday('London', moment('2025-12-25'));

      expect(isHoliday2025).toBe(true);
    });
  });

  describe('getTimezoneDifference', () => {
    it('should calculate correct timezone difference', () => {
      const result = WorldTimeConverter.getTimezoneDifference('London', 'Tokyo');

      expect(result).toMatchObject({
        hours: expect.any(Number),
        minutes: expect.any(Number),
        isAhead: expect.any(Boolean),
        formattedDifference: expect.any(String)
      });
    });
  });

  describe('getBusinessDaysBetween', () => {
    it('should calculate correct number of business days', () => {
      const startDate = '2024-01-01'; // Monday
      const endDate = '2024-01-05';   // Friday
      
      const days = WorldTimeConverter.getBusinessDaysBetween('London', startDate, endDate);
      
      expect(days).toBe(5);
    });

    it('should exclude weekends', () => {
      const startDate = '2024-01-01'; // Monday
      const endDate = '2024-01-07';   // Sunday
      
      const days = WorldTimeConverter.getBusinessDaysBetween('London', startDate, endDate);
      
      expect(days).toBe(5);
    });

    it('should exclude holidays when specified', () => {
      const holiday: HolidayDefinition = {
        name: 'Test Holiday',
        date: '2024-01-03',
        recurring: false,
        type: 'public'
      };

      WorldTimeConverter.addHoliday('London', holiday);
      
      const startDate = '2024-01-01'; // Monday
      const endDate = '2024-01-05';   // Friday
      
      const days = WorldTimeConverter.getBusinessDaysBetween('London', startDate, endDate, true);
      
      expect(days).toBe(4);
    });
  });

  describe('getCityInfo', () => {
    it('should return correct city information', () => {
      const result = WorldTimeConverter.getCityInfo('London');

      expect(result).toMatchObject({
        cityName: 'London',
        timezone: expect.stringContaining('London'),
        currentOffset: expect.stringMatching(/^[+-]\d{2}:?\d{2}$/),
        isDST: expect.any(Boolean),
        region: expect.any(String),
        subregion: expect.any(String)
      });
    });
  });

  describe('getAvailableTimezones', () => {
    it('should return list of available timezones', () => {
      const result = WorldTimeConverter.getAvailableTimezones();

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            city: expect.any(String),
            timezone: expect.any(String),
            info: expect.any(Object)
          })
        ])
      );
    });
  });
});