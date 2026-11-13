export type CatlineRole = "assistant" | "user";

export type CatlineStoredMessage = {
  id: string;
  role: CatlineRole;
  text: string;
  attachments?: string[];
};

export type CatlineConversation = {
  id: string;
  title: string;
  agentId: string;
  updatedAt: number;
  messages: CatlineStoredMessage[];
};

const STORAGE_KEY = "catline.chats.v1";
const MAX_CONVERSATIONS = 50;
const MAX_MESSAGES = 200;

export function loadConversations(): CatlineConversation[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as CatlineConversation[];
  } catch {
    return [];
  }
}

export function saveConversations(list: CatlineConversation[]): void {
  if (typeof window === "undefined") {
    return;
  }

  const trimmed = list
    .slice(0, MAX_CONVERSATIONS)
    .map((conversation) => ({
      ...conversation,
      messages: conversation.messages.slice(-MAX_MESSAGES),
    }));

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage unavailable or full; chats stay in memory only.
  }
}

export function buildConversationTitle(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();

  if (!clean) {
    return "New chat";
  }

  if (clean.length <= 42) {
    return clean;
  }

  return `${clean.slice(0, 42)}...`;
}

export function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
