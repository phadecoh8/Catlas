type CatlasLogoProps = {
  className?: string;
};

export function CatlasLogo({ className }: CatlasLogoProps) {
  return (
    <span
      aria-hidden="true"
      className={`catlas-logo ${className ?? ""}`}
    >
      <svg
        focusable="false"
        viewBox="0 0 80 80"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="40"
          cy="40"
          fill="var(--color-primary)"
          r="39"
        />
        <path
          d="m16 35-2-20c0-2 2-3 4-2l12 10c6-3 14-3 20 0l12-10c2-1 4 0 4 2l-2 20c6 5 9 12 9 20 0 14-12 23-33 23S7 69 7 55c0-8 3-15 9-20Z"
          fill="var(--cat-fur-light)"
        />
        <path
          d="M18 31 17 18l11 9Zm44 0 1-13-11 9Z"
          fill="var(--color-primary-hover)"
          stroke="var(--color-primary-hover)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <ellipse
          cx="29"
          cy="48"
          fill="var(--cat-eye)"
          rx="2.5"
          ry="4"
        />
        <ellipse
          cx="51"
          cy="48"
          fill="var(--cat-eye)"
          rx="2.5"
          ry="4"
        />
        <path
          d="m37 55 3 2 3-2-3-2z"
          fill="var(--cat-nose)"
        />
        <path
          d="M37 60q3 3 6 0"
          fill="none"
          stroke="var(--cat-eye)"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
