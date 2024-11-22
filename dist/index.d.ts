export interface TimeResult {
    cityName: string;
    timezone: string;
    localTime: string;
    utcOffset: string;
    date: string;
}
export declare class WorldTimeConverter {
    /**
     * Get current time for a specific city
     * @param cityName Name of the city (must match moment-timezone database)
     * @returns TimeResult object containing time information
     */
    static getCurrentTime(cityName: string): TimeResult;
    /**
     * Convert timestamp from one city to another
     * @param timestamp Unix timestamp or ISO string
     * @param fromCity Source city name
     * @param toCity Target city name
     * @returns TimeResult object for the target city
     */
    static convertTime(timestamp: number | string, fromCity: string, toCity: string): TimeResult;
    /**
     * Get list of all available city timezones
     * @returns Array of city names with their timezones
     */
    static getAvailableTimezones(): Array<{
        city: string;
        timezone: string;
    }>;
    private static getCityTimezone;
}
