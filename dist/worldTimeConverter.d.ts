import moment from 'moment-timezone';
import { TimeResult, CityTimeComparison, BusinessHours, WorkingHoursOverlap, TimezoneDifference, HolidayDefinition, CityInfo } from './types';
export declare class WorldTimeConverter {
    private static holidays;
    /**
     * Get current time for a specific city
     */
    static getCurrentTime(cityName: string): TimeResult;
    /**
     * Convert timestamp from one city to another
     */
    static convertTime(timestamp: number | string, fromCity: string, toCity: string, format?: string): TimeResult;
    /**
     * Compare times between two cities
     */
    static compareTimeBetweenCities(city1: string, city2: string): CityTimeComparison;
    /**
     * Find working hours overlap between two cities
     */
    static findWorkingHoursOverlap(city1: string, city2: string, businessHours1: BusinessHours, businessHours2: BusinessHours): WorkingHoursOverlap;
    /**
     * Get next business day for a city
     */
    static getNextBusinessDay(cityName: string, skipWeekends?: boolean, skipHolidays?: boolean): TimeResult;
    /**
     * Format time for a specific locale
     */
    static formatTimeWithLocale(cityName: string, locale?: string, format?: string): string;
    /**
     * Get timezone difference between two cities
     */
    static getTimezoneDifference(city1: string, city2: string): TimezoneDifference;
    /**
     * Check if a given date is a holiday in the specified city
     */
    static isHoliday(cityName: string, date: moment.Moment): boolean;
    /**
     * Add holiday definition for a city
     */
    static addHoliday(cityName: string, holiday: HolidayDefinition): void;
    /**
     * Get all holidays for a city
     */
    static getHolidays(cityName: string): HolidayDefinition[];
    /**
     * Get business days between two dates in a city
     */
    static getBusinessDaysBetween(cityName: string, startDate: string | Date, endDate: string | Date, skipHolidays?: boolean): number;
    /**
     * Get common working days between two cities
     */
    private static getCommonWorkingDays;
    /**
     * Get information about a city's timezone
     */
    static getCityInfo(cityName: string): CityInfo;
    /**
     * Get available timezones with additional information
     */
    static getAvailableTimezones(): Array<{
        city: string;
        timezone: string;
        info: CityInfo;
    }>;
    /**
     * Get timezone name for a city
     */
    private static getCityTimezone;
}
