import crypto from "node:crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

if (!ADMIN_PASSWORD || !COOKIE_SECRET) {
  throw new Error("ADMIN_PASSWORD and COOKIE_SECRET are required");
}

const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function isAdminPasswordValid(password: unknown): boolean {
  return (
    typeof password === "string" &&
    password.length > 0 &&
    password === ADMIN_PASSWORD
  );
}

export function createAdminSessionToken(): string {
  const issuedAt = Date.now().toString();
  const payload = `admin.${issuedAt}`;

  const signature = crypto
    .createHmac("sha256", COOKIE_SECRET!)
    .update(payload)
    .digest("hex");

  return `${payload}.${signature}`;
}

export function isValidAdminSession(token: string | undefined): boolean {
  if (!token) {
    return false;
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return false;
  }

  const [role, issuedAt, signature] = parts;

  if (!signature) {
    return false;
  }

  if (role !== "admin") {
    return false;
  }

  const payload = `${role}.${issuedAt}`;

  const expectedSignature = crypto
    .createHmac("sha256", COOKIE_SECRET!)
    .update(payload)
    .digest("hex");

  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedSignatureBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
  ) {
    return false;
  }

  const issuedAtNumber = Number(issuedAt);

  if (!Number.isFinite(issuedAtNumber)) {
    return false;
  }

  return Date.now() - issuedAtNumber < SESSION_MAX_AGE_MS;
}
