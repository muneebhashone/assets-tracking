export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
): Partial<T> {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];

    if (value !== null && value !== undefined && value !== "") {
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

export const handlePhoneNumber = (
  value: string,
  changFn: (...event: any[]) => void,
) => {
  if (value.length === 0) {
    return changFn(value);
  }
  return changFn("+" + value);
};

export function truncateText(text: string, wordLimit: number): string {
  const words = text.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return text;
}
