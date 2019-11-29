export const localeStringToNumber = (value: string): string | null => {
  if (typeof value === "number") {
    return `${value}`
  }
  if (value === null || value === undefined) {
    return null;
  }
  const parts = (1234.5).toLocaleString()
    .match(/(\D+)/g);

  const unformatted =
    parts &&
    value
      .split(parts[0])
      .join("")
      .split(parts[1])
      .join(".");

  return unformatted;
};