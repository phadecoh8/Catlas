"use client";

type HappyCatProps = {
  className?: string;
  size?: number;
};

// Animated happy cat. It is drawn inline instead of loaded from an SVG
// file so the tail sway and breathing can be styled like any other
// element. It shows in success moments: arrival, account created and
// email verified.
export function HappyCat({
  className,
  size = 120,
}: HappyCatProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 132 136"
      width={size}
    >
      <g className="happy-cat-hop">
        <path
          className="happy-cat-tail"
          d="M90 102 C 114 108, 128 94, 120 70"
          stroke="#f2f0ec"
          strokeLinecap="round"
          strokeWidth="9"
        />
        <g className="happy-cat-breathe">
          <ellipse
            cx="60"
            cy="102"
            rx="30"
            ry="24"
            stroke="#3a3d45"
            strokeWidth="2.5"
            fill="#f2f0ec"
          />
          <ellipse
            cx="50"
            cy="123"
            rx="8"
            ry="5.5"
            stroke="#3a3d45"
            strokeWidth="2.2"
            fill="#f2f0ec"
          />
          <ellipse
            cx="70"
            cy="123"
            rx="8"
            ry="5.5"
            stroke="#3a3d45"
            strokeWidth="2.2"
            fill="#f2f0ec"
          />
          <path
            d="M42 42 L 37 17 L 58 30 Z"
            stroke="#3a3d45"
            strokeLinejoin="round"
            strokeWidth="2.5"
            fill="#f2f0ec"
          />
          <path
            d="M46.5 37 L 43.5 24.5 L 53.5 30.5 Z"
            fill="#2563eb"
            opacity="0.85"
          />
          <path
            d="M78 42 L 83 17 L 62 30 Z"
            stroke="#3a3d45"
            strokeLinejoin="round"
            strokeWidth="2.5"
            fill="#f2f0ec"
          />
          <path
            d="M73.5 37 L 76.5 24.5 L 66.5 30.5 Z"
            fill="#2563eb"
            opacity="0.85"
          />
          <circle
            cx="60"
            cy="56"
            r="26"
            stroke="#3a3d45"
            strokeWidth="2.5"
            fill="#f2f0ec"
          />
          <ellipse
            cx="58"
            cy="79"
            rx="16"
            ry="4"
            fill="#1d4ed8"
          />
          <ellipse
            cx="42"
            cy="63"
            rx="5"
            ry="3"
            fill="#9db4ff"
            opacity="0.55"
          />
          <ellipse
            cx="78"
            cy="63"
            rx="5"
            ry="3"
            fill="#9db4ff"
            opacity="0.55"
          />
          <path
            d="M45 54 q 5 -7 10 0"
            stroke="#3a3d45"
            strokeLinecap="round"
            strokeWidth="2.6"
          />
          <path
            d="M65 54 q 5 -7 10 0"
            stroke="#3a3d45"
            strokeLinecap="round"
            strokeWidth="2.6"
          />
          <path
            d="M60 58 L 62 55 L 58 55 Z"
            fill="#3a3d45"
          />
          <path
            d="M60 58.5 v 3"
            stroke="#3a3d45"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path
            d="M60 61.5 q -3.5 3.5 -7 1 M60 61.5 q 3.5 3.5 7 1"
            stroke="#3a3d45"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path
            d="M36 56 L 20 51 M36 61 L 20 62 M84 56 L 100 51 M84 61 L 100 62"
            stroke="#3a3d45"
            strokeLinecap="round"
            strokeWidth="1.7"
            opacity="0.75"
          />
        </g>
      </g>
      <style jsx>{`
        .happy-cat-tail {
          transform-origin: 92px 102px;
          animation: happy-cat-sway 2.6s ease-in-out infinite alternate;
        }

        .happy-cat-breathe {
          transform-origin: 60px 126px;
          animation: happy-cat-breathe 3.4s ease-in-out infinite alternate;
        }

        .happy-cat-hop {
          animation: happy-cat-hop 3.4s ease-in-out infinite;
        }

        @keyframes happy-cat-sway {
          from {
            transform: rotate(-9deg);
          }
          to {
            transform: rotate(13deg);
          }
        }

        @keyframes happy-cat-breathe {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.03);
          }
        }

        @keyframes happy-cat-hop {
          0%,
          55%,
          100% {
            transform: translateY(0);
          }
          70% {
            transform: translateY(-4px);
          }
          78% {
            transform: translateY(-2px);
          }
        }
      `}</style>
    </svg>
  );
}
