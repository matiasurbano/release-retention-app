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
