// src/index.ts
import moment from 'moment-timezone';

export interface TimeResult {
  cityName: string;
  timezone: string;
  localTime: string;
  utcOffset: string;
  date: string;
}

export class WorldTimeConverter {
  /**
   * Get current time for a specific city
   * @param cityName Name of the city (must match moment-timezone database)
   * @returns TimeResult object containing time information
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
        date: now.format('YYYY-MM-DD')
      };
    } catch (error) {
      throw new Error(`Invalid city name: ${cityName}`);
    }
  }

  /**
   * Convert timestamp from one city to another
   * @param timestamp Unix timestamp or ISO string
   * @param fromCity Source city name
   * @param toCity Target city name
   * @returns TimeResult object for the target city
   */
  public static convertTime(
    timestamp: number | string,
    fromCity: string,
    toCity: string
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
        date: time.format('YYYY-MM-DD')
      };
    } catch (error) {
      throw new Error('Invalid city name or timestamp');
    }
  }

  /**
   * Get list of all available city timezones
   * @returns Array of city names with their timezones
   */
  public static getAvailableTimezones(): Array<{city: string, timezone: string}> {
    return moment.tz.names().map(tz => ({
      city: tz.split('/').pop()!.replace(/_/g, ' '),
      timezone: tz
    }));
  }

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