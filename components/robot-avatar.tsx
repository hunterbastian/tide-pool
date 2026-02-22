"use client"

import { cn } from "@/lib/utils"

const ROBOT_COLORS = [
  { body: "#4ECDC4", accent: "#3BA89F", highlight: "#7EDDD6" },
  { body: "#FF6B6B", accent: "#CC5555", highlight: "#FF9999" },
  { body: "#FFB84D", accent: "#CC9340", highlight: "#FFCC80" },
  { body: "#7C83FD", accent: "#5F65CC", highlight: "#A5AAFE" },
  { body: "#95E66A", accent: "#76B854", highlight: "#B5F09A" },
]

const HATS = [
  null, // no hat
  "propeller",
  "crown",
  "antenna",
  "bow",
  "tophat",
]

interface RobotAvatarProps {
  colorIndex: number
  hatIndex: number
  isAdventuring?: boolean
  size?: number
  className?: string
}

export function RobotAvatar({
  colorIndex,
  hatIndex,
  isAdventuring = false,
  size = 200,
  className,
}: RobotAvatarProps) {
  const color = ROBOT_COLORS[colorIndex % ROBOT_COLORS.length]
  const hat = HATS[hatIndex % HATS.length]

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className={cn(
          "drop-shadow-lg",
          isAdventuring && "animate-bounce"
        )}
      >
        {/* Hat */}
        {hat === "propeller" && (
          <g>
            <line x1="80" y1="38" x2="120" y2="28" stroke={color.accent} strokeWidth="3" strokeLinecap="round">
              <animateTransform attributeName="transform" type="rotate" values="0 100 40;15 100 40;-15 100 40;0 100 40" dur="0.6s" repeatCount="indefinite" />
            </line>
            <line x1="120" y1="38" x2="80" y2="28" stroke={color.accent} strokeWidth="3" strokeLinecap="round">
              <animateTransform attributeName="transform" type="rotate" values="0 100 40;15 100 40;-15 100 40;0 100 40" dur="0.6s" repeatCount="indefinite" />
            </line>
            <circle cx="100" cy="36" r="4" fill={color.accent} />
          </g>
        )}
        {hat === "crown" && (
          <g>
            <polygon points="78,44 82,28 90,38 100,22 110,38 118,28 122,44" fill="#FFD700" stroke="#E6BE00" strokeWidth="1.5" />
            <circle cx="90" cy="32" r="2" fill="#FF6B6B" />
            <circle cx="100" cy="26" r="2" fill="#4ECDC4" />
            <circle cx="110" cy="32" r="2" fill="#7C83FD" />
          </g>
        )}
        {hat === "antenna" && (
          <g>
            <line x1="100" y1="44" x2="100" y2="20" stroke={color.accent} strokeWidth="2.5" />
            <circle cx="100" cy="17" r="5" fill="#FF6B6B">
              <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />
            </circle>
          </g>
        )}
        {hat === "bow" && (
          <g>
            <path d="M82,42 Q74,30 84,36 Q88,38 88,42 Z" fill="#FF69B4" />
            <path d="M118,42 Q126,30 116,36 Q112,38 112,42 Z" fill="#FF69B4" />
            <circle cx="100" cy="42" r="4" fill="#FF1493" />
          </g>
        )}
        {hat === "tophat" && (
          <g>
            <rect x="82" y="18" width="36" height="26" rx="3" fill="#2D2D2D" />
            <rect x="76" y="40" width="48" height="6" rx="3" fill="#2D2D2D" />
            <rect x="82" y="34" width="36" height="4" fill="#FFD700" />
          </g>
        )}

        {/* Body */}
        <rect x="72" y="95" width="56" height="52" rx="12" fill={color.body} stroke={color.accent} strokeWidth="2" />

        {/* Belly light */}
        <circle cx="100" cy="115" r="8" fill={color.highlight} opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="115" r="4" fill="white" opacity="0.8">
          <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Bolts on body */}
        <circle cx="82" cy="105" r="2" fill={color.accent} />
        <circle cx="118" cy="105" r="2" fill={color.accent} />
        <circle cx="82" cy="130" r="2" fill={color.accent} />
        <circle cx="118" cy="130" r="2" fill={color.accent} />

        {/* Head */}
        <rect x="70" y="44" width="60" height="48" rx="14" fill={color.body} stroke={color.accent} strokeWidth="2" />

        {/* Eyes */}
        <g>
          <ellipse cx="87" cy="64" rx="9" ry="10" fill="white" stroke={color.accent} strokeWidth="1.5" />
          <ellipse cx="113" cy="64" rx="9" ry="10" fill="white" stroke={color.accent} strokeWidth="1.5" />
          <circle cx="89" cy="63" r="5" fill="#2D2D2D">
            <animate attributeName="cx" values="89;91;89;87;89" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="115" cy="63" r="5" fill="#2D2D2D">
            <animate attributeName="cx" values="115;117;115;113;115" dur="4s" repeatCount="indefinite" />
          </circle>
          {/* Eye shine */}
          <circle cx="91" cy="61" r="2" fill="white" />
          <circle cx="117" cy="61" r="2" fill="white" />
        </g>

        {/* Mouth */}
        <path
          d={isAdventuring ? "M92,78 Q100,88 108,78" : "M92,78 Q100,84 108,78"}
          stroke={color.accent}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Cheek blush */}
        <ellipse cx="77" cy="75" rx="5" ry="3" fill="#FF9999" opacity="0.5" />
        <ellipse cx="123" cy="75" rx="5" ry="3" fill="#FF9999" opacity="0.5" />

        {/* Ears / Side panels */}
        <rect x="60" y="56" width="10" height="18" rx="4" fill={color.accent} />
        <rect x="130" y="56" width="10" height="18" rx="4" fill={color.accent} />

        {/* Arms */}
        <g>
          <rect x="55" y="100" width="14" height="36" rx="7" fill={color.accent}>
            {isAdventuring && (
              <animateTransform attributeName="transform" type="rotate" values="0 62 100;-15 62 100;0 62 100;15 62 100;0 62 100" dur="0.5s" repeatCount="indefinite" />
            )}
          </rect>
          <circle cx="62" cy="138" r="7" fill={color.body} stroke={color.accent} strokeWidth="1.5">
            {isAdventuring && (
              <animateTransform attributeName="transform" type="rotate" values="0 62 100;-15 62 100;0 62 100;15 62 100;0 62 100" dur="0.5s" repeatCount="indefinite" />
            )}
          </circle>
        </g>
        <g>
          <rect x="131" y="100" width="14" height="36" rx="7" fill={color.accent}>
            {isAdventuring && (
              <animateTransform attributeName="transform" type="rotate" values="0 138 100;15 138 100;0 138 100;-15 138 100;0 138 100" dur="0.5s" repeatCount="indefinite" />
            )}
          </rect>
          <circle cx="138" cy="138" r="7" fill={color.body} stroke={color.accent} strokeWidth="1.5">
            {isAdventuring && (
              <animateTransform attributeName="transform" type="rotate" values="0 138 100;15 138 100;0 138 100;-15 138 100;0 138 100" dur="0.5s" repeatCount="indefinite" />
            )}
          </circle>
        </g>

        {/* Legs */}
        <rect x="82" y="148" width="14" height="24" rx="6" fill={color.accent} />
        <rect x="104" y="148" width="14" height="24" rx="6" fill={color.accent} />

        {/* Feet */}
        <ellipse cx="89" cy="174" rx="11" ry="6" fill={color.body} stroke={color.accent} strokeWidth="1.5" />
        <ellipse cx="111" cy="174" rx="11" ry="6" fill={color.body} stroke={color.accent} strokeWidth="1.5" />
      </svg>

      {/* Sparkle effects when adventuring */}
      {isAdventuring && (
        <>
          <span className="absolute top-2 left-4 text-lg animate-ping" style={{ animationDuration: "1.5s" }}>{"*"}</span>
          <span className="absolute top-8 right-2 text-sm animate-ping" style={{ animationDuration: "2s", animationDelay: "0.5s" }}>{"*"}</span>
          <span className="absolute bottom-8 left-2 text-base animate-ping" style={{ animationDuration: "1.8s", animationDelay: "1s" }}>{"*"}</span>
        </>
      )}
    </div>
  )
}

export { ROBOT_COLORS, HATS }
