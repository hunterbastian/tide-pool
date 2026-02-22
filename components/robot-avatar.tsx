"use client"

import { cn } from "@/lib/utils"

const CELL_COLORS = [
  { body: "#3a7a68", accent: "#1a5a48", highlight: "#5a9a80", membrane: "#2a6a58", glow: "rgba(58,122,104,0.2)" },
  { body: "#8a4040", accent: "#6a2828", highlight: "#aa6060", membrane: "#7a3535", glow: "rgba(138,64,64,0.2)" },
  { body: "#8a7a40", accent: "#6a5a20", highlight: "#aa9a60", membrane: "#7a6a30", glow: "rgba(138,122,64,0.2)" },
  { body: "#506080", accent: "#304060", highlight: "#708aa0", membrane: "#405070", glow: "rgba(80,96,128,0.2)" },
  { body: "#5a8a4a", accent: "#3a6a2a", highlight: "#7aaa6a", membrane: "#4a7a3a", glow: "rgba(90,138,74,0.2)" },
]

const APPENDAGES = [
  null,
  "flagellum",
  "eyestalk",
  "spikes",
  "cilia",
  "proboscis",
]

interface CellAvatarProps {
  colorIndex: number
  hatIndex: number
  isAdventuring?: boolean
  size?: number
  className?: string
  ownedUpgrades?: string[]
}

export function RobotAvatar({
  colorIndex,
  hatIndex,
  isAdventuring = false,
  size = 200,
  className,
  ownedUpgrades = [],
}: CellAvatarProps) {
  const color = CELL_COLORS[colorIndex % CELL_COLORS.length]
  const appendage = APPENDAGES[hatIndex % APPENDAGES.length]

  // Determine visual evolution based on owned upgrades
  const has = (id: string) => ownedUpgrades.includes(id)
  const hasToxin = has("tox-1") || has("tox-2") || has("tox-3")
  const hasAcid = has("tox-3")
  const hasChitin = has("mem-2") || has("mem-3")
  const hasSporeCasing = has("mem-3")
  const hasCilia = has("mot-1")
  const hasFlagellum = has("mot-2") || has("mot-3")
  const hasJet = has("mot-3")
  const hasEye = has("ada-1") || has("ada-2") || has("ada-3")
  const hasNeural = has("ada-3")
  const hasChloro = has("idle-1")
  const hasMito = has("idle-2")
  const hasSymbiote = has("idle-3")

  // Membrane thickness based on defense upgrades
  const membraneWidth = hasChitin ? (hasSporeCasing ? 5 : 3.5) : 2

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className={cn(isAdventuring && "animate-bounce")}
        style={{ filter: `drop-shadow(0 0 8px ${color.glow})` }}
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
          {/* Glow filter for toxin spots */}
          <filter id="toxGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Chitin texture pattern */}
          {hasChitin && (
            <pattern id="chitinPattern" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill="none" />
              <circle cx="4" cy="4" r="0.8" fill={color.accent} opacity="0.3" />
            </pattern>
          )}
        </defs>

        {/* === FLAGELLUM (appendage or motility upgrade) === */}
        {(appendage === "flagellum" || hasFlagellum) && (
          <g>
            <path
              d="M100,155 Q85,175 95,190 Q105,205 90,215 Q80,220 85,230"
              stroke={hasJet ? "#40e0ff" : color.accent}
              strokeWidth={hasJet ? 4 : 3}
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            >
              <animate
                attributeName="d"
                values="M100,155 Q85,175 95,190 Q105,205 90,215 Q80,220 85,230;M100,155 Q115,175 105,190 Q95,205 110,215 Q120,220 115,230;M100,155 Q85,175 95,190 Q105,205 90,215 Q80,220 85,230"
                dur={hasJet ? "0.3s" : "0.8s"}
                repeatCount="indefinite"
              />
            </path>
            {hasJet && (
              <g opacity="0.5">
                <circle cx="85" cy="230" r="3" fill="#40e0ff">
                  <animate attributeName="r" values="3;6;3" dur="0.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0.1;0.5" dur="0.4s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
          </g>
        )}

        {/* === EYESTALK appendage === */}
        {appendage === "eyestalk" && (
          <g>
            <path d="M100,48 Q95,30 90,18" stroke={color.accent} strokeWidth="3.5" fill="none" strokeLinecap="round">
              <animate attributeName="d" values="M100,48 Q95,30 90,18;M100,48 Q105,28 108,16;M100,48 Q95,30 90,18" dur="2.5s" repeatCount="indefinite" />
            </path>
            <circle cx="90" cy="16" r="7" fill="white" stroke={color.accent} strokeWidth="1.5">
              <animate attributeName="cx" values="90;108;90" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="90" cy="16" r="3.5" fill="#2D2D2D">
              <animate attributeName="cx" values="90;108;90" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* === SPIKES appendage === */}
        {appendage === "spikes" && (
          <g>
            <polygon points="100,30 96,48 104,48" fill={color.accent} opacity="0.75" />
            <polygon points="72,42 76,58 68,58" fill={color.accent} opacity="0.65" transform="rotate(-25 72 50)" />
            <polygon points="128,42 132,58 124,58" fill={color.accent} opacity="0.65" transform="rotate(25 128 50)" />
            <polygon points="56,68 60,80 52,80" fill={color.accent} opacity="0.55" transform="rotate(-50 56 74)" />
            <polygon points="144,68 148,80 140,80" fill={color.accent} opacity="0.55" transform="rotate(50 144 74)" />
          </g>
        )}

        {/* === CILIA appendage or upgrade === */}
        {(appendage === "cilia" || hasCilia) && (
          <g opacity="0.55">
            {Array.from({ length: 18 }).map((_, i) => {
              const angle = (i / 18) * Math.PI * 2 - Math.PI / 2
              const cx = 100, cy = 95, rx = 50, ry = 56
              const x1 = cx + rx * Math.cos(angle)
              const y1 = cy + ry * Math.sin(angle)
              const x2 = cx + (rx + 10) * Math.cos(angle)
              const y2 = cy + (ry + 10) * Math.sin(angle)
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color.accent} strokeWidth="1.5" strokeLinecap="round">
                  <animate attributeName="x2" values={`${x2};${cx + (rx + 14) * Math.cos(angle + 0.08)};${x2}`} dur={`${0.5 + (i % 4) * 0.12}s`} repeatCount="indefinite" />
                  <animate attributeName="y2" values={`${y2};${cy + (ry + 14) * Math.sin(angle + 0.08)};${y2}`} dur={`${0.5 + (i % 4) * 0.12}s`} repeatCount="indefinite" />
                </line>
              )
            })}
          </g>
        )}

        {/* === PROBOSCIS appendage === */}
        {appendage === "proboscis" && (
          <g>
            <path d="M112,108 Q135,106 155,93 Q165,86 172,78" stroke={color.accent} strokeWidth="5" fill="none" strokeLinecap="round">
              <animate attributeName="d" values="M112,108 Q135,106 155,93 Q165,86 172,78;M112,108 Q135,113 158,106 Q168,100 174,90;M112,108 Q135,106 155,93 Q165,86 172,78" dur="2s" repeatCount="indefinite" />
            </path>
            <circle cx="172" cy="78" r="3" fill={color.highlight}>
              <animate attributeName="cx" values="172;174;172" dur="2s" repeatCount="indefinite" />
              <animate attributeName="cy" values="78;90;78" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* === Pseudopod feet === */}
        <ellipse cx="80" cy="148" rx="14" ry="8" fill={color.body} opacity="0.65">
          <animate attributeName="rx" values="14;16;14" dur="1.5s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="120" cy="148" rx="14" ry="8" fill={color.body} opacity="0.65">
          <animate attributeName="rx" values="14;16;14" dur="1.5s" begin="0.75s" repeatCount="indefinite" />
        </ellipse>

        {/* === Arm pseudopods === */}
        <ellipse cx="48" cy="95" rx="10" ry="16" fill={color.body} opacity="0.6" transform="rotate(-20 48 95)">
          {isAdventuring && (
            <animateTransform attributeName="transform" type="rotate" values="-20 48 95;-35 48 95;-5 48 95;-20 48 95" dur="0.6s" repeatCount="indefinite" />
          )}
        </ellipse>
        <ellipse cx="152" cy="95" rx="10" ry="16" fill={color.body} opacity="0.6" transform="rotate(20 152 95)">
          {isAdventuring && (
            <animateTransform attributeName="transform" type="rotate" values="20 152 95;5 152 95;35 152 95;20 152 95" dur="0.6s" repeatCount="indefinite" />
          )}
        </ellipse>

        {/* === MAIN BODY === */}
        <ellipse
          cx="100" cy="95" rx="48" ry="55"
          fill={`url(#bodyGrad-${colorIndex})`}
          stroke={hasSporeCasing ? "#c0a060" : color.membrane}
          strokeWidth={membraneWidth}
          opacity="0.9"
        >
          <animate attributeName="rx" values="48;50;47;50;48" dur="3s" repeatCount="indefinite" />
          <animate attributeName="ry" values="55;53;56;53;55" dur="3s" repeatCount="indefinite" />
        </ellipse>

        {/* Chitin overlay */}
        {hasChitin && (
          <ellipse cx="100" cy="95" rx="47" ry="54" fill="url(#chitinPattern)" opacity="0.4">
            <animate attributeName="rx" values="47;49;46;49;47" dur="3s" repeatCount="indefinite" />
            <animate attributeName="ry" values="54;52;55;52;54" dur="3s" repeatCount="indefinite" />
          </ellipse>
        )}

        {/* === CHLOROPLASTS (green spots) === */}
        {hasChloro && (
          <g opacity="0.5">
            <circle cx="80" cy="115" r="5" fill="#40c040" />
            <circle cx="115" cy="120" r="4" fill="#50d050" />
            <circle cx="95" cy="130" r="3.5" fill="#40c040" />
          </g>
        )}

        {/* === MITOCHONDRIA (orange/red organelles) === */}
        {hasMito && (
          <g opacity="0.45">
            <ellipse cx="108" cy="110" rx="6" ry="3.5" fill="#e08040" transform="rotate(20 108 110)">
              <animate attributeName="cx" values="108;112;108" dur="4s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="88" cy="120" rx="5" ry="3" fill="#d07030" transform="rotate(-15 88 120)">
              <animate attributeName="cy" values="120;116;120" dur="3.5s" repeatCount="indefinite" />
            </ellipse>
          </g>
        )}

        {/* === SYMBIOTE (glowing internal buddy) === */}
        {hasSymbiote && (
          <g>
            <circle cx="100" cy="115" r="8" fill="#e040a0" opacity="0.25">
              <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="115" r="4" fill="#ff60c0" opacity="0.5">
              <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="98" cy="113" r="1.5" fill="white" opacity="0.7" />
          </g>
        )}

        {/* === Inner nucleus / organelles === */}
        <ellipse cx="95" cy="108" rx="16" ry="14" fill={`url(#innerGrad-${colorIndex})`} opacity={hasNeural ? "0.7" : "0.5"}>
          <animate attributeName="cx" values="95;98;93;95" dur="5s" repeatCount="indefinite" />
        </ellipse>
        {hasNeural && (
          <g opacity="0.4">
            <line x1="95" y1="108" x2="80" y2="100" stroke="#fff" strokeWidth="1" />
            <line x1="95" y1="108" x2="110" y2="98" stroke="#fff" strokeWidth="1" />
            <line x1="95" y1="108" x2="100" y2="125" stroke="#fff" strokeWidth="1" />
            <line x1="95" y1="108" x2="82" y2="118" stroke="#fff" strokeWidth="1" />
          </g>
        )}
        <circle cx="112" cy="118" r="6" fill={color.highlight} opacity="0.25">
          <animate attributeName="cx" values="112;108;114;112" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="82" cy="120" r="4" fill={color.highlight} opacity="0.2" />

        {/* === TOXIN SPOTS === */}
        {hasToxin && (
          <g filter={hasAcid ? "url(#toxGlow)" : undefined}>
            <circle cx="70" cy="80" r="3" fill={hasAcid ? "#c0ff40" : "#c040c0"} opacity="0.6">
              <animate attributeName="opacity" values="0.6;0.9;0.6" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="130" cy="85" r="2.5" fill={hasAcid ? "#c0ff40" : "#c040c0"} opacity="0.5">
              <animate attributeName="opacity" values="0.5;0.8;0.5" dur="1.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="90" cy="135" r="2" fill={hasAcid ? "#c0ff40" : "#c040c0"} opacity="0.4" />
          </g>
        )}

        {/* Membrane shine */}
        <ellipse cx="82" cy="68" rx="22" ry="10" fill="white" opacity="0.12" transform="rotate(-15 82 68)" />

        {/* === EYES === */}
        <g>
          {/* Left eye */}
          <ellipse cx="84" cy="82" rx={hasEye ? 15 : 13} ry={hasEye ? 17 : 15} fill="white" stroke={color.membrane} strokeWidth="1.5" />
          <ellipse cx="87" cy="81" rx="8" ry="10" fill="#2D2D2D">
            <animate attributeName="cx" values="87;90;87;84;87" dur="4s" repeatCount="indefinite" />
          </ellipse>
          <circle cx="90" cy="77" r="3.5" fill="white" opacity="0.9" />
          {hasEye && <circle cx="84" cy="85" r="1.5" fill={color.highlight} opacity="0.6" />}

          {/* Right eye */}
          <ellipse cx="116" cy="82" rx={hasEye ? 15 : 13} ry={hasEye ? 17 : 15} fill="white" stroke={color.membrane} strokeWidth="1.5" />
          <ellipse cx="119" cy="81" rx="8" ry="10" fill="#2D2D2D">
            <animate attributeName="cx" values="119;122;119;116;119" dur="4s" repeatCount="indefinite" />
          </ellipse>
          <circle cx="122" cy="77" r="3.5" fill="white" opacity="0.9" />
          {hasEye && <circle cx="116" cy="85" r="1.5" fill={color.highlight} opacity="0.6" />}
        </g>

        {/* Mouth — jagged, predatory */}
        <path
          d={isAdventuring ? "M88,104 L94,110 L100,104 L106,110 L112,104" : "M90,106 Q100,112 110,106"}
          stroke={color.membrane}
          strokeWidth="2"
          fill={isAdventuring ? color.accent : "none"}
          fillOpacity="0.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Scars / irritation marks */}
        <ellipse cx="68" cy="95" rx="6" ry="3.5" fill={color.accent} opacity="0.15" />
        <ellipse cx="132" cy="95" rx="6" ry="3.5" fill={color.accent} opacity="0.15" />

        {/* Digestion particles when adventuring */}
        {isAdventuring && (
          <g>
            <circle cx="90" cy="130" r="2.5" fill={color.highlight} opacity="0.5">
              <animate attributeName="cy" values="130;110;90;130" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0.8;0.2;0.5" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="110" cy="125" r="2" fill={color.highlight} opacity="0.4">
              <animate attributeName="cy" values="125;105;85;125" dur="2.3s" repeatCount="indefinite" />
            </circle>
          </g>
        )}
      </svg>

      {/* Floating particles when adventuring */}
      {isAdventuring && (
        <>
          <span className="absolute top-1 left-6 h-2 w-2 rounded-full animate-ping" style={{ background: color.glow, animationDuration: "1.5s" }} />
          <span className="absolute top-10 right-3 h-1.5 w-1.5 rounded-full animate-ping" style={{ background: "#f0c040", animationDuration: "2s", animationDelay: "0.5s" }} />
          <span className="absolute bottom-10 left-3 h-1.5 w-1.5 rounded-full animate-ping" style={{ background: color.glow, animationDuration: "1.8s", animationDelay: "1s" }} />
        </>
      )}
    </div>
  )
}

export { CELL_COLORS as ROBOT_COLORS, APPENDAGES as HATS }
