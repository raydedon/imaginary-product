import _ from 'lodash';

/**
 * Transform array by mapping to a specific key
 * @template T
 * @param {T[]} array - Array to transform
 * @param {keyof T | string} key - Property key to map
 * @returns {any[]} Mapped array
 * @example transformArray([{name: 'John'}, {name: 'Jane'}], 'name') // ['John', 'Jane']
 */
export function transformArray<T>(array: T[], key: keyof T | string): any[] {
  return _.map(array, key as any as (value: T) => any);
}

/**
 * Group array items by a property
 * @template T
 * @param {T[]} array - Array to group
 * @param {keyof T | string} property - Property to group by
 * @returns {Record<string, T[]>} Grouped object
 * @example groupByProperty(products, 'category') // { electronics: [...], books: [...] }
 */
export function groupByProperty<T>(array: T[], property: keyof T | string): Record<string, T[]> {
  return _.groupBy(array, property);
}

/**
 * Chunk array into smaller arrays of specified size
 * @template T
 * @param {T[]} array - Array to chunk
 * @param {number} size - Size of each chunk (default: 2)
 * @returns {T[][]} Array of chunks
 * @example chunkArray([1, 2, 3, 4, 5, 6], 3) // [[1, 2, 3], [4, 5, 6]]
 */
export function chunkArray<T>(array: T[], size: number = 2): T[][] {
  return _.chunk(array, size);
}

/**
 * Get unique values from array
 * @template T
 * @param {T[]} array - Array to process
 * @returns {T[]} Array with unique values
 * @example getUnique([1, 2, 2, 3, 3, 3]) // [1, 2, 3]
 */
export function getUnique<T>(array: T[]): T[] {
  return _.uniq(array);
}

/**
 * Sort array by a property
 * @template T
 * @param {T[]} array - Array to sort
 * @param {keyof T | string} property - Property to sort by
 * @param {'asc' | 'desc'} order - Sort order (default: 'asc')
 * @returns {T[]} Sorted array
 * @example sortByProperty(products, 'price', 'asc')
 */
export function sortByProperty<T>(array: T[], property: keyof T | string, order: 'asc' | 'desc' = 'asc'): T[] {
  return _.orderBy(array, [property], [order]);
}

/**
 * Deep clone an object or array
 * @template T
 * @param {T} obj - Object to clone
 * @returns {T} Deep cloned object
 * @example deepClone({ a: 1, b: { c: 2 } })
 */
export function deepClone<T>(obj: T): T {
  return _.cloneDeep(obj);
}

/**
 * Flatten nested array by one level
 * @template T
 * @param {T[][]} array - Nested array to flatten
 * @returns {T[]} Flattened array
 * @example flattenArray([[1, 2], [3, 4]]) // [1, 2, 3, 4]
 */
export function flattenArray<T>(array: T[][]): T[] {
  return _.flatten(array);
}

/**
 * Get elements in array1 that are not in array2
 * @template T
 * @param {T[]} array1 - First array
 * @param {T[]} array2 - Second array
 * @returns {T[]} Difference array
 * @example arrayDifference([1, 2, 3], [2, 3, 4]) // [1]
 */
export function arrayDifference<T>(array1: T[], array2: T[]): T[] {
  return _.difference(array1, array2);
}

/**
 * Create a debounced function that delays invoking func
 * @template T
 * @param {T} func - Function to debounce
 * @param {number} wait - Milliseconds to delay (default: 300)
 * @returns {T & _.Cancelable} Debounced function
 * @example
 * const debouncedSearch = debounceFunction(searchFn, 500);
 * debouncedSearch('query'); // Only calls after 500ms of no calls
 */
export function debounceFunction<T extends (...args: any[]) => any>(
  func: T, 
  wait: number = 300
): _.DebouncedFunc<T> {
  return _.debounce(func, wait);
}

/**
 * Create a throttled function that invokes func at most once per wait period
 * @template T
 * @param {T} func - Function to throttle
 * @param {number} wait - Milliseconds to wait (default: 300)
 * @returns {T & _.Cancelable} Throttled function
 * @example
 * const throttledScroll = throttleFunction(handleScroll, 100);
 * throttledScroll(); // Calls at most once per 100ms
 */
export function throttleFunction<T extends (...args: any[]) => any>(
  func: T, 
  wait: number = 300
): _.DebouncedFunc<T> {
  return _.throttle(func, wait);
}

/**
 * Pick specific properties from an object
 * @template T, K
 * @param {T} obj - Object to pick from
 * @param {K[]} properties - Array of property keys to pick
 * @returns {Pick<T, K>} Object with only picked properties
 * @example pickProperties(user, ['name', 'email']) // { name: '...', email: '...' }
 */
export function pickProperties<T extends object, K extends keyof T>(
  obj: T, 
  properties: K[]
): Pick<T, K> {
  return _.pick(obj, properties);
}

/**
 * Omit specific properties from an object
 * @template T, K
 * @param {T} obj - Object to omit from
 * @param {K[]} properties - Array of property keys to omit
 * @returns {Omit<T, K>} Object without omitted properties
 * @example omitProperties(user, ['password']) // { name: '...', email: '...' }
 */
export function omitProperties<T extends object, K extends keyof T>(
  obj: T, 
  properties: K[]
): Omit<T, K> {
  return _.omit(obj, properties);
}
