"use client"

import { cn } from "@/lib/utils"

const ROBOT_COLORS = [
  { body: "#4ECDC4", accent: "#3BA89F", highlight: "#A8F0EA", membrane: "#3BB8B0" },
  { body: "#FF6B6B", accent: "#CC5555", highlight: "#FFB3B3", membrane: "#E05A5A" },
  { body: "#FFB84D", accent: "#CC9340", highlight: "#FFD999", membrane: "#E0A040" },
  { body: "#7C83FD", accent: "#5F65CC", highlight: "#B5B9FE", membrane: "#6A70E0" },
  { body: "#95E66A", accent: "#76B854", highlight: "#C5F0A8", membrane: "#82CC5C" },
]

const HATS = [
  null,
  "flagellum",
  "eyestalk",
  "spikes",
  "cilia",
  "proboscis",
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
        <defs>
          <radialGradient id={`bodyGrad-${colorIndex}`} cx="40%" cy="35%">
            <stop offset="0%" stopColor={color.highlight} stopOpacity="0.9" />
            <stop offset="50%" stopColor={color.body} stopOpacity="0.85" />
            <stop offset="100%" stopColor={color.membrane} stopOpacity="0.75" />
          </radialGradient>
          <radialGradient id={`innerGrad-${colorIndex}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor={color.highlight} stopOpacity="0.5" />
            <stop offset="100%" stopColor={color.body} stopOpacity="0.2" />
          </radialGradient>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo" />
          </filter>
        </defs>

        {/* Appendage - flagellum (wavy tail) */}
        {hat === "flagellum" && (
          <path
            d="M100,160 Q85,175 95,190 Q105,205 90,215"
            stroke={color.accent}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
          >
            <animate
              attributeName="d"
              values="M100,160 Q85,175 95,190 Q105,205 90,215;M100,160 Q115,175 105,190 Q95,205 110,215;M100,160 Q85,175 95,190 Q105,205 90,215"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </path>
        )}

        {/* Appendage - eyestalk */}
        {hat === "eyestalk" && (
          <g>
            <path d="M100,50 Q95,30 90,18" stroke={color.accent} strokeWidth="3.5" fill="none" strokeLinecap="round">
              <animate
                attributeName="d"
                values="M100,50 Q95,30 90,18;M100,50 Q105,28 108,16;M100,50 Q95,30 90,18"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </path>
            <circle cx="90" cy="16" r="7" fill="white" stroke={color.accent} strokeWidth="1.5">
              <animate attributeName="cx" values="90;108;90" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="cy" values="16;14;16" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="90" cy="16" r="3.5" fill="#2D2D2D">
              <animate attributeName="cx" values="90;108;90" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="cy" values="16;14;16" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="91" cy="14" r="1.5" fill="white">
              <animate attributeName="cx" values="91;109;91" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="cy" values="14;12;14" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* Appendage - spikes */}
        {hat === "spikes" && (
          <g>
            <ellipse cx="100" cy="40" rx="5" ry="12" fill={color.accent} opacity="0.7" transform="rotate(0 100 55)" />
            <ellipse cx="78" cy="50" rx="4" ry="10" fill={color.accent} opacity="0.6" transform="rotate(-30 78 60)" />
            <ellipse cx="122" cy="50" rx="4" ry="10" fill={color.accent} opacity="0.6" transform="rotate(30 122 60)" />
            <ellipse cx="68" cy="70" rx="3.5" ry="8" fill={color.accent} opacity="0.5" transform="rotate(-55 68 75)" />
            <ellipse cx="132" cy="70" rx="3.5" ry="8" fill={color.accent} opacity="0.5" transform="rotate(55 132 75)" />
          </g>
        )}

        {/* Appendage - cilia (little hairs all around) */}
        {hat === "cilia" && (
          <g opacity="0.6">
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i / 16) * Math.PI * 2 - Math.PI / 2
              const cx = 100
              const cy = 95
              const rx = 52
              const ry = 58
              const x1 = cx + rx * Math.cos(angle)
              const y1 = cy + ry * Math.sin(angle)
              const x2 = cx + (rx + 12) * Math.cos(angle)
              const y2 = cy + (ry + 12) * Math.sin(angle)
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={color.accent}
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <animate
                    attributeName="x2"
                    values={`${x2};${cx + (rx + 15) * Math.cos(angle + 0.1)};${x2}`}
                    dur={`${0.6 + (i % 3) * 0.15}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="y2"
                    values={`${y2};${cy + (ry + 15) * Math.sin(angle + 0.1)};${y2}`}
                    dur={`${0.6 + (i % 3) * 0.15}s`}
                    repeatCount="indefinite"
                  />
                </line>
              )
            })}
          </g>
        )}

        {/* Appendage - proboscis (feeding tube) */}
        {hat === "proboscis" && (
          <g>
            <path
              d="M110,110 Q135,108 155,95 Q165,88 170,80"
              stroke={color.accent}
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            >
              <animate
                attributeName="d"
                values="M110,110 Q135,108 155,95 Q165,88 170,80;M110,110 Q135,115 158,108 Q168,102 172,92;M110,110 Q135,108 155,95 Q165,88 170,80"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>
            <circle cx="170" cy="80" r="3" fill={color.highlight}>
              <animate attributeName="cx" values="170;172;170" dur="2s" repeatCount="indefinite" />
              <animate attributeName="cy" values="80;92;80" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* Pseudopod nubs (little blobby feet) */}
        <ellipse cx="80" cy="152" rx="14" ry="8" fill={color.body} opacity="0.7">
          <animate
            attributeName="rx"
            values="14;16;14"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="120" cy="152" rx="14" ry="8" fill={color.body} opacity="0.7">
          <animate
            attributeName="rx"
            values="14;16;14"
            dur="1.5s"
            begin="0.75s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Little arm-like pseudopods */}
        <ellipse cx="48" cy="95" rx="10" ry="16" fill={color.body} opacity="0.65" transform="rotate(-20 48 95)">
          {isAdventuring && (
            <animateTransform attributeName="transform" type="rotate" values="-20 48 95;-35 48 95;-5 48 95;-20 48 95" dur="0.6s" repeatCount="indefinite" />
          )}
        </ellipse>
        <ellipse cx="152" cy="95" rx="10" ry="16" fill={color.body} opacity="0.65" transform="rotate(20 152 95)">
          {isAdventuring && (
            <animateTransform attributeName="transform" type="rotate" values="20 152 95;5 152 95;35 152 95;20 152 95" dur="0.6s" repeatCount="indefinite" />
          )}
        </ellipse>

        {/* Main body - organic blobby shape */}
        <ellipse
          cx="100"
          cy="95"
          rx="48"
          ry="55"
          fill={`url(#bodyGrad-${colorIndex})`}
          stroke={color.membrane}
          strokeWidth="2.5"
          opacity="0.9"
        >
          <animate
            attributeName="rx"
            values="48;50;47;50;48"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="ry"
            values="55;53;56;53;55"
            dur="3s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Inner organelles / nucleus */}
        <ellipse cx="95" cy="108" rx="16" ry="14" fill={`url(#innerGrad-${colorIndex})`} opacity="0.5">
          <animate attributeName="cx" values="95;98;93;95" dur="5s" repeatCount="indefinite" />
          <animate attributeName="cy" values="108;112;106;108" dur="5s" repeatCount="indefinite" />
        </ellipse>
        <circle cx="112" cy="118" r="6" fill={color.highlight} opacity="0.25">
          <animate attributeName="cx" values="112;108;114;112" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="82" cy="120" r="4" fill={color.highlight} opacity="0.2">
          <animate attributeName="cy" values="120;116;122;120" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="105" cy="125" r="3" fill={color.highlight} opacity="0.2">
          <animate attributeName="cx" values="105;108;103;105" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Membrane highlight / shine */}
        <ellipse cx="82" cy="68" rx="22" ry="10" fill="white" opacity="0.15" transform="rotate(-15 82 68)" />

        {/* Eyes - big cute cell eyes */}
        <g>
          {/* Left eye */}
          <ellipse cx="84" cy="82" rx="14" ry="16" fill="white" stroke={color.membrane} strokeWidth="1.5" />
          <ellipse cx="87" cy="81" rx="8" ry="10" fill="#2D2D2D">
            <animate attributeName="cx" values="87;90;87;84;87" dur="4s" repeatCount="indefinite" />
          </ellipse>
          <circle cx="90" cy="77" r="3.5" fill="white" opacity="0.9" />
          <circle cx="84" cy="85" r="1.5" fill="white" opacity="0.5" />

          {/* Right eye */}
          <ellipse cx="116" cy="82" rx="14" ry="16" fill="white" stroke={color.membrane} strokeWidth="1.5" />
          <ellipse cx="119" cy="81" rx="8" ry="10" fill="#2D2D2D">
            <animate attributeName="cx" values="119;122;119;116;119" dur="4s" repeatCount="indefinite" />
          </ellipse>
          <circle cx="122" cy="77" r="3.5" fill="white" opacity="0.9" />
          <circle cx="116" cy="85" r="1.5" fill="white" opacity="0.5" />
        </g>

        {/* Mouth - cute little cell mouth */}
        <path
          d={isAdventuring ? "M90,105 Q100,118 110,105" : "M92,105 Q100,113 108,105"}
          stroke={color.membrane}
          strokeWidth="2.5"
          fill={isAdventuring ? color.accent : "none"}
          fillOpacity="0.3"
          strokeLinecap="round"
        />

        {/* Cheek blush - rosy spots */}
        <ellipse cx="68" cy="95" rx="7" ry="4" fill="#FF9999" opacity="0.35" />
        <ellipse cx="132" cy="95" rx="7" ry="4" fill="#FF9999" opacity="0.35" />

        {/* Tiny food vacuoles / internal dots when adventuring */}
        {isAdventuring && (
          <g>
            <circle cx="90" cy="130" r="2.5" fill={color.highlight} opacity="0.5">
              <animate attributeName="cy" values="130;110;90;130" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0.8;0.2;0.5" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="110" cy="125" r="2" fill={color.highlight} opacity="0.4">
              <animate attributeName="cy" values="125;105;85;125" dur="2.3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.7;0.1;0.4" dur="2.3s" repeatCount="indefinite" />
            </circle>
          </g>
        )}
      </svg>

      {/* Floating particles when adventuring */}
      {isAdventuring && (
        <>
          <span className="absolute top-1 left-6 h-2 w-2 rounded-full bg-primary/40 animate-ping" style={{ animationDuration: "1.5s" }} />
          <span className="absolute top-10 right-3 h-1.5 w-1.5 rounded-full bg-accent/50 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.5s" }} />
          <span className="absolute bottom-10 left-3 h-1.5 w-1.5 rounded-full bg-primary/30 animate-ping" style={{ animationDuration: "1.8s", animationDelay: "1s" }} />
        </>
      )}
    </div>
  )
}

export { ROBOT_COLORS, HATS }
