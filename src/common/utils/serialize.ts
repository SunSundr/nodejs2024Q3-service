export function serialize(obj: unknown, excludeProps: string[]): { [k: string]: unknown } {
  const json = Object.fromEntries(
    Object.entries(obj).filter(
      ([key, value]) => typeof value !== 'function' && !excludeProps.includes(key),
    ),
  );

  return json;
}
