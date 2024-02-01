/**
 * Converts the keys of an object to camel case.
 * @param key - The key of the object.
 * @param value - The value of the object.
 * @returns The object with camel case keys.
 * @template T - The type of the object.
 */
function toCamelCase<T>(key: string, value: any) {
  if (value && typeof value === "object") {
    for (var k in value) {
      if (/^[A-Z]/.test(k) && Object.hasOwnProperty.call(value, k)) {
        value[k.charAt(0).toLowerCase() + k.substring(1)] = value[k];
        delete value[k];
      }
    }
  }
  return value as T;
}

/**
 * Converts a JSON string into an array of objects with camelCase keys.
 *
 * @param json The JSON string to convert.
 * @returns An array of objects with camelCase keys.
 * @template T The type of the objects in the array.
 */
export function convertToCamelCase<T>(json: string): T[] {
  return JSON.parse(json, toCamelCase<T>);
}

export const groupByKey = <T extends Record<K, any>, K extends keyof any>(
  array: T[] = [],
  getKey: (item: T) => K
) =>
  array.reduce((obj, cur) => {
    const key = getKey(cur);
    return { ...obj, [key]: (obj[key] || []).concat(cur) };
  }, {} as Record<K, T[]>);

/**
 * Converts an array of objects into an object, using a specified key from each object as the property key.
 *
 * Example:
 *  const array = [{ id: 1, name: "Project 1" }, { id: 2, name: "Project 2" }];
 *  const object = arrayToObject(array, (item) => item.id);
 *  { 1: { id: 1, name: "Project 1" }, 2: { id: 2, name: "Project 2" } }
 *
 * @template T - The type of the objects in the array.
 * @template K - The type of the key used to create the object properties.
 * @param {T[]} array - The array of objects to convert.
 * @param {(item: T) => K} getKey - A function that returns the key for each object.
 * @returns {Record<K, T>} - The resulting object with the specified key as the property key.
 */
export const arrayToObject = <T extends Record<K, any>, K extends keyof any>(
  array: T[] = [],
  getKey: (item: T) => K
) =>
  array.reduce((obj, cur) => {
    const key = getKey(cur);
    return { ...obj, [key]: cur };
  }, {} as Record<K, T>);

/**
 * Converts a number to its ordinal representation.
 *
 * @param number - The number to convert.
 * @returns The ordinal representation of the number.
 */
export const convertToOrdinal = (number: number): string => {
  const mod100 = number % 100;
  const mod10 = number % 10;

  if (mod10 === 1 && mod100 !== 11) {
    return number + "st";
  } else if (mod10 === 2 && mod100 !== 12) {
    return number + "nd";
  } else if (mod10 === 3 && mod100 !== 13) {
    return number + "rd";
  } else {
    return number + "th";
  }
};
