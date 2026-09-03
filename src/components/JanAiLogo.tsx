import React from 'react';

interface JanAiLogoProps {
  variant?: 'emblem' | 'horizontal' | 'compact' | 'iconOnly' | 'hero' | 'full';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  iconSize?: number;
  showAbout?: boolean;
  badgeText?: string;
  subtitle?: string;
  subtext?: string;
}

export const JanAiLogo: React.FC<JanAiLogoProps> = ({
  variant = 'horizontal',
  theme = 'light',
  className = '',
  iconSize,
  showAbout = true,
  badgeText,
  subtitle,
  subtext,
}) => {
  const isDark = theme === 'dark';

  // SVG Core Vector of the Government Institution + Neural AI Network + Citizens + Tricolor Swoosh
  const EmblemSvg = ({ width = 120, height = 180 }: { width?: number; height?: number }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-md select-none"
    >
      <defs>
        {/* Navy Gradient Capsule Background */}
        <linearGradient id="emblemBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0a1931" />
          <stop offset="50%" stopColor="#0d234a" />
          <stop offset="100%" stopColor="#071326" />
        </linearGradient>

        {/* Neural Network Glow */}
        <filter id="circuitGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#93C5FD" floodOpacity="0.4" />
        </filter>

        {/* Saffron Gradient */}
        <linearGradient id="saffronGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF9933" />
          <stop offset="100%" stopColor="#FB923C" />
        </linearGradient>

        {/* Green Gradient */}
        <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
      </defs>

      {/* Outer Pill / Stadium Shape */}
      <rect
        x="6"
        y="6"
        width="188"
        height="288"
        rx="94"
        fill="url(#emblemBg)"
        stroke="#1E3A8A"
        strokeWidth="2.5"
      />

      {/* Inner Accent Ring */}
      <rect
        x="12"
        y="12"
        width="176"
        height="276"
        rx="88"
        fill="none"
        stroke="#2563EB"
        strokeWidth="0.8"
        strokeOpacity="0.3"
      />

      {/* ================= AI CIRCUIT & NEURAL NETWORK TRACES ================= */}
      <g stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" filter="url(#circuitGlow)">
        {/* Top Center Node */}
        <line x1="100" y1="95" x2="100" y2="78" />
        <circle cx="100" cy="74" r="4.5" fill="#0A1931" stroke="#FFFFFF" strokeWidth="2.5" />

        {/* Upper Left Branch 1 */}
        <path d="M 88 100 L 78 88 L 78 72" />
        <circle cx="78" cy="68" r="4" fill="#0A1931" stroke="#FFFFFF" strokeWidth="2.5" />

        {/* Upper Left Branch 2 */}
        <path d="M 78 112 L 60 98 L 60 84" />
        <circle cx="60" cy="80" r="4" fill="#0A1931" stroke="#FFFFFF" strokeWidth="2.5" />

        {/* Far Left Branch 3 */}
        <path d="M 68 126 L 46 114 L 46 102" />
        <circle cx="46" cy="98" r="4" fill="#0A1931" stroke="#FFFFFF" strokeWidth="2.5" />

        {/* Lower Left Branch 4 */}
        <path d="M 66 138 L 48 138 L 42 128" />
        <circle cx="38" cy="124" r="4" fill="#0A1931" stroke="#FFFFFF" strokeWidth="2.5" />

        {/* Upper Right Branch 1 */}
        <path d="M 112 100 L 122 88 L 122 72" />
        <circle cx="122" cy="68" r="4" fill="#0A1931" stroke="#FFFFFF" strokeWidth="2.5" />

        {/* Upper Right Branch 2 */}
        <path d="M 122 112 L 140 98 L 140 84" />
        <circle cx="140" cy="80" r="4" fill="#0A1931" stroke="#FFFFFF" strokeWidth="2.5" />

        {/* Far Right Branch 3 */}
        <path d="M 132 126 L 154 114 L 154 102" />
        <circle cx="154" cy="98" r="4" fill="#0A1931" stroke="#FFFFFF" strokeWidth="2.5" />

        {/* Lower Right Branch 4 */}
        <path d="M 134 138 L 152 138 L 158 128" />
        <circle cx="162" cy="124" r="4" fill="#0A1931" stroke="#FFFFFF" strokeWidth="2.5" />
      </g>

      {/* ================= CENTRAL GOVERNMENT INSTITUTION ================= */}
      <g fill="#FFFFFF">
        {/* Pediment / Roof */}
        <polygon points="100,96 82,112 118,112" />
        <rect x="80" y="112" width="40" height="3.5" rx="1" />

        {/* 4 Classical Pillars */}
        <rect x="83" y="117" width="5" height="20" rx="1" />
        <rect x="91" y="117" width="5" height="20" rx="1" />
        <rect x="104" y="117" width="5" height="20" rx="1" />
        <rect x="112" y="117" width="5" height="20" rx="1" />

        {/* Plinth Base */}
        <rect x="78" y="137" width="44" height="4" rx="1" />
      </g>

      {/* ================= 3 CITIZEN FIGURES (JAN) ================= */}
      <g fill="#FFFFFF">
        {/* Central Citizen (Front/Hero) */}
        <circle cx="100" cy="142" r="8" />
        <path d="M 87 165 C 87 154, 93 151, 100 151 C 107 151, 113 154, 113 165 Z" />

        {/* Left Citizen */}
        <circle cx="82" cy="146" r="6.5" />
        <path d="M 71 165 C 71 156, 76 154, 82 154 C 88 154, 92 156, 92 165 Z" />

        {/* Right Citizen */}
        <circle cx="118" cy="146" r="6.5" />
        <path d="M 108 165 C 108 156, 112 154, 118 154 C 124 154, 129 156, 129 165 Z" />
      </g>

      {/* ================= TRICOLOR SWOOSH / CRADLE ================= */}
      <g strokeWidth="4" strokeLinecap="round" fill="none">
        {/* Top Saffron Wave */}
        <path
          d="M 46 150 C 58 172, 85 178, 100 178 C 115 178, 142 172, 154 150"
          stroke="url(#saffronGrad)"
        />

        {/* Middle White Arc */}
        <path
          d="M 50 157 C 62 178, 86 185, 100 185 C 114 185, 138 178, 150 157"
          stroke="#FFFFFF"
          strokeWidth="3.5"
        />

        {/* Bottom India Green Wave */}
        <path
          d="M 56 164 C 68 184, 88 192, 100 192 C 112 192, 132 184, 144 164"
          stroke="url(#greenGrad)"
        />

        {/* Left and Right Small Ribbon Finials */}
        <circle cx="48" cy="148" r="2.5" fill="#FF9933" />
        <circle cx="152" cy="148" r="2.5" fill="#22C55E" />
      </g>

      {/* ================= EMBLEM TYPOGRAPHY ================= */}
      {/* "Jan" in White + "AI" in Golden Saffron / Amber */}
      <text x="56" y="234" fontFamily="system-ui, -apple-system, sans-serif" fontSize="38" fontWeight="900" fill="#FFFFFF" letterSpacing="-0.5">
        Jan
      </text>
      <text x="122" y="234" fontFamily="system-ui, -apple-system, sans-serif" fontSize="38" fontWeight="900" fill="#FBBF24" letterSpacing="-0.5">
        AI
      </text>

      {/* Tagline text */}
      <text x="100" y="254" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="8.5" fontWeight="700" fill="#E2E8F0">
        AI-Powered Support for
      </text>
      <text x="100" y="267" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="8.5" fontWeight="700" fill="#CBD5E1">
        Government Services
      </text>
    </svg>
  );

  // Compact Round Icon for Navbars & Cards
  const CompactIconSvg = ({ size = 42 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-sm select-none"
    >
      {/* Circular Navy Blue Base */}
      <circle cx="50" cy="50" r="46" fill="#0A1931" stroke="#1E3A8A" strokeWidth="2" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="#2563EB" strokeWidth="0.8" strokeOpacity="0.4" />

      {/* Circuit lines */}
      <g stroke="#93C5FD" strokeWidth="1.2" strokeLinecap="round" opacity="0.8">
        <line x1="50" y1="28" x2="50" y2="20" />
        <circle cx="50" cy="18" r="2" fill="#0A1931" stroke="#FFFFFF" strokeWidth="1.2" />

        <path d="M 44 30 L 38 24 L 38 18" />
        <circle cx="38" cy="16" r="1.8" fill="#0A1931" stroke="#FFFFFF" strokeWidth="1.2" />

        <path d="M 56 30 L 62 24 L 62 18" />
        <circle cx="62" cy="16" r="1.8" fill="#0A1931" stroke="#FFFFFF" strokeWidth="1.2" />

        <path d="M 38 38 L 28 32 L 28 26" />
        <circle cx="28" cy="24" r="1.8" fill="#0A1931" stroke="#FFFFFF" strokeWidth="1.2" />

        <path d="M 62 38 L 72 32 L 72 26" />
        <circle cx="72" cy="24" r="1.8" fill="#0A1931" stroke="#FFFFFF" strokeWidth="1.2" />
      </g>

      {/* Government Building */}
      <g fill="#FFFFFF">
        <polygon points="50,28 40,36 60,36" />
        <rect x="39" y="36" width="22" height="2" rx="0.5" />
        <rect x="41" y="39" width="3" height="11" rx="0.5" />
        <rect x="46" y="39" width="3" height="11" rx="0.5" />
        <rect x="51" y="39" width="3" height="11" rx="0.5" />
        <rect x="56" y="39" width="3" height="11" rx="0.5" />
        <rect x="38" y="50" width="24" height="2.5" rx="0.5" />
      </g>

      {/* Citizens */}
      <g fill="#FFFFFF">
        <circle cx="50" cy="54" r="4.5" />
        <path d="M 42 68 C 42 61, 46 59, 50 59 C 54 59, 58 61, 58 68 Z" />

        <circle cx="39" cy="57" r="3.8" />
        <path d="M 32 68 C 32 63, 35 61, 39 61 C 43 61, 45 63, 45 68 Z" />

        <circle cx="61" cy="57" r="3.8" />
        <path d="M 55 68 C 55 63, 57 61, 61 61 C 65 61, 68 63, 68 68 Z" />
      </g>

      {/* Tricolor Arc */}
      <g strokeWidth="2.2" strokeLinecap="round" fill="none">
        <path d="M 22 58 C 30 72, 44 76, 50 76 C 56 76, 70 72, 78 58" stroke="#FF9933" />
        <path d="M 25 63 C 33 76, 45 80, 50 80 C 55 80, 67 76, 75 63" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M 29 67 C 36 79, 46 84, 50 84 C 54 84, 64 79, 71 67" stroke="#22C55E" />
      </g>
    </svg>
  );

  // 1. FULL EMBLEM PILL VARIANT (Matches the exact uploaded WhatsApp badge)
  if (variant === 'emblem') {
    return (
      <div className={`inline-flex flex-col items-center justify-center ${className}`}>
        <EmblemSvg width={iconSize || 150} height={(iconSize ? (iconSize * 1.5) : 225)} />
      </div>
    );
  }

  // 2. ICON ONLY VARIANT
  if (variant === 'iconOnly') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <CompactIconSvg size={iconSize || 42} />
      </div>
    );
  }

  // 3. HERO VARIANT (Emblem + Side Banner Text)
  if (variant === 'hero') {
    return (
      <div className={`inline-flex flex-col sm:flex-row items-center gap-5 select-none ${className}`}>
        <EmblemSvg width={iconSize || 130} height={195} />
        
        <div className="flex flex-col justify-center text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Jan <span className="text-amber-400">AI</span>
            </span>
            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              {badgeText || 'GOV.IN AI'}
            </span>
          </div>

          <h2 className="text-sm sm:text-base font-bold text-amber-300">
            {subtitle || 'AI-Powered Support for Government Services'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-md">
            {subtext || 'Connecting Citizens with 30+ Central and State Government Schemes with Instant Eligibility Scoring.'}
          </p>
        </div>
      </div>
    );
  }

  // 4. HORIZONTAL / DEFAULT VARIANT (For Header, Navigation, and Compact Views)
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <CompactIconSvg size={iconSize || 44} />
      
      <div className="flex flex-col justify-center">
        {/* Main Title: Jan AI */}
        <div className="flex items-center gap-2">
          <span className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#00003c]'}`}>
            Jan <span className="text-amber-500 dark:text-amber-400">AI</span>
          </span>
          
          <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full shadow-2xs uppercase tracking-wider">
            {badgeText || 'GOV.IN'}
          </span>
        </div>

        {/* Subtitle / Tagline from the Image */}
        {showAbout && (
          <div className="mt-0.5 space-y-0">
            <p className={`text-[10.5px] sm:text-xs font-bold leading-tight ${isDark ? 'text-amber-300' : 'text-[#0a1931]'}`}>
              {subtitle || 'AI-Powered Support for Government Services'}
            </p>
            <p className={`text-[9.5px] sm:text-[10px] font-semibold leading-tight ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
              {subtext || 'Connecting Citizens with Government Schemes'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
