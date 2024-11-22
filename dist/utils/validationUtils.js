"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationUtils = void 0;
// src/utils/validationUtils.ts
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class ValidationUtils {
    /**
     * Validate timezone name
     */
    static validateTimezone(timezone) {
        return moment_timezone_1.default.tz.zone(timezone) !== null;
    }
    /**
     * Validate time format (HH:mm)
     */
    static validateTimeFormat(time) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
    }
    /**
     * Validate date format (YYYY-MM-DD)
     */
    static validateDateFormat(date) {
        return (0, moment_timezone_1.default)(date, 'YYYY-MM-DD', true).isValid();
    }
}
exports.ValidationUtils = ValidationUtils;
