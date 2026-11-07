"use client";

import {
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Send, Trash2 } from "lucide-react";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

export function CatlineChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const nextMessageId = useRef(0);

  function clearChat() {
    setMessages([]);
    setDraft("");
    nextMessageId.current = 0;
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = draft.trim();

    if (!text) {
      return;
    }

    if (text.toLowerCase() === "cmd clear") {
      clearChat();
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nextMessageId.current++,
        role: "user",
        text,
      },
      {
        id: nextMessageId.current++,
        role: "assistant",
        text: "Catline is not connected yet. Your message stayed on this device and was not sent.",
      },
    ]);
    setDraft("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <div className="catline-chat">
      <div
        aria-live="polite"
        className="catline-messages"
        role="log"
      >
        {messages.map(({ id, role, text }) => (
          <p className={`catline-message ${role}`} key={id}>
            {text}
          </p>
        ))}
      </div>
      <div className="catline-chat-tools">
        <button
          aria-label="Clear chat"
          className="catline-clear-button"
          disabled={messages.length === 0}
          onClick={clearChat}
          title="Type cmd clear to clear the chat"
          type="button"
        >
          <Trash2 aria-hidden="true" />
          cmd clear
        </button>
      </div>
      <form className="catline-composer" onSubmit={sendMessage}>
        <label className="sr-only" htmlFor="catline-message">
          Message Catline
        </label>
        <textarea
          id="catline-message"
          maxLength={2000}
          onKeyDown={handleKeyDown}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask Catline a question..."
          rows={1}
          value={draft}
        />
        <button
          aria-label="Send message"
          disabled={!draft.trim()}
          type="submit"
        >
          <Send aria-hidden="true" />
        </button>
      </form>
      <p className="catline-privacy-note">
        Catline is getting ready. Do not include personal or account details.
      </p>
    </div>
  );
}
