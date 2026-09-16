import React, { useState, useRef, useEffect } from 'react';
import { Photo } from '../types';
import {
  X,
  Sliders,
  Scissors,
  Maximize2,
  Sparkles,
  Wand2,
  Download,
  RotateCw,
  FlipHorizontal,
  Check,
  Undo2,
  RefreshCw,
  Layers,
  Sun,
  Eye,
  Camera,
} from 'lucide-react';
import {
  AngelCherubIcon,
  RaysOfLightIcon,
  HolyDoveIcon,
  CrownOfLifeIcon,
  HolyCrossIcon,
  CrownOfThornsIcon,
} from './CelestialMotifs';

type StudioTab = 'edit' | 'bg_remove' | 'resize' | 'enhance' | 'ai_generate';

interface ImageStudioModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveEditedPhoto: (updatedPhoto: Photo) => void;
  onAddGeneratedPhoto: (newPhoto: Photo) => void;
}

export const ImageStudioModal: React.FC<ImageStudioModalProps> = ({
  photo,
  isOpen,
  onClose,
  onSaveEditedPhoto,
  onAddGeneratedPhoto,
}) => {
  const [activeTab, setActiveTab] = useState<StudioTab>('edit');
  
  // Image Editing Sliders State
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [warmth, setWarmth] = useState(0); // sepia / golden warmth
  const [blur, setBlur] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isFlippedH, setIsFlippedH] = useState(false);
  const [activeFilterPreset, setActiveFilterPreset] = useState<string>('normal');

  // Background Removal State
  const [bgMode, setBgMode] = useState<'original' | 'transparent' | 'celestial_rays' | 'clouds_halo' | 'stained_glass'>('original');
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  // Resize State
  const [targetWidth, setTargetWidth] = useState(1920);
  const [targetHeight, setTargetHeight] = useState(1080);
  const [lockAspect, setLockAspect] = useState(true);
  const [selectedResizePreset, setSelectedResizePreset] = useState<string>('1080p');

  // AI Enhancements State
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedEffect, setEnhancedEffect] = useState<string | null>(null);
  const [divineRaysStrength, setDivineRaysStrength] = useState(60);

  // AI Generation State
  const [genPrompt, setGenPrompt] = useState(
    'Cherub style angel with golden halo and gentle wings resting on a cloud with rays of light'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generatedTitle, setGeneratedTitle] = useState('Celestial Vision: Angel of Light');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Reset or initialize state when photo opens
  useEffect(() => {
    if (photo) {
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      setWarmth(0);
      setBlur(0);
      setRotation(0);
      setIsFlippedH(false);
      setActiveFilterPreset('normal');
      setBgMode('original');
      setEnhancedEffect(null);
      setTargetWidth(1920);
      setTargetHeight(1080);
    }
  }, [photo]);

  if (!isOpen || !photo) return null;

  // Compute CSS filter style for live preview
  const getFilterString = () => {
    let base = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${warmth}%) blur(${blur}px)`;
    if (activeFilterPreset === 'divine_glow') {
      base += ' drop-shadow(0 0 15px rgba(251, 191, 36, 0.6))';
    } else if (activeFilterPreset === 'sacred_bw') {
      base += ' grayscale(100%) contrast(125%)';
    } else if (activeFilterPreset === 'vintage_film') {
      base += ' sepia(40%) contrast(90%) brightness(105%)';
    } else if (activeFilterPreset === 'golden_hour') {
      base += ' sepia(25%) saturate(140%) brightness(102%)';
    }
    return base;
  };

  // Reset adjustments
  const handleResetAdjustments = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setWarmth(0);
    setBlur(0);
    setRotation(0);
    setIsFlippedH(false);
    setActiveFilterPreset('normal');
    setEnhancedEffect(null);
    setBgMode('original');
  };

  // Handle Preset Filters
  const applyPreset = (presetName: string) => {
    setActiveFilterPreset(presetName);
    if (presetName === 'normal') {
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      setWarmth(0);
    } else if (presetName === 'divine_glow') {
      setBrightness(110);
      setContrast(115);
      setSaturation(120);
      setWarmth(20);
    } else if (presetName === 'sacred_bw') {
      setBrightness(105);
      setContrast(130);
      setSaturation(0);
      setWarmth(0);
    } else if (presetName === 'vintage_film') {
      setBrightness(102);
      setContrast(95);
      setSaturation(85);
      setWarmth(35);
    } else if (presetName === 'golden_hour') {
      setBrightness(108);
      setContrast(110);
      setSaturation(135);
      setWarmth(45);
    }
  };

  // Handle Background Removal Simulation
  const handleApplyBgRemoval = (mode: 'transparent' | 'celestial_rays' | 'clouds_halo' | 'stained_glass') => {
    setIsRemovingBg(true);
    setTimeout(() => {
      setBgMode(mode);
      setIsRemovingBg(false);
    }, 700);
  };

  // Handle Resize Preset Selection
  const applyResizePreset = (preset: string) => {
    setSelectedResizePreset(preset);
    if (preset === 'web') {
      setTargetWidth(1200);
      setTargetHeight(800);
    } else if (preset === '1080p') {
      setTargetWidth(1920);
      setTargetHeight(1080);
    } else if (preset === '4k') {
      setTargetWidth(3840);
      setTargetHeight(2160);
    } else if (preset === 'print300') {
      setTargetWidth(2400);
      setTargetHeight(3000);
    } else if (preset === 'square') {
      setTargetWidth(1080);
      setTargetHeight(1080);
    } else if (preset === 'story') {
      setTargetWidth(1080);
      setTargetHeight(1920);
    }
  };

  // Handle AI Enhancements
  const handleRunEnhancement = (type: 'auto' | 'divine_rays' | 'face_glow' | 'denoise') => {
    setIsEnhancing(true);
    setTimeout(() => {
      setIsEnhancing(false);
      setEnhancedEffect(type);
      if (type === 'auto') {
        setBrightness(106);
        setContrast(112);
        setSaturation(118);
        setWarmth(10);
      } else if (type === 'face_glow') {
        setBrightness(110);
        setContrast(105);
        setWarmth(15);
      }
    }, 900);
  };

  // Handle AI Image Generation
  const handleGenerateAIArt = () => {
    setIsGenerating(true);
    // Curated high-resolution spiritual & celestial generation gallery presets
    const celestialStock = [
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1600&auto=format&fit=crop&q=85', // Heavenly sunbeams through trees
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=85', // Ethereal clouds & radiant gold sky
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=85', // Majestic mountain reflection
      'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=1600&auto=format&fit=crop&q=85', // Warm lantern glow
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=85', // Golden cosmos
    ];

    setTimeout(() => {
      setIsGenerating(false);
      const randomStock = celestialStock[Math.floor(Math.random() * celestialStock.length)];
      setGeneratedImageUrl(randomStock);
      setGeneratedTitle(genPrompt.slice(0, 36) + '...');
    }, 1200);
  };

  // Save changes to current photo
  const handleSaveToPhoto = () => {
    const updated: Photo = {
      ...photo,
      title: `${photo.title} (Enhanced)`,
      metadata: {
        ...photo.metadata,
        resolution: `${targetWidth} × ${targetHeight}`,
      },
    };
    onSaveEditedPhoto(updated);
    onClose();
  };

  // Save newly generated AI artwork to library
  const handleSaveGeneratedToLibrary = () => {
    if (!generatedImageUrl) return;
    const newArtPhoto: Photo = {
      id: `ai-gen-${Date.now()}`,
      url: generatedImageUrl,
      thumbnailUrl: generatedImageUrl,
      title: generatedTitle,
      description: `AI-Generated sacred art: "${genPrompt}"`,
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      timestamp: Date.now(),
      location: { name: 'Celestial AI Canvas', city: 'Digital Sanctuary', country: 'Creation' },
      albumIds: photo.albumIds || [],
      tags: ['aigenerated', 'celestial', 'angel', 'light', 'sacred'],
      faces: [],
      metadata: {
        camera: 'Gemini AI Vision Studio',
        resolution: `${targetWidth} × ${targetHeight}`,
        fileSize: '6.2 MB',
      },
      isFavorite: true,
      isBackedUp: true,
      source: 'local_upload',
      category: 'styles',
      styleCategory: 'Celestial Radiance',
    };
    onAddGeneratedPhoto(newArtPhoto);
    onClose();
  };

  // Direct download
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `${photo.title.replace(/\s+/g, '_')}_edited.jpg`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl h-[94vh] max-h-[850px] bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-100">
        
        {/* Top Studio Bar */}
        <div className="px-4 py-3 border-b border-stone-800 bg-stone-950/80 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 shadow-sm">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                <span>MemoryVault Image Studio</span>
                <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-amber-400/20 text-amber-300 rounded border border-amber-400/30">
                  PRO AI
                </span>
              </h3>
              <p className="text-[11px] text-stone-400 truncate max-w-xs sm:max-w-md">
                Editing: {photo.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetAdjustments}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 text-xs flex items-center gap-1 transition-colors"
              title="Reset all adjustments"
            >
              <Undo2 className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 text-xs flex items-center gap-1 transition-colors"
              title="Download image"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={handleSaveToPhoto}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors ml-1"
              aria-label="Close studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feature Mode Tabs */}
        <div className="px-3 py-2 border-b border-stone-800 bg-stone-900/60 flex items-center gap-1 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'edit'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Image Editing & Filters</span>
          </button>

          <button
            onClick={() => setActiveTab('bg_remove')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'bg_remove'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Background Removal</span>
          </button>

          <button
            onClick={() => setActiveTab('resize')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'resize'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Resize & Dimensions</span>
          </button>

          <button
            onClick={() => setActiveTab('enhance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'enhance'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Enhancements</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_generate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'ai_generate'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>AI Generation Studio</span>
          </button>
        </div>

        {/* Studio Body: Canvas Left / Controls Right */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Main Photo Canvas Viewport */}
          <div className="flex-1 bg-stone-950 relative flex items-center justify-center p-4 overflow-hidden select-none">
            {/* Background Texture based on BG Removal mode */}
            {bgMode === 'transparent' && (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(#444 1px, transparent 1px), radial-gradient(#444 1px, #111 1px)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 10px 10px',
                }}
              />
            )}

            {bgMode === 'celestial_rays' && (
              <div className="absolute inset-0 bg-gradient-to-b from-amber-900/40 via-stone-950 to-stone-950 flex items-center justify-center overflow-hidden">
                <div className="w-[800px] h-[800px] bg-amber-500/15 rounded-full blur-3xl animate-pulse" />
                <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M50 0 L20 100 L30 100 L50 0 Z" fill="#F59E0B" opacity="0.3" />
                  <path d="M50 0 L45 100 L55 100 L50 0 Z" fill="#FDE68A" opacity="0.4" />
                  <path d="M50 0 L70 100 L80 100 L50 0 Z" fill="#F59E0B" opacity="0.3" />
                </svg>
              </div>
            )}

            {bgMode === 'clouds_halo' && (
              <div className="absolute inset-0 bg-gradient-to-t from-sky-950/40 via-amber-950/30 to-stone-950 flex items-center justify-center">
                <div className="w-80 h-80 rounded-full border-4 border-amber-400/40 blur-sm animate-spin duration-10000" />
              </div>
            )}

            {/* AI Divine Rays Overlay */}
            {enhancedEffect === 'divine_rays' && (
              <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                <svg className="w-full h-full opacity-60" viewBox="0 0 800 600" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="studioGodRays" x1="400" y1="0" x2="400" y2="600" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FEF3C7" stopOpacity="0.9" />
                      <stop offset="0.4" stopColor="#F59E0B" stopOpacity="0.5" />
                      <stop offset="1" stopColor="#B45309" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M400 0 L150 600 L250 600 L400 0 Z" fill="url(#studioGodRays)" />
                  <path d="M400 0 L350 600 L450 600 L400 0 Z" fill="url(#studioGodRays)" />
                  <path d="M400 0 L550 600 L650 600 L400 0 Z" fill="url(#studioGodRays)" />
                </svg>
              </div>
            )}

            {/* Render Target Image */}
            <div
              className="relative max-h-full max-w-full flex items-center justify-center transition-all duration-200"
              style={{
                transform: `rotate(${rotation}deg) scaleX(${isFlippedH ? -1 : 1})`,
              }}
            >
              <img
                src={activeTab === 'ai_generate' && generatedImageUrl ? generatedImageUrl : photo.url}
                alt={photo.title}
                style={{ filter: getFilterString() }}
                className={`max-h-[60vh] md:max-h-[72vh] w-auto max-w-full object-contain rounded-xl shadow-2xl transition-all ${
                  bgMode === 'transparent' ? 'mask-subject shadow-none' : ''
                }`}
              />

              {/* Processing Overlay Indicator */}
              {(isRemovingBg || isEnhancing || isGenerating) && (
                <div className="absolute inset-0 rounded-xl bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-amber-300 gap-2 z-20 animate-fade-in">
                  <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
                  <span className="text-xs font-semibold">
                    {isRemovingBg
                      ? 'Isolating Subject & Removing Background...'
                      : isEnhancing
                      ? 'Applying Celestial AI Enhancements...'
                      : 'Synthesizing AI Artwork...'}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Rotate & Flip shortcuts floating on canvas */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 bg-stone-900/80 backdrop-blur-md p-1 rounded-xl border border-stone-800">
              <button
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
                title="Rotate 90° Clockwise"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFlippedH(!isFlippedH)}
                className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
                title="Flip Horizontal"
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Control Panel */}
          <div className="w-full md:w-84 bg-stone-900 border-t md:border-t-0 md:border-l border-stone-800 p-4 overflow-y-auto max-h-[40vh] md:max-h-full">
            
            {/* TAB 1: Image Editing & Filters */}
            {activeTab === 'edit' && (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-semibold text-stone-200 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>Spiritual & Artistic Presets</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'normal', name: 'Original', icon: '✨' },
                      { id: 'divine_glow', name: 'Divine Glow', icon: '🌟' },
                      { id: 'golden_hour', name: 'Golden Hour', icon: '🌅' },
                      { id: 'sacred_bw', name: 'Sacred B&W', icon: '⚪' },
                      { id: 'vintage_film', name: 'Vintage Parchment', icon: '📜' },
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => applyPreset(preset.id)}
                        className={`p-2 rounded-xl text-left border transition-all ${
                          activeFilterPreset === preset.id
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-semibold'
                            : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:bg-stone-700'
                        }`}
                      >
                        <span className="mr-1">{preset.icon}</span>
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sliders */}
                <div className="space-y-3 pt-2 border-t border-stone-800">
                  <div>
                    <div className="flex justify-between text-stone-300 mb-1">
                      <span>Brightness</span>
                      <span className="font-mono text-amber-400">{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-300 mb-1">
                      <span>Contrast</span>
                      <span className="font-mono text-amber-400">{contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="160"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-300 mb-1">
                      <span>Saturation</span>
                      <span className="font-mono text-amber-400">{saturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={saturation}
                      onChange={(e) => setSaturation(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-300 mb-1">
                      <span>Warmth & Golden Hue</span>
                      <span className="font-mono text-amber-400">{warmth}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      value={warmth}
                      onChange={(e) => setWarmth(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-300 mb-1">
                      <span>Soft Dream Blur</span>
                      <span className="font-mono text-amber-400">{blur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="8"
                      value={blur}
                      onChange={(e) => setBlur(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Background Removal */}
            {activeTab === 'bg_remove' && (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700 text-stone-300 leading-relaxed">
                  <p className="font-medium text-white mb-1 flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-amber-400" />
                    <span>AI Subject Isolation</span>
                  </p>
                  Automatically isolates foreground subjects, portraits, and people with precision alpha edge matting.
                </div>

                <div className="space-y-2">
                  <span className="font-semibold text-stone-400 uppercase tracking-wider text-[10px] block">
                    Select Background Treatment
                  </span>

                  {[
                    { id: 'original', name: 'Original Background', desc: 'Preserve natural surroundings' },
                    { id: 'transparent', name: 'Transparent PNG', desc: 'Subject cutout with clear backdrop' },
                    { id: 'celestial_rays', name: 'Celestial Light Rays', desc: 'Heavenly golden beam illumination' },
                    { id: 'clouds_halo', name: 'Angelic Halo & Clouds', desc: 'Soft celestial cloud atmosphere' },
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => handleApplyBgRemoval(bg.id as any)}
                      className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                        bgMode === bg.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                          : 'bg-stone-800/60 border-stone-700 text-stone-300 hover:bg-stone-700'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-white">{bg.name}</p>
                        <p className="text-[11px] text-stone-400">{bg.desc}</p>
                      </div>
                      {bgMode === bg.id && <Check className="w-4 h-4 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Resize & Resolution */}
            {activeTab === 'resize' && (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-semibold text-stone-200 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Preset Resolution Formats</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    {[
                      { id: 'web', label: 'Web HD', res: '1200 × 800' },
                      { id: '1080p', label: 'Full HD', res: '1920 × 1080' },
                      { id: '4k', label: '4K Ultra', res: '3840 × 2160' },
                      { id: 'print300', label: 'Fine Print', res: '2400 × 3000 (300 DPI)' },
                      { id: 'square', label: '1:1 Square', res: '1080 × 1080' },
                      { id: 'story', label: 'Story 9:16', res: '1080 × 1920' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => applyResizePreset(p.id)}
                        className={`p-2 rounded-xl text-left border transition-all ${
                          selectedResizePreset === p.id
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-semibold'
                            : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:bg-stone-700'
                        }`}
                      >
                        <p className="font-semibold text-white">{p.label}</p>
                        <p className="text-[10px] text-stone-400">{p.res}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-800">
                  <span className="font-semibold text-stone-400 uppercase tracking-wider text-[10px] block">
                    Custom Dimension (Pixels)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-stone-400 block mb-1">Width (px)</label>
                      <input
                        type="number"
                        value={targetWidth}
                        onChange={(e) => {
                          const w = Number(e.target.value);
                          setTargetWidth(w);
                          if (lockAspect) setTargetHeight(Math.round((w * 9) / 16));
                        }}
                        className="w-full px-2.5 py-1.5 bg-stone-800 text-stone-100 rounded-lg border border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-400 block mb-1">Height (px)</label>
                      <input
                        type="number"
                        value={targetHeight}
                        onChange={(e) => setTargetHeight(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-stone-800 text-stone-100 rounded-lg border border-stone-700"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-stone-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lockAspect}
                        onChange={(e) => setLockAspect(e.target.checked)}
                        className="accent-amber-500 rounded"
                      />
                      <span>Lock Aspect Ratio</span>
                    </label>
                    <span className="text-[10px] text-stone-400">
                      Est. ~{Math.round((targetWidth * targetHeight * 3) / (1024 * 1024 * 3))} MB
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: AI Enhancements */}
            {activeTab === 'enhance' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                  <p className="font-bold flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Celestial AI Neural Engine</span>
                  </p>
                  Intelligent enhancement tailored for photographic beauty, divine illumination, and face clarity.
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleRunEnhancement('auto')}
                    disabled={isEnhancing}
                    className="w-full p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-left border border-stone-700 flex items-center justify-between transition-all"
                  >
                    <div>
                      <p className="font-semibold text-white flex items-center gap-1.5">
                        <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>One-Tap Smart Enhance</span>
                      </p>
                      <p className="text-[11px] text-stone-400">Balancing highlights, shadows, micro-contrast & color</p>
                    </div>
                    {enhancedEffect === 'auto' && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>

                  <button
                    onClick={() => handleRunEnhancement('divine_rays')}
                    disabled={isEnhancing}
                    className="w-full p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-left border border-stone-700 flex items-center justify-between transition-all"
                  >
                    <div>
                      <p className="font-semibold text-white flex items-center gap-1.5">
                        <RaysOfLightIcon size={18} />
                        <span>Rays of Divine Light</span>
                      </p>
                      <p className="text-[11px] text-stone-400">Infuse ethereal golden rays piercing downward</p>
                    </div>
                    {enhancedEffect === 'divine_rays' && <Check className="w-4 h-4 text-amber-400" />}
                  </button>

                  <button
                    onClick={() => handleRunEnhancement('face_glow')}
                    disabled={isEnhancing}
                    className="w-full p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-left border border-stone-700 flex items-center justify-between transition-all"
                  >
                    <div>
                      <p className="font-semibold text-white flex items-center gap-1.5">
                        <AngelCherubIcon size={18} />
                        <span>Portrait Angelic Glow</span>
                      </p>
                      <p className="text-[11px] text-stone-400">Soft skin illumination and eyes enhancement</p>
                    </div>
                    {enhancedEffect === 'face_glow' && <Check className="w-4 h-4 text-amber-400" />}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: AI Generation Studio */}
            {activeTab === 'ai_generate' && (
              <div className="space-y-3 text-xs">
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-amber-200">
                  <p className="font-bold flex items-center gap-1.5 mb-0.5">
                    <AngelCherubIcon size={18} />
                    <span>Generate Sacred & Celestial Art</span>
                  </p>
                  Generate angels, holy doves, radiant rays of light, or custom spiritual artwork.
                </div>

                {/* Prompt Presets */}
                <div>
                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-1.5">
                    Quick Inspiration Prompts
                  </span>
                  <div className="space-y-1">
                    {[
                      'Cherub style angel with golden halo and gentle wings resting on a cloud with rays of light',
                      'White peace dove soaring through radiant sunbeams with olive branch over calm waters',
                      'Majestic golden crown of life with jewels shining under celestial starlight',
                      'Sacred holy cross on a misty mountain summit at dawn with golden rays of light',
                      'Crown of thorns surrounded by sacred warm glow and divine petals',
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => setGenPrompt(p)}
                        className="w-full text-left p-2 rounded-lg bg-stone-800/70 hover:bg-stone-700 text-[11px] text-stone-300 hover:text-white truncate transition-colors"
                      >
                        &ldquo;{p}&rdquo;
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt Textarea */}
                <div>
                  <label className="text-[10px] text-stone-400 font-semibold block mb-1">
                    Custom Prompt
                  </label>
                  <textarea
                    rows={3}
                    value={genPrompt}
                    onChange={(e) => setGenPrompt(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-800 text-stone-100 rounded-xl border border-stone-700 text-xs focus:outline-none focus:border-amber-400"
                    placeholder="Describe what you want to generate..."
                  />
                </div>

                <button
                  onClick={handleGenerateAIArt}
                  disabled={isGenerating || !genPrompt.trim()}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? 'Synthesizing Art...' : 'Generate Celestial Artwork'}</span>
                </button>

                {generatedImageUrl && (
                  <div className="pt-2 border-t border-stone-800">
                    <button
                      onClick={handleSaveGeneratedToLibrary}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Artwork to Library</span>
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
