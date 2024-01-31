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
