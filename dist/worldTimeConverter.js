"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldTimeConverter = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const timeUtils_1 = require("./utils/timeUtils");
const validationUtils_1 = require("./utils/validationUtils");
class WorldTimeConverter {
    /**
     * Get current time for a specific city
     */
    static getCurrentTime(cityName) {
        try {
            const timezone = this.getCityTimezone(cityName);
            const now = (0, moment_timezone_1.default)().tz(timezone);
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
        }
        catch (error) {
            throw new Error(`Invalid city name: ${cityName}`);
        }
    }
    /**
     * Convert timestamp from one city to another
     */
    static convertTime(timestamp, fromCity, toCity, format = 'YYYY-MM-DD HH:mm:ss') {
        try {
            const fromTimezone = this.getCityTimezone(fromCity);
            const toTimezone = this.getCityTimezone(toCity);
            const time = moment_timezone_1.default.tz(timestamp, fromTimezone)
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
        }
        catch (error) {
            throw new Error('Invalid city name or timestamp');
        }
    }
    /**
     * Compare times between two cities
     */
    static compareTimeBetweenCities(city1, city2) {
        const time1 = this.getCurrentTime(city1);
        const time2 = this.getCurrentTime(city2);
        const moment1 = moment_timezone_1.default.tz(time1.timezone);
        const moment2 = moment_timezone_1.default.tz(time2.timezone);
        return {
            city1: time1,
            city2: time2,
            timeDifference: timeUtils_1.TimeUtils.calculateTimeDifference(moment1, moment2),
            isSameDay: moment1.format('YYYY-MM-DD') === moment2.format('YYYY-MM-DD'),
            hoursDifference: moment2.diff(moment1, 'hours'),
            minutesDifference: moment2.diff(moment1, 'minutes') % 60
        };
    }
    /**
     * Find working hours overlap between two cities
     */
    static findWorkingHoursOverlap(city1, city2, businessHours1, businessHours2) {
        if (!validationUtils_1.ValidationUtils.validateTimeFormat(businessHours1.start) ||
            !validationUtils_1.ValidationUtils.validateTimeFormat(businessHours1.end) ||
            !validationUtils_1.ValidationUtils.validateTimeFormat(businessHours2.start) ||
            !validationUtils_1.ValidationUtils.validateTimeFormat(businessHours2.end)) {
            throw new Error('Invalid time format. Use HH:mm format');
        }
        const now = (0, moment_timezone_1.default)();
        const city1Time = now.tz(this.getCityTimezone(city1));
        const city2Time = now.tz(this.getCityTimezone(city2));
        // Convert business hours to moments
        const city1Start = city1Time.clone().format('YYYY-MM-DD') + ' ' + businessHours1.start;
        const city1End = city1Time.clone().format('YYYY-MM-DD') + ' ' + businessHours1.end;
        const city2Start = city2Time.clone().format('YYYY-MM-DD') + ' ' + businessHours2.start;
        const city2End = city2Time.clone().format('YYYY-MM-DD') + ' ' + businessHours2.end;
        // Convert to same timezone for comparison
        const start1 = moment_timezone_1.default.tz(city1Start, businessHours1.timezone);
        const end1 = moment_timezone_1.default.tz(city1End, businessHours1.timezone);
        const start2 = moment_timezone_1.default.tz(city2Start, businessHours2.timezone);
        const end2 = moment_timezone_1.default.tz(city2End, businessHours2.timezone);
        // Find overlap
        const overlapStart = moment_timezone_1.default.max(start1, start2);
        const overlapEnd = moment_timezone_1.default.min(end1, end2);
        const hasOverlap = overlapEnd.isAfter(overlapStart);
        return {
            startTime: hasOverlap ? overlapStart.format('HH:mm') : '',
            endTime: hasOverlap ? overlapEnd.format('HH:mm') : '',
            overlapDuration: hasOverlap
                ? timeUtils_1.TimeUtils.calculateTimeDifference(overlapStart, overlapEnd)
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
    static getNextBusinessDay(cityName, skipWeekends = true, skipHolidays = true) {
        const timezone = this.getCityTimezone(cityName);
        let nextDay = (0, moment_timezone_1.default)().tz(timezone).add(1, 'day');
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
    static formatTimeWithLocale(cityName, locale = 'en', format = 'LLLL') {
        const timezone = this.getCityTimezone(cityName);
        return (0, moment_timezone_1.default)().tz(timezone).locale(locale).format(format);
    }
    /**
     * Get timezone difference between two cities
     */
    static getTimezoneDifference(city1, city2) {
        const timezone1 = this.getCityTimezone(city1);
        const timezone2 = this.getCityTimezone(city2);
        const time1 = (0, moment_timezone_1.default)().tz(timezone1);
        const time2 = (0, moment_timezone_1.default)().tz(timezone2);
        const diffMinutes = time2.utcOffset() - time1.utcOffset();
        return {
            hours: Math.floor(Math.abs(diffMinutes) / 60),
            minutes: Math.abs(diffMinutes) % 60,
            isAhead: diffMinutes > 0,
            formattedDifference: timeUtils_1.TimeUtils.formatTimeInterval({
                hours: Math.floor(Math.abs(diffMinutes) / 60),
                minutes: Math.abs(diffMinutes) % 60
            })
        };
    }
    /**
     * Check if a given date is a holiday in the specified city
     */
    static isHoliday(cityName, date) {
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
    static addHoliday(cityName, holiday) {
        const cityHolidays = this.holidays.get(cityName) || [];
        cityHolidays.push(holiday);
        this.holidays.set(cityName, cityHolidays);
    }
    /**
     * Get all holidays for a city
     */
    static getHolidays(cityName) {
        return this.holidays.get(cityName) || [];
    }
    /**
     * Get business days between two dates in a city
     */
    static getBusinessDaysBetween(cityName, startDate, endDate, skipHolidays = true) {
        const timezone = this.getCityTimezone(cityName);
        const start = moment_timezone_1.default.tz(startDate, timezone).startOf('day');
        const end = moment_timezone_1.default.tz(endDate, timezone).startOf('day');
        let businessDays = 0;
        let current = start.clone();
        while (current.isSameOrBefore(end)) {
            if (current.day() !== 0 &&
                current.day() !== 6 &&
                (!skipHolidays || !this.isHoliday(cityName, current))) {
                businessDays++;
            }
            current.add(1, 'day');
        }
        return businessDays;
    }
    /**
     * Get common working days between two cities
     */
    static getCommonWorkingDays(city1, city2) {
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const commonDays = [];
        for (let i = 0; i < 7; i++) {
            const day = (0, moment_timezone_1.default)().day(i);
            if (!this.isHoliday(city1, day) && !this.isHoliday(city2, day)) {
                commonDays.push(weekdays[i]);
            }
        }
        return commonDays;
    }
    /**
     * Get information about a city's timezone
     */
    static getCityInfo(cityName) {
        var _a;
        const timezone = this.getCityTimezone(cityName);
        const now = (0, moment_timezone_1.default)().tz(timezone);
        return {
            cityName,
            timezone,
            currentOffset: now.format('Z'),
            isDST: now.isDST(),
            dstStart: (_a = moment_timezone_1.default.tz.zone(timezone)) === null || _a === void 0 ? void 0 : _a.abbr(now.unix()),
            region: timezone.split('/')[0],
            subregion: timezone.split('/')[1]
        };
    }
    /**
     * Get available timezones with additional information
     */
    static getAvailableTimezones() {
        return moment_timezone_1.default.tz.names().map(tz => {
            const city = tz.split('/').pop().replace(/_/g, ' ');
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
    static getCityTimezone(cityName) {
        const timezone = moment_timezone_1.default.tz.names().find(tz => tz.toLowerCase().includes(cityName.toLowerCase()));
        if (!timezone) {
            throw new Error(`Timezone not found for city: ${cityName}`);
        }
        return timezone;
    }
}
exports.WorldTimeConverter = WorldTimeConverter;
WorldTimeConverter.holidays = new Map();
