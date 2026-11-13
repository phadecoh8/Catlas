import pino from "pino";

const level = process.env.LOG_LEVEL || "info";

export const logger = pino({
  level,
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: [
      "email",
      "*.email",
      "name",
      "*.name",
      "phone",
      "*.phone",
      "matricNumber",
      "*.matricNumber",
      "password",
      "*.password",
      "token",
      "*.token",
      "authorization",
      "*.authorization",
    ],
    censor: "[redacted]",
  },
});

export function requestId(): string {
  return crypto.randomUUID();
}
