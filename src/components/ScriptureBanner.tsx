import React, { useState } from 'react';
import {
  AngelCherubIcon,
  RaysOfLightIcon,
  PrayerHandsIcon,
  HolyDoveIcon,
  HolyCrossIcon,
  CrownOfLifeIcon,
  CrownOfThornsIcon,
  SeraphAngelIcon,
} from './CelestialMotifs';
import { BIBLE_VERSES, SCRIPTURE_THEMES, ScriptureTheme } from '../data/scriptures';
import { ScriptureVerse } from '../types';
import { Sparkles, RefreshCw, Copy, Check, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface ScriptureBannerProps {
  currentVerse?: ScriptureVerse;
  onVerseChange?: (verse: ScriptureVerse) => void;
}

export const ScriptureBanner: React.FC<ScriptureBannerProps> = ({
  currentVerse: propVerse,
  onVerseChange,
}) => {
  const [verseIndex, setVerseIndex] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeMotifIndex, setActiveMotifIndex] = useState(0);

  const filteredVerses = React.useMemo(() => {
    if (selectedTheme === 'all') return BIBLE_VERSES;
    return BIBLE_VERSES.filter((v) => v.theme === selectedTheme);
  }, [selectedTheme]);

  const activeVerse = propVerse || filteredVerses[verseIndex % filteredVerses.length] || BIBLE_VERSES[0];

  const handleNextVerse = () => {
    const nextIdx = (verseIndex + 1) % filteredVerses.length;
    setVerseIndex(nextIdx);
    setActiveMotifIndex((prev) => (prev + 1) % 7);
    if (onVerseChange) {
      onVerseChange(filteredVerses[nextIdx]);
    }
  };

  const handleCopyVerse = () => {
    navigator.clipboard?.writeText?.(`"${activeVerse.text}" — ${activeVerse.reference}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Celestial motifs cycling for visual variety
  const motifs = [
    { name: 'Cherub Angel', icon: <AngelCherubIcon size={26} /> },
    { name: 'Rays of Light', icon: <RaysOfLightIcon size={26} /> },
    { name: 'Prayer Hands', icon: <PrayerHandsIcon size={26} /> },
    { name: 'Peace Dove', icon: <HolyDoveIcon size={26} /> },
    { name: 'Holy Cross', icon: <HolyCrossIcon size={26} /> },
    { name: 'Crown of Life', icon: <CrownOfLifeIcon size={26} /> },
    { name: 'Crown of Thorns', icon: <CrownOfThornsIcon size={26} /> },
    { name: 'Seraph Guardian', icon: <SeraphAngelIcon size={26} /> },
  ];

  const currentMotif = motifs[activeMotifIndex % motifs.length];

  return (
    <section
      id="scripture-celestial-architecture"
      className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 shadow-lg shadow-amber-500/5 mb-3 transition-all"
    >
      {/* Background Divine Rays of Light SVG Beam Array */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none" fill="none">
          <defs>
            <linearGradient id="divineBeamGrad" x1="400" y1="0" x2="400" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" stopOpacity="0.8" />
              <stop offset="0.5" stopColor="#FDE68A" stopOpacity="0.3" />
              <stop offset="1" stopColor="#B45309" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M400 0L200 200H280L400 0Z" fill="url(#divineBeamGrad)" />
          <path d="M400 0L340 200H420L400 0Z" fill="url(#divineBeamGrad)" />
          <path d="M400 0L500 200H580L400 0Z" fill="url(#divineBeamGrad)" />
          <path d="M400 0L640 200H720L400 0Z" fill="url(#divineBeamGrad)" />
          <path d="M400 0L80 200H150L400 0Z" fill="url(#divineBeamGrad)" />
        </svg>
      </div>

      {/* Graphical Celestial Motifs Decorative Ribbon */}
      <div className="px-3 pt-2.5 pb-1 flex items-center justify-between border-b border-amber-500/20 bg-black/20 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 uppercase tracking-wider whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Divine Scripture</span>
          </span>

          {/* Graphical spiritual icons row */}
          <div className="flex items-center gap-1 ml-2 border-l border-amber-500/30 pl-2">
            <span title="Cherub Angel" className="hover:scale-110 transition-transform cursor-pointer" onClick={() => setActiveMotifIndex(0)}>
              <AngelCherubIcon size={18} />
            </span>
            <span title="Rays of Light" className="hover:scale-110 transition-transform cursor-pointer" onClick={() => setActiveMotifIndex(1)}>
              <RaysOfLightIcon size={18} />
            </span>
            <span title="Prayer Hands" className="hover:scale-110 transition-transform cursor-pointer" onClick={() => setActiveMotifIndex(2)}>
              <PrayerHandsIcon size={18} />
            </span>
            <span title="Peace Dove" className="hover:scale-110 transition-transform cursor-pointer" onClick={() => setActiveMotifIndex(3)}>
              <HolyDoveIcon size={18} />
            </span>
            <span title="Holy Cross" className="hover:scale-110 transition-transform cursor-pointer" onClick={() => setActiveMotifIndex(4)}>
              <HolyCrossIcon size={18} />
            </span>
            <span title="Crown of Life" className="hover:scale-110 transition-transform cursor-pointer" onClick={() => setActiveMotifIndex(5)}>
              <CrownOfLifeIcon size={18} />
            </span>
            <span title="Crown of Thorns" className="hover:scale-110 transition-transform cursor-pointer" onClick={() => setActiveMotifIndex(6)}>
              <CrownOfThornsIcon size={18} />
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleNextVerse}
            className="p-1 rounded-md text-amber-300 hover:text-white hover:bg-amber-500/20 text-[11px] font-medium flex items-center gap-1 transition-colors"
            title="Receive New Scripture Blessing"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">New Verse</span>
          </button>
          <button
            onClick={handleCopyVerse}
            className="p-1 rounded-md text-stone-400 hover:text-amber-300 hover:bg-white/5 transition-colors"
            title="Copy verse"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-md text-stone-400 hover:text-stone-200 transition-colors"
            title={isExpanded ? 'Collapse themes' : 'Browse scripture themes'}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Verse Layout */}
      <div className="p-3.5 sm:p-4 flex items-start gap-3 sm:gap-4 relative z-10">
        {/* Active Motif Showcase Badge */}
        <div
          onClick={handleNextVerse}
          className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-amber-900/30 border border-amber-400/40 flex items-center justify-center shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all group"
          title={`Click to rotate: ${currentMotif.name}`}
        >
          {currentMotif.icon}
        </div>

        {/* Verse Text Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-serif font-bold text-amber-300 text-xs sm:text-sm tracking-wide">
              {activeVerse.reference}
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider rounded bg-amber-400/10 text-amber-200 border border-amber-400/20">
              {activeVerse.theme}
            </span>
          </div>

          <p className="font-serif italic text-stone-100 text-xs sm:text-sm leading-relaxed tracking-wide">
            &ldquo;{activeVerse.text}&rdquo;
          </p>

          <div className="mt-2 flex items-center gap-3 text-[11px] text-amber-200/70">
            <span className="flex items-center gap-1">
              <HolyDoveIcon size={14} />
              <span>Living Word for Memory Vault</span>
            </span>
            <span>•</span>
            <button
              onClick={handleNextVerse}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              Touch for next blessing →
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Scripture Theme Selector */}
      {isExpanded && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-amber-500/20 bg-stone-950/60 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-stone-300 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Filter Scripture Themes:</span>
            </span>
            <span className="text-[10px] text-stone-500">{filteredVerses.length} verses in theme</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {SCRIPTURE_THEMES.map((theme: ScriptureTheme) => {
              const isSel = selectedTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    setSelectedTheme(theme.id);
                    setVerseIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSel
                      ? 'bg-amber-500 text-stone-950 font-semibold shadow-xs'
                      : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/60'
                  }`}
                >
                  <span>{theme.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
