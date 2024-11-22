// src/utils/validationUtils.ts
import moment from 'moment-timezone';

export class ValidationUtils {
  /**
   * Validate timezone name
   */
  public static validateTimezone(timezone: string): boolean {
    return moment.tz.zone(timezone) !== null;
  }

  /**
   * Validate time format (HH:mm)
   */
  public static validateTimeFormat(time: string): boolean {
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  }

  /**
   * Validate date format (YYYY-MM-DD)
   */
  public static validateDateFormat(date: string): boolean {
    return moment(date, 'YYYY-MM-DD', true).isValid();
  }
}
