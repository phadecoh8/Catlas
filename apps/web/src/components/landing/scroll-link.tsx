"use client";

import {
  type MouseEvent,
  type ReactNode,
} from "react";

type ScrollLinkProps = {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  targetId: string;
};

export function ScrollLink({
  ariaLabel,
  children,
  className,
  targetId,
}: ScrollLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(targetId);

    event.preventDefault();

    if (target) {
      target.scrollIntoView();
    }
  }

  return (
    <a
      aria-label={ariaLabel}
      className={className}
      href={`#${targetId}`}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
