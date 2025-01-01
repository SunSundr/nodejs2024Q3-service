export function serialize(obj: unknown, excludeProps: string[]): { [k: string]: unknown } {
  // if (typeof obj !== 'object' || obj === null) {
  //   throw new TypeError('The input must be a non-null object');
  // }
  const json = Object.fromEntries(
    Object.entries(obj).filter(
      ([key, value]) => typeof value !== 'function' && !excludeProps.includes(key),
    ),
  );

  return json;
}
