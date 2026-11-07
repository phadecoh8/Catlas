"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { ImagePlus, Send } from "lucide-react";
import { FounderPageLayout } from "@/components/admin/founder-page-layout";

type NewsletterComposerProps = {
  previewMode: boolean;
};

export function NewsletterComposer({ previewMode }: NewsletterComposerProps) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [body, setBody] = useState("");
  const [contentFileName, setContentFileName] = useState("");
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    setFileName(file?.name ?? "");
  }

  async function handleContentFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    setBody(await file.text());
    setContentFileName(file.name);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      "Newsletter delivery is not connected yet. Your content has not been sent.",
    );
  }

  return (
    <FounderPageLayout
      previewMode={previewMode}
      subtitle="Prepare an update and send it to confirmed newsletter subscribers."
      title="Newsletter updates"
    >
      <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
        <form
          className="grid gap-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6"
          onSubmit={handleSubmit}
        >
          <div>
            <h2 className="font-[var(--font-heading)] text-xl font-bold">
              Compose update
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Only confirmed subscribers should receive newsletter updates.
            </p>
          </div>

          <label className="grid gap-2 text-sm font-medium">
            Newsletter title
            <input
              className="min-h-11 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
              onChange={(event) => setTitle(event.currentTarget.value)}
              placeholder="Give this update a title"
              value={title}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Email subject
            <input
              className="min-h-11 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
              onChange={(event) => setSubject(event.currentTarget.value)}
              placeholder="What subscribers will see in their inbox"
              required
              value={subject}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Inbox preview text
            <input
              className="min-h-11 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
              onChange={(event) => setPreviewText(event.currentTarget.value)}
              placeholder="A short summary shown beside the subject"
              value={previewText}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Newsletter content
            <textarea
              className="min-h-56 resize-y rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
              onChange={(event) => setBody(event.currentTarget.value)}
              placeholder="Write the update for subscribers"
              required
              value={body}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Upload newsletter content (.html or .txt)
            <input
              accept=".html,.txt,text/html,text/plain"
              className="block w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-sm text-[var(--color-muted)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--color-surface)] file:px-3 file:py-2 file:font-semibold file:text-[var(--color-text)]"
              onChange={handleContentFileChange}
              type="file"
            />
            {contentFileName && (
              <span className="text-xs text-[var(--color-muted)]">
                Loaded {contentFileName} into the editor.
              </span>
            )}
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Cover image (optional)
            <span className="flex min-h-12 items-center gap-3 rounded-md border border-dashed border-[var(--color-border)] px-3 text-sm text-[var(--color-muted)]">
              <ImagePlus aria-hidden="true" className="h-5 w-5 shrink-0" />
              <span className="min-w-0 flex-1 truncate">
                {fileName || "Choose an image for the newsletter"}
              </span>
              <input
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
                type="file"
              />
            </span>
          </label>

          <div className="rounded-lg border border-[var(--color-border)] p-4">
            <p className="text-sm font-semibold">Recipients</p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Confirmed subscriber count will appear when newsletter data is
              connected.
            </p>
          </div>

          {message && (
            <p className="text-sm text-[var(--color-muted)]" role="status">
              {message}
            </p>
          )}

          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-5 font-semibold text-white hover:brightness-110"
            type="submit"
          >
            <Send aria-hidden="true" className="h-4 w-4" />
            Send newsletter
          </button>
          <p className="text-xs text-[var(--color-muted)]">
            Sending is not connected yet, so this will not email subscribers.
          </p>
        </form>

        <aside
          aria-label="Newsletter preview"
          className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
        >
          <div className="border-b border-[var(--color-border)] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Email preview
            </p>
            <h2 className="mt-1 font-semibold">
              {subject || "Your subject line"}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {previewText || "Inbox preview text will appear here."}
            </p>
          </div>
          <article className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
              Catlas newsletter
            </p>
            <h3 className="mt-5 font-[var(--font-heading)] text-2xl font-bold">
              {title || "Newsletter title"}
            </h3>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--color-muted)]">
              {body || "Your newsletter content preview will appear here."}
            </p>
            <div className="mt-8 border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-muted)]">
              Catlas updates · Unsubscribe link will be included in the email
            </div>
          </article>
        </aside>
      </div>
    </FounderPageLayout>
  );
}
