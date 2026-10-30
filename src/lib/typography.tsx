import React from 'react';
import { TypographyStyle } from '@/types';

interface TypographyProps {
  style: TypographyStyle;
  subtitle?: string;
  isDarkTheme?: boolean;
}

export const TypographyOverlay: React.FC<TypographyProps> = ({
  style,
  subtitle = 'A R T I S A N A L   L U X U R Y   B A K E R Y',
  isDarkTheme = true
}) => {
  if (style === 'brush') {
    // Style 1: Brush Strokes / Artistic Brush
    // Off-white & light gold dual tones, textured brush sweeps, subtle 3D depth
    return (
      <div className="flex flex-col items-center justify-center text-center select-none py-2">
        <svg
          viewBox="0 0 500 190"
          className="w-full max-w-[420px] drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Brush Gold & Off-white dual gradient */}
            <linearGradient id="brushGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8E7" />
              <stop offset="40%" stopColor="#DFBA75" />
              <stop offset="75%" stopColor="#F7E7B4" />
              <stop offset="100%" stopColor="#C29B48" />
            </linearGradient>

            <linearGradient id="brushStrokeAccent" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DFBA75" stopOpacity="0" />
              <stop offset="50%" stopColor="#DFBA75" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#DFBA75" stopOpacity="0" />
            </linearGradient>

            {/* Subtle bristle texture filter */}
            <filter id="brushTexture" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>

          {/* Artistic dry brush stroke underline behind */}
          <path
            d="M 50 145 Q 250 152 450 143 Q 320 150 120 148 Z"
            fill="url(#brushStrokeAccent)"
            filter="url(#brushTexture)"
          />

          {/* Line 1: কেক স্লাইস (Large, artistic brush style) */}
          <text
            x="250"
            y="75"
            textAnchor="middle"
            fill="url(#brushGoldGrad)"
            style={{
              fontFamily: "'Playfair Display', 'Anek Bangla', 'Noto Serif Bengali', serif",
              fontSize: '56px',
              fontWeight: 900,
              letterSpacing: '2px',
              filter: 'drop-shadow(2px 3px 6px rgba(0,0,0,0.7))'
            }}
          >
            কেক স্লাইস
          </text>

          {/* Line 2: বাই ফারজানা (Directly below) */}
          <text
            x="250"
            y="130"
            textAnchor="middle"
            fill="#FFF1D0"
            style={{
              fontFamily: "'Anek Bangla', 'Hind Siliguri', sans-serif",
              fontSize: '34px',
              fontWeight: 700,
              letterSpacing: '5px',
              filter: 'drop-shadow(1px 2px 4px rgba(0,0,0,0.8))'
            }}
          >
            বাই ফারজানা
          </text>

          {/* Small Gold Divider Dots */}
          <circle cx="160" cy="165" r="2" fill="#DFBA75" opacity="0.8" />
          <line x1="175" y1="165" x2="325" y2="165" stroke="#DFBA75" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <circle cx="340" cy="165" r="2" fill="#DFBA75" opacity="0.8" />
        </svg>

        {subtitle && (
          <p
            className={`mt-1 tracking-[0.35em] uppercase text-[10px] font-medium ${
              isDarkTheme ? 'text-[#DFC07D]/80' : 'text-[#6F5B3E]/80'
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  if (style === 'fluid') {
    // Style 2: Fluid / Liquid
    // Rich dark-brown and warm gold tones, smooth organic curved shapes with natural flowing loop
    const textColor = isDarkTheme ? 'url(#fluidGoldGrad)' : 'url(#fluidCocoaGrad)';
    const subColor = isDarkTheme ? '#D4AF37' : '#4E3629';

    return (
      <div className="flex flex-col items-center justify-center text-center select-none py-2">
        <svg
          viewBox="0 0 500 190"
          className="w-full max-w-[420px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="fluidGoldGrad" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#F9E8B2" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#AA7C11" />
            </linearGradient>

            <linearGradient id="fluidCocoaGrad" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#4A2E1B" />
              <stop offset="60%" stopColor="#2F1C10" />
              <stop offset="100%" stopColor="#1B0F08" />
            </linearGradient>
          </defs>

          {/* Smooth organic wave flourish */}
          <path
            d="M 100 138 C 160 148, 220 134, 250 142 C 280 150, 340 138, 400 142"
            stroke={subColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Line 1: কেক স্লাইস (Organic & Fluid curve) */}
          <text
            x="250"
            y="76"
            textAnchor="middle"
            fill={textColor}
            style={{
              fontFamily: "'Playfair Display', 'Anek Bangla', 'Noto Serif Bengali', serif",
              fontSize: '54px',
              fontWeight: 800,
              letterSpacing: '1px'
            }}
          >
            কেক স্লাইস
          </text>

          {/* Line 2: বাই ফারজানা */}
          <text
            x="250"
            y="126"
            textAnchor="middle"
            fill={isDarkTheme ? '#EEDBB2' : '#3E2719'}
            style={{
              fontFamily: "'Anek Bangla', 'Hind Siliguri', sans-serif",
              fontSize: '32px',
              fontWeight: 600,
              letterSpacing: '4px'
            }}
          >
            বাই ফারজানা
          </text>

          {/* Soft Liquid droplet ornament */}
          <circle cx="250" cy="155" r="3" fill={subColor} opacity="0.7" />
        </svg>

        {subtitle && (
          <p
            className={`mt-1 tracking-[0.3em] uppercase text-[10px] font-medium ${
              isDarkTheme ? 'text-[#D4AF37]/80' : 'text-[#4A2E1B]/80'
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  // Style 3: Handwritten / হাতে আঁকা
  // Artisanal calligraphy with natural curls, flourishes, whimsical dots and signature intimacy
  const signColor = isDarkTheme ? '#F5E4C3' : '#3C2A1E';
  const flourishColor = isDarkTheme ? '#D4AF37' : '#735740';

  return (
    <div className="flex flex-col items-center justify-center text-center select-none py-2">
      <svg
        viewBox="0 0 500 190"
        className="w-full max-w-[420px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Artistic Calligraphic Initial Swoosh */}
        <path
          d="M 60 70 Q 120 40 180 65"
          stroke={flourishColor}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Line 1: কেক স্লাইস (Calligraphic Signature Look) */}
        <text
          x="250"
          y="74"
          textAnchor="middle"
          fill={signColor}
          style={{
            fontFamily: "'Playfair Display', 'Anek Bangla', 'Noto Serif Bengali', cursive",
            fontSize: '52px',
            fontWeight: 700,
            fontStyle: 'italic',
            letterSpacing: '2px'
          }}
        >
          কেক স্লাইস
        </text>

        {/* Line 2: বাই ফারজানা */}
        <text
          x="250"
          y="125"
          textAnchor="middle"
          fill={flourishColor}
          style={{
            fontFamily: "'Anek Bangla', 'Hind Siliguri', cursive",
            fontSize: '32px',
            fontWeight: 600,
            letterSpacing: '3px'
          }}
        >
          বাই ফারজানা
        </text>

        {/* Calligraphic terminal tail swoosh with whimsical dot */}
        <path
          d="M 180 145 C 220 152, 280 152, 320 145"
          stroke={flourishColor}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <circle cx="325" cy="144" r="2" fill={flourishColor} opacity="0.8" />
      </svg>

      {subtitle && (
        <p
          className={`mt-1 tracking-[0.35em] uppercase text-[10px] font-medium ${
            isDarkTheme ? 'text-[#F5E4C3]/75' : 'text-[#5A3E2C]/75'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
