/** Format paise (integer) to a human-readable rupee string: 50000 → "₹500.00" */
export function formatAmount(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}

/** Format an ISO date string to "DD MMM YYYY": "2025-06-15" → "15 Jun 2025" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/** Format a 24-hour time string to 12-hour: "14:30" → "2:30 PM" */
export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

/** Mask all but the last 4 digits of a phone number */
export function maskPhone(phone: string): string {
  return phone.replace(/\d(?=\d{4})/g, "*");
}
