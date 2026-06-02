// Strip HTML tags and dangerous characters from user input
export function sanitizeString(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")           // strip HTML tags
    .replace(/[<>"'`]/g, "")           // strip XSS characters
    .replace(/javascript:/gi, "")      // strip JS protocol
    .trim()
    .slice(0, 1000);                   // max length
}

export function sanitizePhone(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.replace(/[^\d+\s\-()]/g, "").trim().slice(0, 20);
}

export function sanitizeEmail(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.replace(/[<>"'`\s]/g, "").toLowerCase().trim().slice(0, 254);
}
