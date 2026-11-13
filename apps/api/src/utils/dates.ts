const LAGOS_TIME_ZONE = "Africa/Lagos";

export function nowUtc(): Date {
  return new Date();
}

export function toUtcIso(date: Date): string {
  return date.toISOString();
}

export function isPast(date: Date): boolean {
  return date.getTime() < Date.now();
}

export function formatLagosDate(date: Date): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: LAGOS_TIME_ZONE,
  }).format(date);
}

export function formatLagosTime(date: Date): string {
  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: LAGOS_TIME_ZONE,
  }).format(date);
}

export function lagosHour(date: Date): number {
  return Number(
    new Intl.DateTimeFormat("en", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: LAGOS_TIME_ZONE,
    }).format(date),
  );
}
