/**
 * Canonical form data shape for letter generation.
 * This is the single source of truth shared by:
 * - API routes
 * - Letter rendering
 * - Future DB schema
 */
export type LetterFormData = {
  language: "en" | "es";

  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;

  email: string;
  phoneNumber: string;

  collectorName: string;
  collectorAddress?: string;
  accountReference?: string;
};

/* -------------------- */
/* Validation utilities */
/* -------------------- */

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isZip(value: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(value);
}

function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/* -------------------- */
/* Normalization + validation */
/* -------------------- */

export function normalizeAndValidate(
  input: unknown
):
  | { ok: true; data: LetterFormData }
  | { ok: false; errors: string[] } {
  const errors: string[] = [];

  const obj = (input ?? {}) as Record<string, unknown>;

  const data: LetterFormData = {
    language: obj.language === "es" ? "es" : "en",

    fullName: String(obj.fullName ?? "").trim(),
    addressLine1: String(obj.addressLine1 ?? "").trim(),
    addressLine2: String(obj.addressLine2 ?? "").trim() || undefined,
    city: String(obj.city ?? "").trim(),
    state: String(obj.state ?? "").trim().toUpperCase(),
    zip: String(obj.zip ?? "").trim(),

    email: String(obj.email ?? "").trim(),
    phoneNumber: String(obj.phoneNumber ?? "").trim(),

    collectorName: String(obj.collectorName ?? "").trim(),
    collectorAddress:
      String(obj.collectorAddress ?? "").trim() || undefined,
    accountReference:
      String(obj.accountReference ?? "").trim() || undefined,
  };

  /* -------- Required fields -------- */

  if (data.fullName.length < 2) {
    errors.push("Full name is required.");
  }

  if (!isNonEmpty(data.addressLine1)) {
    errors.push("Street address is required.");
  }

  if (!isNonEmpty(data.city)) {
    errors.push("City is required.");
  }

  if (!isNonEmpty(data.state)) {
    errors.push("State is required.");
  }

  if (!isZip(data.zip)) {
    errors.push("A valid ZIP code is required.");
  }

  if (!isEmail(data.email)) {
    errors.push("A valid email address is required.");
  }

  if (!isNonEmpty(data.phoneNumber)) {
    errors.push("Phone number is required.");
  }

  if (!isNonEmpty(data.collectorName)) {
    errors.push("Collection agency name is required.");
  }

  /* -------- Result -------- */

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data };
}
