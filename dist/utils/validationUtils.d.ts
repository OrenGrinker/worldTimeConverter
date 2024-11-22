export declare class ValidationUtils {
    /**
     * Validate timezone name
     */
    static validateTimezone(timezone: string): boolean;
    /**
     * Validate time format (HH:mm)
     */
    static validateTimeFormat(time: string): boolean;
    /**
     * Validate date format (YYYY-MM-DD)
     */
    static validateDateFormat(date: string): boolean;
}
