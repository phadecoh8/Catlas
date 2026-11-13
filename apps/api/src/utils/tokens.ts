import { SignJWT, jwtVerify } from "jose";
import { unauthorized } from "./errors.js";

export type AccessTokenClaims = {
  userId: string;
  schoolId: string;
  role: string;
};

const ACCESS_TTL_SECONDS = 60 * 15;
const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 14;

function secret(): Uint8Array {
  const value = process.env.JWT_ACCESS_SECRET;

  if (!value || value.length < 32) {
    throw new Error(
      "JWT_ACCESS_SECRET must be set to at least 32 characters.",
    );
  }

  return new TextEncoder().encode(value);
}

export async function signAccessToken(
  claims: AccessTokenClaims,
): Promise<string> {
  return new SignJWT({
    schoolId: claims.schoolId,
    role: claims.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.userId)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TTL_SECONDS}s`)
    .sign(secret());
}

export async function verifyAccessToken(
  token: string,
): Promise<AccessTokenClaims> {
  const { payload } = await jwtVerify(token, secret());

  const { sub, schoolId, role } = payload;

  if (
    typeof sub !== "string" ||
    typeof schoolId !== "string" ||
    typeof role !== "string"
  ) {
    throw unauthorized();
  }

  return {
    userId: sub,
    schoolId,
    role,
  };
}

export async function signRefreshToken(
  userId: string,
): Promise<string> {
  return new SignJWT({ type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TTL_SECONDS}s`)
    .sign(secret());
}
