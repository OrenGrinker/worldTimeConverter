"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldTimeConverter = void 0;
// src/index.ts
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class WorldTimeConverter {
    /**
     * Get current time for a specific city
     * @param cityName Name of the city (must match moment-timezone database)
     * @returns TimeResult object containing time information
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
                date: now.format('YYYY-MM-DD')
            };
        }
        catch (error) {
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
    static convertTime(timestamp, fromCity, toCity) {
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
                date: time.format('YYYY-MM-DD')
            };
        }
        catch (error) {
            throw new Error('Invalid city name or timestamp');
        }
    }
    /**
     * Get list of all available city timezones
     * @returns Array of city names with their timezones
     */
    static getAvailableTimezones() {
        return moment_timezone_1.default.tz.names().map(tz => ({
            city: tz.split('/').pop().replace(/_/g, ' '),
            timezone: tz
        }));
    }
    static getCityTimezone(cityName) {
        const timezone = moment_timezone_1.default.tz.names().find(tz => tz.toLowerCase().includes(cityName.toLowerCase()));
        if (!timezone) {
            throw new Error(`Timezone not found for city: ${cityName}`);
        }
        return timezone;
    }
}
exports.WorldTimeConverter = WorldTimeConverter;
