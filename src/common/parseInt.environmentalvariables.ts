export const getIntValidation = (
  expiry: string | undefined,
  value: string,
): number => {
  const parsedValue = parseInt(expiry || value, 10); // Default to '5432' if undefined
  return isNaN(parsedValue) ? 3600 : parsedValue; // Return 5432 if NaN
};
