import moment, { Moment, MomentInput } from 'moment';

/**
 * Get current date formatted as "Month DD, YYYY"
 * @returns {string} Current date string
 * @example getCurrentDate() // "February 09, 2026"
 */
export function getCurrentDate(): string {
  return moment().format('MMMM DD, YYYY');
}

/**
 * Get tomorrow's date formatted as "Month DD, YYYY"
 * @returns {string} Tomorrow's date string
 * @example getTomorrowDate() // "February 10, 2026"
 */
export function getTomorrowDate(): string {
  return moment().add(1, 'days').format('MMMM DD, YYYY');
}

/**
 * Get a future date N days from now
 * @param {number} days - Number of days in the future (default: 30)
 * @returns {string} Future date formatted as "Month DD, YYYY"
 * @example getFutureDate(7) // "February 16, 2026"
 */
export function getFutureDate(days: number = 30): string {
  return moment().add(days, 'days').format('MMMM DD, YYYY');
}

/**
 * Check if current year is a leap year
 * @returns {boolean} True if current year is a leap year
 * @example isLeapYear() // true or false
 */
export function isLeapYear(): boolean {
  return moment().isLeapYear();
}

/**
 * Get current year
 * @returns {number} Current year
 * @example getCurrentYear() // 2026
 */
export function getCurrentYear(): number {
  return moment().year();
}

/**
 * Format a date to "Month DD, YYYY" format
 * @param {MomentInput} date - Date to format (string, Date object, or Moment)
 * @returns {string} Formatted date string
 * @example formatDate('2026-12-25') // "December 25, 2026"
 */
export function formatDate(date: MomentInput): string {
  return moment(date).format('MMMM DD, YYYY');
}

/**
 * Get relative time from a date (e.g., "2 hours ago", "in 3 days")
 * @param {MomentInput} date - Date to compare with now
 * @returns {string} Relative time string
 * @example getRelativeTime('2026-02-08') // "1 day ago"
 */
export function getRelativeTime(date: MomentInput): string {
  return moment(date).fromNow();
}
