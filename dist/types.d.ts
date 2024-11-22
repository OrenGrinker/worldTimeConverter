/**
 * Represents the result of a time query for a city
 */
export interface TimeResult {
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
/**
 * Represents a time interval
 */
export interface TimeInterval {
    hours: number;
    minutes: number;
}
/**
 * Represents business hours for a location
 */
export interface BusinessHours {
    start: string;
    end: string;
    timezone: string;
    workingDays?: string[];
    breaks?: {
        start: string;
        end: string;
    }[];
}
/**
 * Represents the overlap of working hours between two locations
 */
export interface WorkingHoursOverlap {
    startTime: string;
    endTime: string;
    overlapDuration: TimeInterval;
    hasOverlap: boolean;
    overlapStartCity1: string;
    overlapEndCity1: string;
    overlapStartCity2: string;
    overlapEndCity2: string;
    workingDays: string[];
}
/**
 * Represents a comparison of times between two cities
 */
export interface CityTimeComparison {
    city1: TimeResult;
    city2: TimeResult;
    timeDifference: TimeInterval;
    isSameDay: boolean;
    hoursDifference: number;
    minutesDifference: number;
}
/**
 * Represents a date range
 */
export interface DateRange {
    start: Date | string;
    end: Date | string;
    timezone: string;
}
/**
 * Represents the difference between two timezones
 */
export interface TimezoneDifference {
    hours: number;
    minutes: number;
    isAhead: boolean;
    formattedDifference: string;
}
/**
 * Represents a holiday definition
 */
export interface HolidayDefinition {
    name: string;
    date: string;
    recurring: boolean;
    type: HolidayType;
    observance?: string;
    description?: string;
}
/**
 * Types of holidays
 */
export declare enum HolidayType {
    PUBLIC = "public",
    BANK = "bank",
    RELIGIOUS = "religious",
    CULTURAL = "cultural",
    CORPORATE = "corporate"
}
/**
 * Represents detailed information about a city
 */
export interface CityInfo {
    cityName: string;
    timezone: string;
    currentOffset: string;
    isDST: boolean;
    dstStart?: string;
    region: string;
    subregion: string;
}
/**
 * Configuration options for time conversion
 */
export interface TimeConversionOptions {
    format?: string;
    locale?: string;
    includeDate?: boolean;
    includeDST?: boolean;
    includeOffset?: boolean;
}
/**
 * Working day configuration
 */
export interface WorkingDayConfig {
    workingDays: string[];
    workingHours: BusinessHours;
    holidays: HolidayDefinition[];
    breakTimes?: {
        start: string;
        end: string;
        days?: string[];
    }[];
}
/**
 * Time format options
 */
export declare enum TimeFormat {
    SHORT = "HH:mm",
    LONG = "HH:mm:ss",
    FULL = "YYYY-MM-DD HH:mm:ss",
    ISO = "ISO",
    UNIX = "UNIX",
    CUSTOM = "CUSTOM"
}
/**
 * Represents a specific point in time across different timezones
 */
export interface GlobalTime {
    timestamp: number;
    utc: string;
    local: string;
    timezone: string;
    offset: string;
    isDST: boolean;
}
/**
 * DST transition information
 */
export interface DSTTransition {
    starts: Date;
    ends: Date;
    offset: number;
    isDSTActive: boolean;
}
/**
 * Time zone rules
 */
export interface TimezoneRules {
    standardOffset: number;
    dstOffset: number;
    hasDST: boolean;
    transitions: DSTTransition[];
}
/**
 * Business calendar configuration
 */
export interface BusinessCalendarConfig {
    workWeekStart: number;
    workWeekEnd: number;
    workDayStart: string;
    workDayEnd: string;
    holidays: HolidayDefinition[];
    halfDays?: {
        date: string;
        hours: BusinessHours;
    }[];
}
/**
 * Time calculation result
 */
export interface TimeCalculationResult {
    duration: TimeInterval;
    startTime: GlobalTime;
    endTime: GlobalTime;
    includesOvernight: boolean;
    includesWeekend: boolean;
    businessDays: number;
}
/**
 * Schedule conflict check result
 */
export interface ScheduleConflictResult {
    hasConflict: boolean;
    conflicts: Array<{
        startTime: string;
        endTime: string;
        reason: string;
    }>;
    availableSlots: Array<{
        startTime: string;
        endTime: string;
        duration: TimeInterval;
    }>;
}
/**
 * Geographical coordinates
 */
export interface GeoCoordinates {
    latitude: number;
    longitude: number;
    altitude?: number;
}
/**
 * Location metadata
 */
export interface LocationMetadata {
    cityName: string;
    country: string;
    coordinates: GeoCoordinates;
    population?: number;
    timezone: string;
    languages?: string[];
}
/**
 * Working hours status
 */
export interface WorkingHoursStatus {
    isWorkingHours: boolean;
    nextWorkingDay: Date;
    currentStatus: 'working' | 'break' | 'closed';
    nextStatusChange: Date;
    remainingWorkTime?: TimeInterval;
}
/**
 * Time zone group
 */
export interface TimezoneGroup {
    offset: string;
    cities: string[];
    standardTime: string;
    currentTime: string;
    dstActive: boolean;
}
/**
 * Schedule optimization parameters
 */
export interface ScheduleOptimizationParams {
    preferredTimes?: BusinessHours[];
    excludedTimes?: BusinessHours[];
    duration: TimeInterval;
    requiredParticipants: string[];
    optionalParticipants?: string[];
    bufferTime?: TimeInterval;
    priority: 'earliest' | 'latest' | 'most-participants';
}
/**
 * Calendar event
 */
export interface CalendarEvent {
    title: string;
    startTime: GlobalTime;
    endTime: GlobalTime;
    participants: string[];
    recurrence?: {
        frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
        interval: number;
        until?: Date;
    };
}
/**
 * Time zone validity check result
 */
export interface TimezoneValidityResult {
    isValid: boolean;
    timezone: string;
    reasons: string[];
    suggestions: string[];
}
/**
 * Business metrics
 */
export interface BusinessMetrics {
    totalWorkingHours: number;
    utilizationRate: number;
    overtimeHours: number;
    breakTime: number;
    holidayCount: number;
}
