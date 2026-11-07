"use client";

type CalmCatProps = {
  className?: string;
  size?: number;
};

// The calm cat rests with open eyes, then closes them and wags its tail.
export function CalmCat({
  className,
  size = 120,
}: CalmCatProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 132 136"
      width={size}
    >
      <g className="calm-cat-breathe">
        <path
          className="calm-cat-tail"
          d="M88 112 C 112 118, 128 106, 122 82"
          stroke="#f2f0ec"
          strokeLinecap="round"
          strokeWidth="9"
        />
        <ellipse
          cx="60"
          cy="104"
          rx="32"
          ry="26"
          stroke="#3a3d45"
          strokeWidth="2.5"
          fill="#f2f0ec"
        />
        <path
          className="calm-cat-front-paws"
          d="M46 128 Q 46 122 52 122 L 62 122 M 84 128 Q 84 122 78 122 L 68 122"
          stroke="#f2f0ec"
          strokeLinecap="round"
          strokeWidth="9"
        />
        <path
          d="M42 44 L 37 19 L 58 32 Z"
          stroke="#3a3d45"
          strokeLinejoin="round"
          strokeWidth="2.5"
          fill="#f2f0ec"
        />
        <path
          d="M46.5 39 L 43.5 26.5 L 53.5 32.5 Z"
          fill="#2563eb"
          opacity="0.85"
        />
        <path
          d="M78 44 L 83 19 L 62 32 Z"
          stroke="#3a3d45"
          strokeLinejoin="round"
          strokeWidth="2.5"
          fill="#f2f0ec"
        />
        <path
          d="M73.5 39 L 76.5 26.5 L 66.5 32.5 Z"
          fill="#2563eb"
          opacity="0.85"
        />
        <circle
          cx="60"
          cy="58"
          r="26"
          stroke="#3a3d45"
          strokeWidth="2.5"
          fill="#f2f0ec"
        />
        <g className="calm-cat-eyes-open">
          <ellipse cx="50" cy="53" rx="4.5" ry="6.5" fill="#d6a84f" />
          <ellipse cx="70" cy="53" rx="4.5" ry="6.5" fill="#d6a84f" />
          <ellipse cx="50" cy="53" rx="1.4" ry="4.7" fill="#24262c" />
          <ellipse cx="70" cy="53" rx="1.4" ry="4.7" fill="#24262c" />
          <circle cx="48.8" cy="50.8" r="1.1" fill="#fff" />
          <circle cx="68.8" cy="50.8" r="1.1" fill="#fff" />
        </g>
        <g className="calm-cat-eyes-closed">
          <path
            d="M45 54 q 5 5 10 0 M65 54 q 5 5 10 0"
            stroke="#3a3d45"
            strokeLinecap="round"
            strokeWidth="2.6"
          />
        </g>
        <path
          d="M60 62 L 62 59 L 58 59 Z"
          fill="#3a3d45"
        />
        <path
          d="M60 62.5 v 2.5"
          stroke="#3a3d45"
          strokeLinecap="round"
          strokeWidth="2"
        />
        {/* Small, unbothered mouth */}
        <path
          d="M60 65 q -2.5 2 -5 .5 M60 65 q 2.5 2 5 .5"
          stroke="#3a3d45"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d="M36 58 L 20 53 M36 63 L 20 64 M84 58 L 100 53 M84 63 L 100 64"
          stroke="#3a3d45"
          strokeLinecap="round"
          strokeWidth="1.7"
          opacity="0.75"
        />
      </g>
      <style jsx>{`
        .calm-cat-tail {
          transform-origin: 90px 112px;
          animation: calm-cat-tail-cycle 5s linear infinite;
        }

        .calm-cat-breathe {
          transform-origin: 60px 128px;
          animation: calm-cat-breathe 4.6s ease-in-out infinite alternate;
        }

        .calm-cat-eyes-open {
          animation: calm-cat-eyes-open 5s linear infinite;
        }

        .calm-cat-eyes-closed {
          opacity: 0;
          animation: calm-cat-eyes-closed 5s linear infinite;
        }

        .calm-cat-front-paws {
          transform-origin: 65px 122px;
          animation: calm-cat-knead 4.6s ease-in-out infinite alternate;
        }

        @keyframes calm-cat-tail-cycle {
          0%,
          79% {
            transform: rotate(0deg);
          }
          80% {
            transform: rotate(-13deg);
          }
          82% {
            transform: rotate(13deg);
          }
          84% {
            transform: rotate(-13deg);
          }
          86% {
            transform: rotate(13deg);
          }
          88% {
            transform: rotate(-13deg);
          }
          90% {
            transform: rotate(13deg);
          }
          92% {
            transform: rotate(-13deg);
          }
          94% {
            transform: rotate(13deg);
          }
          96% {
            transform: rotate(-12deg);
          }
          98% {
            transform: rotate(9deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        @keyframes calm-cat-breathe {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.025);
          }
        }

        @keyframes calm-cat-eyes-open {
          0%,
          80% {
            opacity: 1;
          }
          81%,
          100% {
            opacity: 0;
          }
        }

        @keyframes calm-cat-eyes-closed {
          0%,
          80% {
            opacity: 0;
          }
          81%,
          100% {
            opacity: 1;
          }
        }

        @keyframes calm-cat-knead {
          from {
            transform: translateX(-1.5px);
          }
          to {
            transform: translateX(1.5px);
          }
        }
      `}</style>
    </svg>
  );
}
