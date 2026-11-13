export type SiteActivityType =
  | "AUTH"
  | "AI"
  | "ENROLLMENT"
  | "ADMIN_ACTION"
  | "SYSTEM";

export type SiteActivity = {
  id: string;
  type: SiteActivityType;
  timestamp: string;
  route: string;
  detail: string;
};

const STORAGE_KEY = "catlas-important-activity-v2";
const ACTIVITY_EVENT = "catlas:site-activity";
const MAX_ENTRIES = 300;
const MAX_DETAIL_LENGTH = 180;

function isSiteActivityType(value: unknown): value is SiteActivityType {
  return (
    value === "AUTH" ||
    value === "AI" ||
    value === "ENROLLMENT" ||
    value === "ADMIN_ACTION" ||
    value === "SYSTEM"
  );
}

function readActivity(): SiteActivity[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (entry): entry is SiteActivity =>
        typeof entry === "object" &&
        entry !== null &&
        typeof entry.id === "string" &&
        isSiteActivityType(entry.type) &&
        typeof entry.timestamp === "string" &&
        typeof entry.route === "string" &&
        typeof entry.detail === "string",
    );
  } catch {
    return [];
  }
}

export function getSiteActivity() {
  return readActivity();
}

/**
 * Record a meaningful product or administration event, not routine browsing.
 * Callers must never include names, email addresses, credentials, or other
 * personal data in the detail string.
 */
export function recordImportantActivity(
  type: SiteActivityType,
  detail: string,
  route = typeof window === "undefined" ? "/" : window.location.pathname,
) {
  try {
    const activity: SiteActivity = {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      type,
      timestamp: new Date().toISOString(),
      route: route.slice(0, 120),
      detail: detail.replace(/[\r\n\t]+/g, " ").trim().slice(0, MAX_DETAIL_LENGTH),
    };
    const next = [activity, ...readActivity()].slice(0, MAX_ENTRIES);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(ACTIVITY_EVENT));
  } catch {
    // Audit display failures must never interrupt the application action.
  }
}

export function clearSiteActivity() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(ACTIVITY_EVENT));
  } catch {
    // Ignore unavailable browser storage.
  }
}

export function subscribeToSiteActivity(onChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) onChange();
  };
  window.addEventListener(ACTIVITY_EVENT, onChange);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(ACTIVITY_EVENT, onChange);
    window.removeEventListener("storage", handleStorage);
  };
}
