"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Mic, Plus, Send, X } from "lucide-react";
import { CalmCatHead } from "@/components/cats/calm-cat-head";
import {
  type CatlineStoredMessage,
  createId,
} from "@/lib/catline-history";

type CatlineChatProps = {
  agentName: string;
  messages: CatlineStoredMessage[];
  onClear: () => void;
  onSend: (text: string, attachments: string[]) => void;
};

type PendingAttachment = {
  id: string;
  name: string;
};

export function CatlineChat({
  agentName,
  messages,
  onClear,
  onSend,
}: CatlineChatProps) {
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEmpty = messages.length === 0;

  function pickAttachments() {
    fileInputRef.current?.click();
  }

  function addAttachments(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    setAttachments((current) => [
      ...current,
      ...files.map((file) => ({
        id: createId(),
        name: file.name,
      })),
    ]);
    event.target.value = "";
  }

  function removeAttachment(id: string) {
    setAttachments((current) =>
      current.filter((attachment) => attachment.id !== id),
    );
  }

  function clearComposer() {
    setDraft("");
    setAttachments([]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = draft.trim();
    const names = attachments.map((attachment) => attachment.name);

    if (!text && names.length === 0) {
      return;
    }

    if (text.toLowerCase() === "cmd clear") {
      clearComposer();
      onClear();
      return;
    }

    onSend(text, names);
    clearComposer();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <div className={isEmpty ? "catline-chat empty" : "catline-chat"}>
      <div
        aria-live="polite"
        className="catline-messages"
        role="log"
      >
        {isEmpty ? (
          <section
            aria-labelledby="catline-heading"
            className="catline-welcome"
          >
            <CalmCatHead className="catline-cat" size={140} />
            <h1 id="catline-heading">Hello from Catline</h1>
            <p>Your Catlas assistant is here to help.</p>
            <p className="catline-agent-hint">Agent: {agentName}</p>
          </section>
        ) : (
          messages.map((message) => (
            <p
              className={`catline-message ${message.role}`}
              key={message.id}
            >
              {message.text}
              {message.attachments && message.attachments.length > 0 && (
                <span className="catline-message-attachments">
                  {message.attachments.map((name) => (
                    <span key={name}>{name}</span>
                  ))}
                </span>
              )}
            </p>
          ))
        )}
      </div>
      <form className="catline-composer" onSubmit={handleSubmit}>
        <div className="catline-composer-box">
          {attachments.length > 0 && (
            <ul className="catline-attachments">
              {attachments.map((attachment) => (
                <li key={attachment.id}>
                  <span className="catline-attachment-name">
                    {attachment.name}
                  </span>
                  <button
                    aria-label={`Remove ${attachment.name}`}
                    onClick={() => removeAttachment(attachment.id)}
                    type="button"
                  >
                    <X aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <label className="sr-only" htmlFor="catline-message">
            Message Catline
          </label>
          <textarea
            id="catline-message"
            maxLength={2000}
            onKeyDown={handleKeyDown}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask Catline anything..."
            rows={1}
            value={draft}
          />
          <div className="catline-composer-actions">
            <button
              aria-label="Attach files or images"
              className="catline-composer-button"
              onClick={pickAttachments}
              type="button"
            >
              <Plus aria-hidden="true" />
            </button>
            <span className="catline-composer-spacer" />
            <button
              aria-label="Send a voice note"
              className="catline-composer-button"
              disabled
              title="Voice notes are coming soon"
              type="button"
            >
              <Mic aria-hidden="true" />
            </button>
            <button
              aria-label="Send message"
              className="catline-composer-button send"
              disabled={!draft.trim() && attachments.length === 0}
              type="submit"
            >
              <Send aria-hidden="true" />
            </button>
          </div>
          <input
            aria-hidden="true"
            className="catline-file-input"
            multiple
            onChange={addAttachments}
            ref={fileInputRef}
            tabIndex={-1}
            type="file"
          />
        </div>
      </form>
      <p className="catline-privacy-note">
        Chats stay on this device. Do not include personal or account
        details.
      </p>
    </div>
  );
}
