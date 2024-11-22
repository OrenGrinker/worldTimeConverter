import moment from 'moment-timezone';
import { TimeInterval } from '../types';
export declare class TimeUtils {
    /**
     * Calculate time difference between two timestamps
     */
    static calculateTimeDifference(time1: moment.Moment, time2: moment.Moment): TimeInterval;
    /**
     * Format time interval as string
     */
    static formatTimeInterval(interval: TimeInterval): string;
    /**
     * Check if a given time is within business hours
     */
    static isWithinBusinessHours(time: moment.Moment, startTime: string, endTime: string): boolean;
}
