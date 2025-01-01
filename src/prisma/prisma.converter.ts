export function toAppEntity<T, U extends object>(prismaEntity: T, entityPrototype: U): T & U {
  const instance = Object.create(entityPrototype) as T & U;
  return Object.assign(instance, prismaEntity);
}

export function toPrismaEntity<T extends object>(obj: unknown, excludeProps: (keyof T)[] = []): T {
  if (typeof obj !== 'object' || obj === null) {
    throw new TypeError('The input must be a non-null object');
  }

  const entity = Object.fromEntries(
    Object.entries(obj).filter(
      ([key, value]) => typeof value !== 'function' && !excludeProps.includes(key as keyof T),
    ),
  );

  return entity as T;
}
