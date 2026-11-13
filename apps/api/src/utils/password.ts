import bcrypt from "bcryptjs";

const ROUNDS = 12;

export async function hashPassword(
  plain: string,
): Promise<string> {
  return bcrypt.hash(plain, ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function randomToken(bytes = 32): string {
  const buffer = new Uint8Array(bytes);

  crypto.getRandomValues(buffer);

  return Array.from(buffer, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
