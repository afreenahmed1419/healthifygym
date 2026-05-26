/** Returns true if the string is a valid E.164 phone number */
export function isValidPhone(phone: string): boolean {
  return /^\+[1-9]\d{7,14}$/.test(phone);
}

/** Returns true if the date string (YYYY-MM-DD) is today or in the future */
export function isFutureOrToday(dateStr: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return dateStr >= today;
}

/** Returns true if the time string matches HH:MM (24-hour) */
export function isValidTime(time: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}

/** Returns true if amount is a positive integer (paise) within allowed range */
export function isValidAmountPaise(amount: number): boolean {
  return Number.isInteger(amount) && amount >= 1 && amount <= 100_000_00;
}
