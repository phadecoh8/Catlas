"use client";

type CryingCatProps = {
  className?: string;
  size?: number;
  variant?: "crying" | "searching";
};

// Animated sad cat. The crying variant shows tears and droops its ears
// for errors and empty screens. The searching variant, used on the 404
// page, scans around with a magnifying glass instead of crying.
export function CryingCat({
  className,
  size = 120,
  variant = "crying",
}: CryingCatProps) {
  const isSearching = variant === "searching";

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 140 138"
      width={size}
    >
      <g className="crying-cat-sigh">
        <path
          className="crying-cat-tail"
          d="M92 104 C 114 106, 124 94, 120 76"
          stroke="#f2f0ec"
          strokeLinecap="round"
          strokeWidth="9"
        />
        <g className="crying-cat-breathe">
          <ellipse
            cx="62"
            cy="102"
            rx="30"
            ry="24"
            stroke="#3a3d45"
            strokeWidth="2.5"
            fill="#f2f0ec"
          />
          <ellipse
            cx="52"
            cy="123"
            rx="8"
            ry="5.5"
            stroke="#3a3d45"
            strokeWidth="2.2"
            fill="#f2f0ec"
          />
          <ellipse
            cx="72"
            cy="123"
            rx="8"
            ry="5.5"
            stroke="#3a3d45"
            strokeWidth="2.2"
            fill="#f2f0ec"
          />
          <path
            d="M44 42 L 30 36 L 50 25 Z"
            stroke="#3a3d45"
            strokeLinejoin="round"
            strokeWidth="2.5"
            fill="#f2f0ec"
          />
          <path
            d="M46 38.5 L 38 34.5 L 48 29 Z"
            fill="#1d4ed8"
            opacity="0.7"
          />
          <path
            d="M80 42 L 94 36 L 74 25 Z"
            stroke="#3a3d45"
            strokeLinejoin="round"
            strokeWidth="2.5"
            fill="#f2f0ec"
          />
          <path
            d="M78 38.5 L 86 34.5 L 76 29 Z"
            fill="#1d4ed8"
            opacity="0.7"
          />
          <g className="crying-cat-head">
            <circle
              cx="62"
              cy="56"
              r="26"
              stroke="#3a3d45"
              strokeWidth="2.5"
              fill="#f2f0ec"
            />
            <path
              d="M48 47 l 11 4 M88 47 l -11 4"
              stroke="#3a3d45"
              strokeLinecap="round"
              strokeWidth="2.4"
            />
            <ellipse
              cx="54"
              cy="56"
              rx="5.5"
              ry="6"
              fill="#3a3d45"
            />
            <ellipse
              cx="70"
              cy="56"
              rx="5.5"
              ry="6"
              fill="#3a3d45"
            />
            <circle
              cx="56"
              cy="54"
              r="1.6"
              fill="#f2f0ec"
            />
            <circle
              cx="72"
              cy="54"
              r="1.6"
              fill="#f2f0ec"
            />
            {!isSearching ? (
              <>
                <path
                  className="crying-cat-tear tear-left"
                  d="M50.5 63 q 2.5 4 0 6 q -2.5 -2 0 -6"
                  fill="#4da3ff"
                />
                <path
                  className="crying-cat-tear tear-right"
                  d="M73.5 63 q 2.5 4 0 6 q -2.5 -2 0 -6"
                  fill="#4da3ff"
                />
              </>
            ) : null}
            <path
              d="M62 60 L 64 57 L 60 57 Z"
              fill="#3a3d45"
            />
            <path
              d="M57 65.5 q 5 -3 10 0 q -5 4 -10 0"
              stroke="#3a3d45"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <path
              d="M37 57 L 21 53 M37 62 L 21 63 M87 57 L 103 53 M87 62 L 103 63"
              stroke="#3a3d45"
              strokeLinecap="round"
              strokeWidth="1.7"
              opacity="0.75"
            />
          </g>
        </g>
        {isSearching ? (
          <g className="crying-cat-arm">
            <g className="crying-cat-glass-sweep">
              <path
                d="M92 102 L 104 90"
                stroke="#3a3d45"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <circle
                cx="112"
                cy="82"
                r="12"
                stroke="#2563eb"
                strokeWidth="3"
                fill="rgba(96,165,250,.14)"
              />
              <path
                d="M107 78 a 7 7 0 0 1 6 -2"
                stroke="#9dc0ff"
                strokeLinecap="round"
                strokeWidth="1.8"
              />
            </g>
            <path
              d="M88 96 q 5 -6 4 -8"
              stroke="#3a3d45"
              strokeLinecap="round"
              strokeWidth="5.5"
            />
            <ellipse
              cx="93"
              cy="103"
              rx="6.5"
              ry="5.5"
              stroke="#3a3d45"
              strokeWidth="2.2"
              fill="#f2f0ec"
            />
          </g>
        ) : null}
      </g>
      <style jsx>{`
        .crying-cat-tail {
          transform-origin: 92px 104px;
          animation: crying-cat-tail 3.6s ease-in-out infinite alternate;
        }

        .crying-cat-breathe {
          transform-origin: 62px 126px;
          animation: crying-cat-breathe 3.8s ease-in-out infinite alternate;
        }

        .crying-cat-head {
          transform-origin: 62px 76px;
          animation: crying-cat-head 4.6s ease-in-out infinite alternate;
        }

        .crying-cat-sigh {
          transform-origin: 70px 126px;
          animation: crying-cat-sigh 4.6s ease-in-out infinite;
        }

        .crying-cat-tear {
          animation: crying-cat-drop 1.9s ease-in infinite;
        }

        .tear-right {
          animation-delay: 0.9s;
        }

        .crying-cat-arm {
          transform-origin: 88px 100px;
          animation: crying-cat-arm 3.4s ease-in-out infinite alternate;
        }

        .crying-cat-glass-sweep {
          transform-origin: 92px 102px;
          animation: crying-cat-sweep 2.1s ease-in-out infinite alternate;
        }

        @keyframes crying-cat-tail {
          from {
            transform: rotate(-4deg);
          }
          to {
            transform: rotate(9deg);
          }
        }

        @keyframes crying-cat-breathe {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.02);
          }
        }

        @keyframes crying-cat-head {
          from {
            transform: rotate(-1.5deg);
          }
          to {
            transform: rotate(1.5deg);
          }
        }

        @keyframes crying-cat-sigh {
          0%,
          50%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(2.5px);
          }
          60% {
            transform: translateY(-1px);
          }
        }

        @keyframes crying-cat-drop {
          0%,
          30% {
            opacity: 0;
            transform: translateY(0);
          }
          35% {
            opacity: 1;
          }
          70%,
          100% {
            opacity: 0;
            transform: translateY(14px);
          }
        }

        @keyframes crying-cat-arm {
          from {
            transform: rotate(-5deg);
          }
          to {
            transform: rotate(4deg);
          }
        }

        @keyframes crying-cat-sweep {
          from {
            transform: rotate(-14deg);
          }
          to {
            transform: rotate(10deg);
          }
        }
      `}</style>
    </svg>
  );
}
