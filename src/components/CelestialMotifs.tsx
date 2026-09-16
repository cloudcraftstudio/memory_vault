import React from 'react';

interface MotifProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Cherub Style Angelic Being with golden halo, soft wings, and radiant aura
 */
export const AngelCherubIcon: React.FC<MotifProps> = ({ className = '', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    {/* Radiant Halo */}
    <ellipse cx="24" cy="9" rx="11" ry="3.2" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 1" fill="#FEF3C7" fillOpacity="0.3" />
    <circle cx="24" cy="9" r="1.5" fill="#FDE68A" />

    {/* Outstretched Angelic Wings */}
    <path
      d="M16 19C11 15 5 15 3 20C1.5 24 4 28 8 29C11 30 15 28 17 25"
      stroke="#FBBF24"
      strokeWidth="2"
      strokeLinecap="round"
      fill="url(#wingGradientLeft)"
    />
    <path
      d="M9 23C7 26 8 30 11 31"
      stroke="#FDE68A"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M32 19C37 15 43 15 45 20C46.5 24 44 28 40 29C37 30 33 28 31 25"
      stroke="#FBBF24"
      strokeWidth="2"
      strokeLinecap="round"
      fill="url(#wingGradientRight)"
    />
    <path
      d="M39 23C41 26 40 30 37 31"
      stroke="#FDE68A"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Cherub Angel Head */}
    <circle cx="24" cy="18" r="7" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.8" />
    {/* Soft curly hair */}
    <path
      d="M18 16C18 13.5 20 12 24 12C28 12 30 13.5 30 16C30 16 28 14.5 24 14.5C20 14.5 18 16 18 16Z"
      fill="#D97706"
    />
    {/* Peaceful Eyes & Gentle Smile */}
    <path d="M21 17.5C21.5 18.5 22.5 18.5 23 17.5" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M25 17.5C25.5 18.5 26.5 18.5 27 17.5" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M22.5 21C23.5 22 24.5 22 25.5 21" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" />

    {/* Cherubic Tunic / Body */}
    <path
      d="M19 25C17 32 16 41 16 41C20 42.5 28 42.5 32 41C32 41 31 32 29 25C26.5 26 21.5 26 19 25Z"
      fill="url(#robeGradient)"
      stroke="#F59E0B"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* Golden Sash */}
    <path d="M18.5 31C22 32.5 26 32.5 29.5 31" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />

    {/* Light Sparkles */}
    <path d="M24 36L24.5 38L26.5 38.5L24.5 39L24 41L23.5 39L21.5 38.5L23.5 38L24 36Z" fill="#FBBF24" />

    <defs>
      <linearGradient id="wingGradientLeft" x1="3" y1="15" x2="17" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFBEB" stopOpacity="0.9" />
        <stop offset="1" stopColor="#FDE68A" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id="wingGradientRight" x1="45" y1="15" x2="31" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFBEB" stopOpacity="0.9" />
        <stop offset="1" stopColor="#FDE68A" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id="robeGradient" x1="24" y1="25" x2="24" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFBEB" />
        <stop offset="1" stopColor="#FEF3C7" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * Rays of Light Motif (Heavenly Sunburst / Divine Illumination)
 */
export const RaysOfLightIcon: React.FC<MotifProps> = ({ className = '', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    {/* Central Radiance Glow */}
    <circle cx="24" cy="24" r="8" fill="url(#sunGlow)" />
    <circle cx="24" cy="24" r="4.5" fill="#FDE68A" />

    {/* Divine Rays radiating outward */}
    {/* Primary Cardinal Beams */}
    <path d="M24 4V12" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M24 36V44" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M4 24H12" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M36 24H44" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

    {/* Diagonal Beams */}
    <path d="M10 10L16 16" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
    <path d="M32 32L38 38" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
    <path d="M38 10L32 16" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 32L10 38" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />

    {/* Subtle Secondary Light Streaks */}
    <path d="M24 0L24 2" stroke="#FEF3C7" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 17L12 19" stroke="#FDE68A" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M36 19L41 17" stroke="#FDE68A" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M7 31L12 29" stroke="#FDE68A" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M36 29L41 31" stroke="#FDE68A" strokeWidth="1.2" strokeLinecap="round" />

    <defs>
      <radialGradient id="sunGlow" cx="24" cy="24" r="8" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEF3C7" />
        <stop offset="0.6" stopColor="#FBBF24" stopOpacity="0.8" />
        <stop offset="1" stopColor="#F59E0B" stopOpacity="0.1" />
      </radialGradient>
    </defs>
  </svg>
);

/**
 * Reverent Prayer Hands with warm spiritual aura
 */
export const PrayerHandsIcon: React.FC<MotifProps> = ({ className = '', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    {/* Gentle golden background halo */}
    <circle cx="24" cy="22" r="16" fill="#FEF3C7" fillOpacity="0.25" stroke="#FDE68A" strokeWidth="1" strokeDasharray="3 2" />

    {/* Left Hand Silhouette */}
    <path
      d="M24 7C22.5 7 21 11 21 15L21 27C21 28 19 28.5 17 29C15 29.5 13 32 13 35C13 39 16 43 20 43C21.5 43 23 42 24 41V7Z"
      fill="url(#prayerLeft)"
      stroke="#D97706"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* Right Hand Silhouette */}
    <path
      d="M24 7C25.5 7 27 11 27 15L27 27C27 28 29 28.5 31 29C33 29.5 35 32 35 35C35 39 32 43 28 43C26.5 43 25 42 24 41V7Z"
      fill="url(#prayerRight)"
      stroke="#D97706"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* Inner Finger Definition Lines */}
    <path d="M24 11V38" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M21 19C19.5 21 18 24 17.5 28" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M27 19C28.5 21 30 24 30.5 28" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />

    {/* Golden Light Sparkle at fingertips */}
    <circle cx="24" cy="6" r="2.5" fill="#F59E0B" />
    <path d="M24 2V5M24 7V10M20 6H23M25 6H28" stroke="#FDE68A" strokeWidth="1.2" strokeLinecap="round" />

    <defs>
      <linearGradient id="prayerLeft" x1="13" y1="20" x2="24" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFBEB" />
        <stop offset="1" stopColor="#FDE68A" />
      </linearGradient>
      <linearGradient id="prayerRight" x1="35" y1="20" x2="24" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFBEB" />
        <stop offset="1" stopColor="#FDE68A" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * Holy Dove soaring in peace with olive branch
 */
export const HolyDoveIcon: React.FC<MotifProps> = ({ className = '', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    {/* Dove Body & Wings */}
    {/* Upper Right Wing */}
    <path
      d="M20 22C24 15 32 8 41 8C40 14 36 21 28 24"
      fill="url(#doveWingUpper)"
      stroke="#F59E0B"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M33 13C36 17 35 22 29 24" stroke="#FDE68A" strokeWidth="1.2" strokeLinecap="round" />

    {/* Lower Left Wing */}
    <path
      d="M17 25C13 23 8 23 4 27C8 29 13 30 18 28"
      fill="url(#doveWingLower)"
      stroke="#F59E0B"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Dove Body & Head */}
    <path
      d="M16 23C17 19 21 16 24 16C26 16 27.5 17 28 19C30 22 28 27 24 30C20 33 15 38 12 42C12 37 13 33 14 30C12 28 14 24 16 23Z"
      fill="#FFFBEB"
      stroke="#D97706"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />

    {/* Gentle Eye */}
    <circle cx="25" cy="18" r="1.2" fill="#78350F" />

    {/* Beak & Olive Branch */}
    <path d="M28 18L32 17.5L28.5 19.5" fill="#F59E0B" />
    {/* Olive sprig stem */}
    <path d="M31 18C34 17 38 18 41 16" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
    {/* Olive leaves */}
    <ellipse cx="35" cy="16.5" rx="2" ry="1" transform="rotate(-20 35 16.5)" fill="#34D399" />
    <ellipse cx="38" cy="18" rx="2" ry="1" transform="rotate(30 38 18)" fill="#34D399" />
    <ellipse cx="41" cy="15.5" rx="2" ry="1" transform="rotate(-10 41 15.5)" fill="#34D399" />

    {/* Light Radiance */}
    <circle cx="24" cy="24" r="18" stroke="#FBBF24" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />

    <defs>
      <linearGradient id="doveWingUpper" x1="20" y1="8" x2="40" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#FEF3C7" />
      </linearGradient>
      <linearGradient id="doveWingLower" x1="4" y1="23" x2="18" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#FEF3C7" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * Holy Cross with radiant golden beams & bevel
 */
export const HolyCrossIcon: React.FC<MotifProps> = ({ className = '', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    {/* Radiant Glory Burst behind the cross */}
    <circle cx="24" cy="18" r="14" fill="#FEF3C7" fillOpacity="0.2" />
    <path d="M24 6L24 10M24 26L24 30M12 18L16 18M32 18L36 18" stroke="#FBBF24" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M15 9L18 12M30 24L33 27M33 9L30 12M18 24L15 27" stroke="#FDE68A" strokeWidth="1.4" strokeLinecap="round" />

    {/* The Cross Shape */}
    {/* Vertical Beam */}
    <rect x="21" y="6" width="6" height="36" rx="2" fill="url(#crossGradient)" stroke="#D97706" strokeWidth="1.8" />
    {/* Horizontal Beam */}
    <rect x="11" y="15" width="26" height="6" rx="2" fill="url(#crossGradient)" stroke="#D97706" strokeWidth="1.8" />

    {/* Central Sacred Diamond / Jewel */}
    <path d="M24 15L27 18L24 21L21 18Z" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="1" />

    {/* Inner Highlighting */}
    <path d="M22.5 8V40" stroke="#FFFBEB" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <path d="M13 16.5H35" stroke="#FFFBEB" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

    <defs>
      <linearGradient id="crossGradient" x1="12" y1="6" x2="36" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE68A" />
        <stop offset="0.5" stopColor="#F59E0B" />
        <stop offset="1" stopColor="#B45309" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * Crown of Glory / Crown of Life with heavenly jewels
 */
export const CrownOfLifeIcon: React.FC<MotifProps> = ({ className = '', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    {/* Crown Base */}
    <path
      d="M8 35C16 37 32 37 40 35L42 38C34 40 14 40 6 38L8 35Z"
      fill="#D97706"
      stroke="#B45309"
      strokeWidth="1.5"
    />

    {/* Crown Body with 5 Spikes */}
    <path
      d="M7 35L10 19L18 27L24 13L30 27L38 19L41 35C32 37 16 37 7 35Z"
      fill="url(#crownGold)"
      stroke="#D97706"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Jewels on Peaks */}
    <circle cx="24" cy="13" r="3" fill="#60A5FA" stroke="#FEF3C7" strokeWidth="1.5" />
    <circle cx="10" cy="19" r="2.2" fill="#F43F5E" stroke="#FEF3C7" strokeWidth="1.2" />
    <circle cx="38" cy="19" r="2.2" fill="#F43F5E" stroke="#FEF3C7" strokeWidth="1.2" />
    <circle cx="18" cy="27" r="1.8" fill="#34D399" stroke="#FEF3C7" strokeWidth="1" />
    <circle cx="30" cy="27" r="1.8" fill="#34D399" stroke="#FEF3C7" strokeWidth="1" />

    {/* Center Cross on Central Peak */}
    <path d="M24 7V10M22.5 8.5H25.5" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />

    {/* Base Band Jewels */}
    <circle cx="16" cy="36" r="1.5" fill="#FEF3C7" />
    <circle cx="24" cy="36" r="1.8" fill="#FEF3C7" />
    <circle cx="32" cy="36" r="1.5" fill="#FEF3C7" />

    <defs>
      <linearGradient id="crownGold" x1="6" y1="13" x2="42" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEF3C7" />
        <stop offset="0.4" stopColor="#FBBF24" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * Crown of Thorns with sacred intertwined branches & divine glow
 */
export const CrownOfThornsIcon: React.FC<MotifProps> = ({ className = '', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    {/* Soft sacred aura */}
    <ellipse cx="24" cy="24" rx="17" ry="12" fill="#FEF3C7" fillOpacity="0.15" />

    {/* Intertwined Thorn Ring 1 */}
    <ellipse
      cx="24"
      cy="24"
      rx="16"
      ry="10"
      stroke="#78350F"
      strokeWidth="2.2"
      strokeDasharray="9 3"
      fill="none"
    />
    {/* Intertwined Thorn Ring 2 */}
    <ellipse
      cx="24"
      cy="24"
      rx="15"
      ry="9"
      stroke="#92400E"
      strokeWidth="1.8"
      strokeDasharray="6 4"
      fill="none"
      transform="rotate(-5 24 24)"
    />

    {/* Thorns Spikes protruding */}
    {/* Top Thorns */}
    <path d="M16 14L14 10" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 14L24 9" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
    <path d="M32 14L34 10" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />

    {/* Bottom Thorns */}
    <path d="M16 34L14 38" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 34L25 39" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
    <path d="M32 34L34 38" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />

    {/* Lateral Thorns */}
    <path d="M8 24L4 23" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
    <path d="M40 24L44 25" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />

    {/* Inner Pricks */}
    <path d="M20 20L22 22" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M28 20L26 22" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />

    {/* Divine Rays from the center */}
    <circle cx="24" cy="24" r="1.5" fill="#F59E0B" />
    <path d="M24 18V20M24 28V30M18 24H20M28 24H30" stroke="#FDE68A" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

/**
 * Seraph Angelic Guardian with majestic outstretched wings
 */
export const SeraphAngelIcon: React.FC<MotifProps> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    {/* Upper Wings */}
    <path
      d="M24 18C19 9 10 5 3 7C2 14 7 23 18 25"
      fill="url(#seraphWings)"
      stroke="#F59E0B"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M24 18C29 9 38 5 45 7C46 14 41 23 30 25"
      fill="url(#seraphWings)"
      stroke="#F59E0B"
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    {/* Lower Wings */}
    <path
      d="M22 27C17 32 9 37 4 43C11 43 18 39 22 33"
      fill="url(#seraphWings)"
      stroke="#F59E0B"
      strokeWidth="1.5"
    />
    <path
      d="M26 27C31 32 39 37 44 43C37 43 30 39 26 33"
      fill="url(#seraphWings)"
      stroke="#F59E0B"
      strokeWidth="1.5"
    />

    {/* Radiant Halo */}
    <circle cx="24" cy="11" r="5" stroke="#F59E0B" strokeWidth="1.8" fill="#FEF3C7" fillOpacity="0.4" />

    {/* Seraph Figure */}
    <ellipse cx="24" cy="14" rx="3.5" ry="4" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.5" />
    <path
      d="M21 20C19 28 18 38 18 43C22 44 26 44 30 43C30 38 29 28 27 20Z"
      fill="#FEF3C7"
      stroke="#D97706"
      strokeWidth="1.8"
    />

    <defs>
      <linearGradient id="seraphWings" x1="4" y1="7" x2="44" y2="43" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFBEB" />
        <stop offset="0.6" stopColor="#FDE68A" />
        <stop offset="1" stopColor="#F59E0B" stopOpacity="0.8" />
      </linearGradient>
    </defs>
  </svg>
);
