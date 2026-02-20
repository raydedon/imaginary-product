import * as libphonenumber from 'libphonenumber-js';
import { CountryCode, NumberType } from 'libphonenumber-js';

/**
 * Result of parsing a phone number
 */
export interface ParsedPhoneNumber {
  isValid: boolean;
  international?: string;
  national?: string;
  country?: CountryCode;
  type?: NumberType;
  error?: string;
}

/**
 * Validate a phone number
 * @param {string} phoneNumber - Phone number to validate
 * @param {CountryCode} country - Country code (default: 'US')
 * @returns {boolean} True if valid, false otherwise
 * @example validatePhoneNumber('+1-555-123-4567', 'US') // true
 */
export function validatePhoneNumber(phoneNumber: string, country: CountryCode = 'US'): boolean {
  try {
    const phoneNumberObj = libphonenumber.parsePhoneNumber(phoneNumber, country);
    return phoneNumberObj.isValid();
  } catch {
    return false;
  }
}

/**
 * Format a phone number to international format
 * @param {string} phoneNumber - Phone number to format
 * @param {CountryCode} country - Country code (default: 'US')
 * @returns {string} Formatted phone number or original if invalid
 * @example formatPhoneNumber('5551234567', 'US') // "+1 555 123 4567"
 */
export function formatPhoneNumber(phoneNumber: string, country: CountryCode = 'US'): string {
  try {
    const phoneNumberObj = libphonenumber.parsePhoneNumber(phoneNumber, country);
    return phoneNumberObj.formatInternational();
  } catch {
    return phoneNumber;
  }
}

/**
 * Get the type of phone number (mobile, fixed-line, etc.)
 * @param {string} phoneNumber - Phone number to check
 * @param {CountryCode} country - Country code (default: 'US')
 * @returns {NumberType | 'UNKNOWN'} Phone number type
 * @example getPhoneNumberType('+1-555-123-4567', 'US') // "MOBILE"
 */
export function getPhoneNumberType(phoneNumber: string, country: CountryCode = 'US'): NumberType | 'UNKNOWN' {
  try {
    const phoneNumberObj = libphonenumber.parsePhoneNumber(phoneNumber, country);
    return phoneNumberObj.getType();
  } catch {
    return 'UNKNOWN';
  }
}

/**
 * Get the country code from a phone number
 * @param {string} phoneNumber - Phone number to parse
 * @param {CountryCode} country - Default country code (default: 'US')
 * @returns {CountryCode | null} Country code or null if invalid
 * @example getCountryCode('+1-555-123-4567', 'US') // "US"
 */
export function getCountryCode(phoneNumber: string, country: CountryCode = 'US'): CountryCode | null {
  try {
    const phoneNumberObj = libphonenumber.parsePhoneNumber(phoneNumber, country);
    return phoneNumberObj.country as CountryCode | null;
  } catch {
    return null;
  }
}

/**
 * Parse a phone number and return all information
 * @param {string} phoneNumber - Phone number to parse
 * @param {CountryCode} country - Country code (default: 'US')
 * @returns {ParsedPhoneNumber} Object with phone number details or error
 * @example
 * parsePhone('+1-555-123-4567', 'US')
 * // {
 * //   isValid: true,
 * //   international: "+1 555 123 4567",
 * //   national: "(555) 123-4567",
 * //   country: "US",
 * //   type: "MOBILE"
 * // }
 */
export function parsePhone(phoneNumber: string, country: CountryCode = 'US'): ParsedPhoneNumber {
  try {
    const phoneNumberObj = libphonenumber.parsePhoneNumber(phoneNumber, country);
    return {
      isValid: phoneNumberObj.isValid(),
      international: phoneNumberObj.formatInternational(),
      national: phoneNumberObj.formatNational(),
      country: phoneNumberObj.country,
      type: phoneNumberObj.getType(),
    };
  } catch {
    return {
      isValid: false,
      error: 'Invalid phone number',
    };
  }
}
