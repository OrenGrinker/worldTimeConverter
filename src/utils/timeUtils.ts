// src/utils/timeUtils.ts
import moment from 'moment-timezone';
import { TimeInterval } from '../types';

export class TimeUtils {
  /**
   * Calculate time difference between two timestamps
   */
  public static calculateTimeDifference(time1: moment.Moment, time2: moment.Moment): TimeInterval {
    const diffMinutes = time2.diff(time1, 'minutes');
    return {
      hours: Math.floor(Math.abs(diffMinutes) / 60),
      minutes: Math.abs(diffMinutes) % 60
    };
  }

  /**
   * Format time interval as string
   */
  public static formatTimeInterval(interval: TimeInterval): string {
    return `${interval.hours}h ${interval.minutes}m`;
  }

  /**
   * Check if a given time is within business hours
   */
  public static isWithinBusinessHours(
    time: moment.Moment,
    startTime: string,
    endTime: string
  ): boolean {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const businessStart = time.clone().hour(startHour).minute(startMinute);
    const businessEnd = time.clone().hour(endHour).minute(endMinute);
    
    return time.isBetween(businessStart, businessEnd, undefined, '[]');
  }
}
