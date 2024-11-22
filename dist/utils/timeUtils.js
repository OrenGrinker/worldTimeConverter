"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeUtils = void 0;
class TimeUtils {
    /**
     * Calculate time difference between two timestamps
     */
    static calculateTimeDifference(time1, time2) {
        const diffMinutes = time2.diff(time1, 'minutes');
        return {
            hours: Math.floor(Math.abs(diffMinutes) / 60),
            minutes: Math.abs(diffMinutes) % 60
        };
    }
    /**
     * Format time interval as string
     */
    static formatTimeInterval(interval) {
        return `${interval.hours}h ${interval.minutes}m`;
    }
    /**
     * Check if a given time is within business hours
     */
    static isWithinBusinessHours(time, startTime, endTime) {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        const businessStart = time.clone().hour(startHour).minute(startMinute);
        const businessEnd = time.clone().hour(endHour).minute(endMinute);
        return time.isBetween(businessStart, businessEnd, undefined, '[]');
    }
}
exports.TimeUtils = TimeUtils;
