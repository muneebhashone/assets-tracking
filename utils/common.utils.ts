export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
): Partial<T> {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];

    if (value !== null && value !== undefined) {
      if (typeof value === "object" && !Array.isArray(value)) {
        //@ts-ignore
        acc[key] = sanitizeObject(value);
      } else {
        //@ts-ignore
        acc[key] = value;
      }
    }

    return acc;
  }, {} as Partial<T>);
}
