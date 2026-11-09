"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      className="settings-signout-button"
      onClick={() => void signOut({ redirectTo: "/login" })}
      type="button"
    >
      Log out
    </button>
  );
}
