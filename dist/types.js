"use strict";
// src/types.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeFormat = exports.HolidayType = void 0;
/**
 * Types of holidays
 */
var HolidayType;
(function (HolidayType) {
    HolidayType["PUBLIC"] = "public";
    HolidayType["BANK"] = "bank";
    HolidayType["RELIGIOUS"] = "religious";
    HolidayType["CULTURAL"] = "cultural";
    HolidayType["CORPORATE"] = "corporate";
})(HolidayType || (exports.HolidayType = HolidayType = {}));
/**
 * Time format options
 */
var TimeFormat;
(function (TimeFormat) {
    TimeFormat["SHORT"] = "HH:mm";
    TimeFormat["LONG"] = "HH:mm:ss";
    TimeFormat["FULL"] = "YYYY-MM-DD HH:mm:ss";
    TimeFormat["ISO"] = "ISO";
    TimeFormat["UNIX"] = "UNIX";
    TimeFormat["CUSTOM"] = "CUSTOM";
})(TimeFormat || (exports.TimeFormat = TimeFormat = {}));
