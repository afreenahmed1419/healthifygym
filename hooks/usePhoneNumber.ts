"use client";

import { useState } from "react";
import { validatePhoneNumber, formatIndianPhone } from "../lib/auth";

export function usePhoneNumber(initial = "") {
  const [raw, setRaw] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  function onChange(value: string) {
    setRaw(value);
    if (error) setError(null);
  }

  function validate(): boolean {
    if (!validatePhoneNumber(raw)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return false;
    }
    setError(null);
    return true;
  }

  const formatted = raw ? formatIndianPhone(raw) : "";

  return { raw, formatted, error, onChange, validate };
}
