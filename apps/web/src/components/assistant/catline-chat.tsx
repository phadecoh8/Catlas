"use client";

import {
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  Cat,
  ChevronDown,
  Menu,
  MessageSquare,
  Plus,
  Send,
  Brain,
  X,
} from "lucide-react";
import styles from "./catline-chat.module.css";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

type Conversation = {
  id: number;
  title: string;
  messages: ChatMessage[];
};

const models = [
  { id: "auto", label: "Catlas Auto", detail: "Automatic fallback" },
  { id: "gemini", label: "Gemini", detail: "Free tier varies" },
  { id: "groq", label: "Groq", detail: "Free tier varies" },
  { id: "mistral", label: "Mistral", detail: "Free tier varies" },
  { id: "openrouter", label: "OpenRouter", detail: "Free models vary" },
  { id: "github-models", label: "GitHub Models", detail: "Model access varies" },
  { id: "deepseek", label: "DeepSeek", detail: "API access may be paid" },
];

export function CatlineChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [model, setModel] = useState("auto");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const nextId = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  );
  const messages = activeConversation?.messages ?? [];
  const selectedModel = models.find((item) => item.id === model) ?? models[0];

  function startNewChat() {
    setActiveConversationId(null);
    setDraft("");
    setSidebarOpen(false);
    textareaRef.current?.focus();
  }

  function openConversation(id: number) {
    setActiveConversationId(id);
    setDraft("");
    setSidebarOpen(false);
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();

    if (!text) {
      return;
    }

    const userMessage: ChatMessage = {
      id: nextId.current++,
      role: "user",
      text,
    };
    const assistantMessage: ChatMessage = {
      id: nextId.current++,
      role: "assistant",
      text: "Catline is not connected yet. Your message stayed on this device and was not sent.",
    };
    const conversationId = activeConversationId ?? nextId.current++;
    const updatedMessages = [...messages, userMessage, assistantMessage];

    setConversations((current) => {
      const existing = current.find((item) => item.id === conversationId);

      if (existing) {
        return current.map((item) =>
          item.id === conversationId
            ? { ...item, messages: updatedMessages }
            : item,
        );
      }

      return [
        {
          id: conversationId,
          title: text.slice(0, 40),
          messages: updatedMessages,
        },
        ...current,
      ];
    });
    setActiveConversationId(conversationId);
    setDraft("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <section aria-label="Catline AI assistant" className={styles.workspace}>
      {sidebarOpen && (
        <button
          aria-label="Close conversation menu"
          className={styles.mobileScrim}
          onClick={() => setSidebarOpen(false)}
          type="button"
        />
      )}
      <aside
        aria-label="Conversation history and memory"
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.sidebarTop}>
          <a aria-label="Catlas home" className={styles.wordmark} href="/home">
            <span className={styles.logoBadge}>
              <Cat aria-hidden="true" />
            </span>
            <span>Catline</span>
          </a>
          <button
            aria-label="Close conversation menu"
            className={`${styles.iconButton} ${styles.mobileClose}`}
            onClick={() => setSidebarOpen(false)}
            type="button"
          >
            <X aria-hidden="true" />
          </button>
          <button
            aria-label="Start a new chat"
            className={`${styles.iconButton} ${styles.desktopNewChat}`}
            onClick={startNewChat}
            title="New chat"
            type="button"
          >
            <Plus aria-hidden="true" />
          </button>
        </div>
        <button className={styles.newChatButton} onClick={startNewChat} type="button">
          <Plus aria-hidden="true" />
          <span>New chat</span>
        </button>
        <div className={styles.sidebarSections}>
          <section aria-labelledby="catline-recent-heading" className={styles.history}>
            <h2 className={styles.historyLabel} id="catline-recent-heading">Recent</h2>
            {conversations.length === 0 ? (
              <p className={styles.historyEmpty}>Your conversations will appear here.</p>
            ) : (
              conversations.map((conversation) => (
                <button
                  aria-current={conversation.id === activeConversationId ? "page" : undefined}
                  className={`${styles.historyItem} ${conversation.id === activeConversationId ? styles.historyItemActive : ""}`}
                  key={conversation.id}
                  onClick={() => openConversation(conversation.id)}
                  type="button"
                >
                  <MessageSquare aria-hidden="true" />
                  <span>{conversation.title}</span>
                </button>
              ))
            )}
          </section>
          <section aria-labelledby="catline-memory-heading" className={styles.memorySection}>
            <h2 className={styles.historyLabel} id="catline-memory-heading">
              <Brain aria-hidden="true" />
              Memory
            </h2>
            <p className={styles.memoryEmpty}>
              Details you choose to save will appear here. Memory is not connected yet.
            </p>
          </section>
        </div>
        <div className={styles.sidebarFoot}>
          <span className={styles.onlineDot} aria-hidden="true" />
          <span>Catlas assistant</span>
        </div>
      </aside>

      <div className={styles.chatPanel}>
        <header className={styles.toolbar}>
          <button
            aria-label="Open conversation menu"
            className={`${styles.iconButton} ${styles.mobileMenu}`}
            onClick={() => setSidebarOpen(true)}
            type="button"
          >
            <Menu aria-hidden="true" />
          </button>
          <div className={styles.mobileTitle}>
            <span className={styles.logoBadgeSmall}>
              <Cat aria-hidden="true" />
            </span>
            <span>Catline</span>
          </div>
          <label className={styles.modelPicker}>
            <span className={styles.srOnly}>Choose an AI model</span>
            <select
              aria-label="Choose an AI model"
              onChange={(event) => setModel(event.target.value)}
              value={model}
            >
              {models.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label} · {item.detail}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" />
          </label>
          <span className={styles.toolbarNote}>AI assistant</span>
        </header>

        <div className={styles.conversation}>
          {messages.length === 0 ? (
            <div aria-label="New conversation" className={styles.emptyState} />
          ) : (
            <div aria-live="polite" className={styles.messages} role="log">
              {messages.map((message) => (
                <article className={styles.messageRow} key={message.id}>
                  {message.role === "assistant" ? (
                    <span aria-label="Catline" className={styles.messageAvatar}>
                      <Cat aria-hidden="true" />
                    </span>
                  ) : (
                    <span aria-hidden="true" className={styles.userAvatar}>You</span>
                  )}
                  <div className={styles.messageContent}>
                    <p className={styles.messageAuthor}>
                      {message.role === "assistant" ? "Catline" : "You"}
                    </p>
                    <p className={styles.messageText}>{message.text}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className={styles.composerArea}>
          <form className={styles.composer} onSubmit={sendMessage}>
            <label className={styles.srOnly} htmlFor="catline-message">
              Message Catline
            </label>
            <textarea
              id="catline-message"
              maxLength={2000}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about Catlas..."
              ref={textareaRef}
              rows={1}
              value={draft}
            />
            <div className={styles.composerBottom}>
              <span className={styles.composerHint}>Enter to send · Shift + Enter for a new line</span>
              <button
                aria-label="Send message"
                className={styles.sendButton}
                disabled={!draft.trim()}
                type="submit"
              >
                <Send aria-hidden="true" />
              </button>
            </div>
          </form>
          <p className={styles.disclaimer}>
            Catline can make mistakes. Don’t include personal or account details.
          </p>
          <p className={styles.modelStatus}>
            {selectedModel.label} selected. Provider connections and memory are not active yet.
          </p>
        </div>
      </div>
    </section>
  );
}
