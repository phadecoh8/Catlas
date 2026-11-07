"use client";

import { useState, type FormEvent } from "react";

export function DeleteAccountDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function deleteAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (confirmation !== "delete account" || !password) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/v1/me", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          confirmation,
          password,
        }),
      });

      if (!response.ok) {
        setErrorMessage(
          "We could not delete your account. Please try again later.",
        );
        return;
      }

      window.location.assign("/login");
    } catch {
      setErrorMessage(
        "We could not delete your account. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function closeDialog() {
    setIsOpen(false);
    setConfirmation("");
    setPassword("");
    setErrorMessage("");
  }

  return (
    <>
      <button
        className="delete-account-trigger"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Delete account
      </button>

      {isOpen ? (
        <div
          className="delete-account-overlay"
          onClick={closeDialog}
          role="presentation"
        >
          <section
            aria-describedby="delete-account-warning"
            aria-labelledby="delete-account-heading"
            aria-modal="true"
            className="delete-account-dialog"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <h2 id="delete-account-heading">
              Type delete account to confirm
            </h2>
            <form onSubmit={deleteAccount}>
              <label className="sr-only" htmlFor="delete-account-confirmation">
                Type delete account to confirm
              </label>
              <input
                autoComplete="off"
                id="delete-account-confirmation"
                onChange={(event) => setConfirmation(event.target.value)}
                placeholder="delete account"
                value={confirmation}
              />
              <label htmlFor="delete-account-password">Password</label>
              <input
                autoComplete="current-password"
                id="delete-account-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                type="password"
                value={password}
              />
              <p id="delete-account-warning">
                This cannot be undone. Your data is removed immediately.
              </p>
              {errorMessage ? (
                <p className="delete-account-error" role="alert">
                  {errorMessage}
                </p>
              ) : null}
              <div className="delete-account-actions">
                <button
                  className="delete-account-cancel"
                  onClick={closeDialog}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="delete-account-confirm"
                  disabled={
                    confirmation !== "delete account" ||
                    !password ||
                    isSubmitting
                  }
                  type="submit"
                >
                  {isSubmitting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
