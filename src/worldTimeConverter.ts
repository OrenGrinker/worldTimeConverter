import moment from 'moment-timezone';
import { 
  TimeResult, 
  CityTimeComparison, 
  BusinessHours, 
  WorkingHoursOverlap,
  TimeInterval,
  DateRange,
  TimezoneDifference,
  HolidayDefinition,
  CityInfo
} from './types';
import { TimeUtils } from './utils/timeUtils';
import { ValidationUtils } from './utils/validationUtils';

export class WorldTimeConverter {
  private static holidays: Map<string, HolidayDefinition[]> = new Map();
  
  /**
   * Get current time for a specific city
   */
  public static getCurrentTime(cityName: string): TimeResult {
    try {
      const timezone = this.getCityTimezone(cityName);
      const now = moment().tz(timezone);

      return {
        cityName,
        timezone,
        localTime: now.format('HH:mm:ss'),
        utcOffset: now.format('Z'),
        date: now.format('YYYY-MM-DD'),
        dayOfWeek: now.format('dddd'),
        isDST: now.isDST(),
        epoch: now.unix(),
        iso8601: now.toISOString(),
        formattedDateTime: now.format('LLLL')
      };
    } catch (error) {
      throw new Error(`Invalid city name: ${cityName}`);
    }
  }

  /**
   * Convert timestamp from one city to another
   */
  public static convertTime(
    timestamp: number | string,
    fromCity: string,
    toCity: string,
    format: string = 'YYYY-MM-DD HH:mm:ss'
  ): TimeResult {
    try {
      const fromTimezone = this.getCityTimezone(fromCity);
      const toTimezone = this.getCityTimezone(toCity);

      const time = moment.tz(timestamp, fromTimezone)
        .tz(toTimezone);

      return {
        cityName: toCity,
        timezone: toTimezone,
        localTime: time.format('HH:mm:ss'),
        utcOffset: time.format('Z'),
        date: time.format('YYYY-MM-DD'),
        dayOfWeek: time.format('dddd'),
        isDST: time.isDST(),
        epoch: time.unix(),
        iso8601: time.toISOString(),
        formattedDateTime: time.format(format)
      };
    } catch (error) {
      throw new Error('Invalid city name or timestamp');
    }
  }

  /**
   * Compare times between two cities
   */
  public static compareTimeBetweenCities(
    city1: string,
    city2: string
  ): CityTimeComparison {
    const time1 = this.getCurrentTime(city1);
    const time2 = this.getCurrentTime(city2);
    
    const moment1 = moment.tz(time1.timezone);
    const moment2 = moment.tz(time2.timezone);
    
    return {
      city1: time1,
      city2: time2,
      timeDifference: TimeUtils.calculateTimeDifference(moment1, moment2),
      isSameDay: moment1.format('YYYY-MM-DD') === moment2.format('YYYY-MM-DD'),
      hoursDifference: moment2.diff(moment1, 'hours'),
      minutesDifference: moment2.diff(moment1, 'minutes') % 60
    };
  }

  /**
   * Find working hours overlap between two cities
   */
  public static findWorkingHoursOverlap(
    city1: string,
    city2: string,
    businessHours1: BusinessHours,
    businessHours2: BusinessHours
  ): WorkingHoursOverlap {
    if (!ValidationUtils.validateTimeFormat(businessHours1.start) ||
        !ValidationUtils.validateTimeFormat(businessHours1.end) ||
        !ValidationUtils.validateTimeFormat(businessHours2.start) ||
        !ValidationUtils.validateTimeFormat(businessHours2.end)) {
      throw new Error('Invalid time format. Use HH:mm format');
    }

    const now = moment();
    const city1Time = now.tz(this.getCityTimezone(city1));
    const city2Time = now.tz(this.getCityTimezone(city2));

    // Convert business hours to moments
    const city1Start = city1Time.clone().format('YYYY-MM-DD') + ' ' + businessHours1.start;
    const city1End = city1Time.clone().format('YYYY-MM-DD') + ' ' + businessHours1.end;
    const city2Start = city2Time.clone().format('YYYY-MM-DD') + ' ' + businessHours2.start;
    const city2End = city2Time.clone().format('YYYY-MM-DD') + ' ' + businessHours2.end;

    // Convert to same timezone for comparison
    const start1 = moment.tz(city1Start, businessHours1.timezone);
    const end1 = moment.tz(city1End, businessHours1.timezone);
    const start2 = moment.tz(city2Start, businessHours2.timezone);
    const end2 = moment.tz(city2End, businessHours2.timezone);

    // Find overlap
    const overlapStart = moment.max(start1, start2);
    const overlapEnd = moment.min(end1, end2);
    const hasOverlap = overlapEnd.isAfter(overlapStart);

    return {
      startTime: hasOverlap ? overlapStart.format('HH:mm') : '',
      endTime: hasOverlap ? overlapEnd.format('HH:mm') : '',
      overlapDuration: hasOverlap 
        ? TimeUtils.calculateTimeDifference(overlapStart, overlapEnd)
        : { hours: 0, minutes: 0 },
      hasOverlap,
      overlapStartCity1: hasOverlap ? overlapStart.tz(businessHours1.timezone).format('HH:mm') : '',
      overlapEndCity1: hasOverlap ? overlapEnd.tz(businessHours1.timezone).format('HH:mm') : '',
      overlapStartCity2: hasOverlap ? overlapStart.tz(businessHours2.timezone).format('HH:mm') : '',
      overlapEndCity2: hasOverlap ? overlapEnd.tz(businessHours2.timezone).format('HH:mm') : '',
      workingDays: this.getCommonWorkingDays(city1, city2)
    };
  }

  /**
   * Get next business day for a city
   */
  public static getNextBusinessDay(
    cityName: string,
    skipWeekends: boolean = true,
    skipHolidays: boolean = true
  ): TimeResult {
    const timezone = this.getCityTimezone(cityName);
    let nextDay = moment().tz(timezone).add(1, 'day');
    
    while (true) {
      const isWeekend = nextDay.day() === 0 || nextDay.day() === 6;
      const isHoliday = skipHolidays && this.isHoliday(cityName, nextDay);
      
      if ((!skipWeekends || !isWeekend) && (!skipHolidays || !isHoliday)) {
        break;
      }
      nextDay.add(1, 'day');
    }

    return {
      cityName,
      timezone,
      localTime: nextDay.format('HH:mm:ss'),
      utcOffset: nextDay.format('Z'),
      date: nextDay.format('YYYY-MM-DD'),
      dayOfWeek: nextDay.format('dddd'),
      isDST: nextDay.isDST(),
      epoch: nextDay.unix(),
      iso8601: nextDay.toISOString(),
      formattedDateTime: nextDay.format('LLLL')
    };
  }

  /**
   * Format time for a specific locale
   */
  public static formatTimeWithLocale(
    cityName: string,
    locale: string = 'en',
    format: string = 'LLLL'
  ): string {
    const timezone = this.getCityTimezone(cityName);
    return moment().tz(timezone).locale(locale).format(format);
  }

  /**
   * Get timezone difference between two cities
   */
  public static getTimezoneDifference(city1: string, city2: string): TimezoneDifference {
    const timezone1 = this.getCityTimezone(city1);
    const timezone2 = this.getCityTimezone(city2);
    
    const time1 = moment().tz(timezone1);
    const time2 = moment().tz(timezone2);
    
    const diffMinutes = time2.utcOffset() - time1.utcOffset();
    
    return {
      hours: Math.floor(Math.abs(diffMinutes) / 60),
      minutes: Math.abs(diffMinutes) % 60,
      isAhead: diffMinutes > 0,
      formattedDifference: TimeUtils.formatTimeInterval({
        hours: Math.floor(Math.abs(diffMinutes) / 60),
        minutes: Math.abs(diffMinutes) % 60
      })
    };
  }

  /**
   * Check if a given date is a holiday in the specified city
   */
  public static isHoliday(cityName: string, date: moment.Moment): boolean {
    const cityHolidays = this.holidays.get(cityName) || [];
    const dateString = date.format('YYYY-MM-DD');
    
    return cityHolidays.some(holiday => {
      if (holiday.recurring) {
        return holiday.date.slice(5) === dateString.slice(5);
      }
      return holiday.date === dateString;
    });
  }

  /**
   * Add holiday definition for a city
   */
  public static addHoliday(
    cityName: string,
    holiday: HolidayDefinition
  ): void {
    const cityHolidays = this.holidays.get(cityName) || [];
    cityHolidays.push(holiday);
    this.holidays.set(cityName, cityHolidays);
  }

  /**
   * Get all holidays for a city
   */
  public static getHolidays(cityName: string): HolidayDefinition[] {
    return this.holidays.get(cityName) || [];
  }

  /**
   * Get business days between two dates in a city
   */
  public static getBusinessDaysBetween(
    cityName: string,
    startDate: string | Date,
    endDate: string | Date,
    skipHolidays: boolean = true
  ): number {
    const timezone = this.getCityTimezone(cityName);
    const start = moment.tz(startDate, timezone).startOf('day');
    const end = moment.tz(endDate, timezone).startOf('day');
    
    let businessDays = 0;
    let current = start.clone();
    
    while (current.isSameOrBefore(end)) {
      if (
        current.day() !== 0 && 
        current.day() !== 6 && 
        (!skipHolidays || !this.isHoliday(cityName, current))
      ) {
        businessDays++;
      }
      current.add(1, 'day');
    }
    
    return businessDays;
  }

  /**
   * Get common working days between two cities
   */
  private static getCommonWorkingDays(city1: string, city2: string): string[] {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const commonDays: string[] = [];
    
    for (let i = 0; i < 7; i++) {
      const day = moment().day(i);
      if (!this.isHoliday(city1, day) && !this.isHoliday(city2, day)) {
        commonDays.push(weekdays[i]);
      }
    }
    
    return commonDays;
  }

  /**
   * Get information about a city's timezone
   */
  public static getCityInfo(cityName: string): CityInfo {
    const timezone = this.getCityTimezone(cityName);
    const now = moment().tz(timezone);
    
    return {
      cityName,
      timezone,
      currentOffset: now.format('Z'),
      isDST: now.isDST(),
      dstStart: moment.tz.zone(timezone)?.abbr(now.unix()),
      region: timezone.split('/')[0],
      subregion: timezone.split('/')[1]
    };
  }

  /**
   * Get available timezones with additional information
   */
  public static getAvailableTimezones(): Array<{city: string, timezone: string, info: CityInfo}> {
    return moment.tz.names().map(tz => {
      const city = tz.split('/').pop()!.replace(/_/g, ' ');
      return {
        city,
        timezone: tz,
        info: this.getCityInfo(city)
      };
    });
  }

  /**
   * Get timezone name for a city
   */
  private static getCityTimezone(cityName: string): string {
    const timezone = moment.tz.names().find(tz => 
      tz.toLowerCase().includes(cityName.toLowerCase())
    );

    if (!timezone) {
      throw new Error(`Timezone not found for city: ${cityName}`);
    }

    return timezone;
  }

}