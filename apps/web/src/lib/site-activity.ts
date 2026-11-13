export type SiteActivityType = "PAGE_VIEW" | "CLICK" | "FORM_SUBMIT";

export type SiteActivity = {
  id: string;
  type: SiteActivityType;
  timestamp: string;
  route: string;
  detail: string;
};

const STORAGE_KEY = "catlas-site-activity-v1";
const ACTIVITY_EVENT = "catlas:site-activity";
const MAX_ENTRIES = 300;

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
        typeof entry.type === "string" &&
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

export function recordSiteActivity(
  entry: Omit<SiteActivity, "id" | "timestamp">,
) {
  try {
    const activity: SiteActivity = {
      ...entry,
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
    };
    const next = [activity, ...readActivity()].slice(0, MAX_ENTRIES);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(ACTIVITY_EVENT));
  } catch {
    // Activity tracking should never interfere with normal site interactions.
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
