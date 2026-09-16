import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Heart,
  Share2,
  Trash2,
  Info,
  Tag,
  Plus,
  MapPin,
  Camera,
  Calendar,
  Sparkles,
  ShieldCheck,
  Download,
  Users,
  ChevronLeft,
  ChevronRight,
  Wand2,
  Edit3,
  BookOpen,
  Check,
  FileText,
} from 'lucide-react';
import { Photo, Album, ScriptureVerse } from '../types';
import {
  AngelCherubIcon,
  RaysOfLightIcon,
  PrayerHandsIcon,
  HolyDoveIcon,
  HolyCrossIcon,
  CrownOfLifeIcon,
  CrownOfThornsIcon,
} from './CelestialMotifs';
import { BIBLE_VERSES } from '../data/scriptures';

interface PhotoModalProps {
  photo: Photo | null;
  allPhotos?: Photo[];
  onSelectPhoto?: (photo: Photo) => void;
  albums: Album[];
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDeletePhoto: (id: string) => void;
  onAddTag: (photoId: string, tag: string) => void;
  onRemoveTag: (photoId: string, tag: string) => void;
  onAssignToAlbum: (photoId: string, albumId: string) => void;
  onUpdatePhotoDetails?: (photoId: string, updates: { title?: string; story?: string; description?: string }) => void;
  onOpenStudio?: (photo: Photo) => void;
  onAssignScriptureToPhoto?: (photoId: string, verse: ScriptureVerse) => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({
  photo,
  allPhotos = [],
  onSelectPhoto,
  albums,
  onClose,
  onToggleFavorite,
  onDeletePhoto,
  onAddTag,
  onRemoveTag,
  onAssignToAlbum,
  onUpdatePhotoDetails,
  onOpenStudio,
  onAssignScriptureToPhoto,
}) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showFaces, setShowFaces] = useState(true);
  const [newTagInput, setNewTagInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  
  // Full Descriptive Text Area State
  const [isEditingStory, setIsEditingStory] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedStory, setEditedStory] = useState('');
  const [storySavedNotice, setStorySavedNotice] = useState(false);

  // Scripture Picker State
  const [showScripturePicker, setShowScripturePicker] = useState(false);

  // Swiping Touch Gestures State
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50; // px

  // Calculate current index within allPhotos
  const currentIndex = photo && allPhotos.length > 0
    ? allPhotos.findIndex((p) => p.id === photo.id)
    : -1;

  // Sync edited fields when photo changes
  useEffect(() => {
    if (photo) {
      setEditedTitle(photo.title);
      setEditedStory(photo.story || photo.description || '');
      setIsEditingStory(false);
      setShowScripturePicker(false);
    }
  }, [photo?.id]);

  // Keyboard navigation listener (Left, Right, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!photo) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPhoto();
      } else if (e.key === 'ArrowRight') {
        handleNextPhoto();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, currentIndex, allPhotos]);

  if (!photo) return null;

  // Swipable Navigation Handlers
  const handlePrevPhoto = () => {
    if (allPhotos.length > 1 && currentIndex > 0 && onSelectPhoto) {
      onSelectPhoto(allPhotos[currentIndex - 1]);
    } else if (allPhotos.length > 1 && currentIndex === 0 && onSelectPhoto) {
      onSelectPhoto(allPhotos[allPhotos.length - 1]); // Loop to end
    }
  };

  const handleNextPhoto = () => {
    if (allPhotos.length > 1 && currentIndex < allPhotos.length - 1 && onSelectPhoto) {
      onSelectPhoto(allPhotos[currentIndex + 1]);
    } else if (allPhotos.length > 1 && currentIndex === allPhotos.length - 1 && onSelectPhoto) {
      onSelectPhoto(allPhotos[0]); // Loop to start
    }
  };

  // Touch handlers for mobile swiping
  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextPhoto();
    } else if (isRightSwipe) {
      handlePrevPhoto();
    }
  };

  const handleAddTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newTagInput.trim().toLowerCase().replace(/^#/, '');
    if (clean && !photo.tags.includes(clean)) {
      onAddTag(photo.id, clean);
      setNewTagInput('');
    }
  };

  const handleSaveStory = () => {
    if (onUpdatePhotoDetails) {
      onUpdatePhotoDetails(photo.id, {
        title: editedTitle.trim() || photo.title,
        story: editedStory.trim(),
        description: editedStory.trim().slice(0, 150),
      });
    }
    setIsEditingStory(false);
    setStorySavedNotice(true);
    setTimeout(() => setStorySavedNotice(false), 2200);
  };

  const handleShareClick = () => {
    navigator.clipboard?.writeText?.(photo.url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const executeDelete = () => {
    setShowDeleteConfirm(false);
    onDeletePhoto(photo.id);
    onClose();
  };

  const handleSelectScripture = (verse: ScriptureVerse) => {
    if (onAssignScriptureToPhoto) {
      onAssignScriptureToPhoto(photo.id, verse);
    }
    setShowScripturePicker(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in select-none">
      {/* Container */}
      <div className="relative w-full h-full max-w-7xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Main Swipable Lightbox Canvas */}
        <div
          className="relative flex-1 flex flex-col items-center justify-center p-2 sm:p-4 pt-16 pb-16 overflow-hidden min-h-0"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Top Floating Controls Bar - strictly constrained to the photo canvas area */}
          <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
              <button
                onClick={onClose}
                className="p-2 sm:p-2.5 rounded-full bg-black/70 text-white hover:bg-black/90 backdrop-blur-md border border-white/10 transition-colors shadow-lg"
                aria-label="Close photo view"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Position Counter Indicator */}
              {allPhotos.length > 0 && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/70 text-amber-300 backdrop-blur-md border border-amber-500/20 shadow-md whitespace-nowrap">
                  {currentIndex + 1} of {allPhotos.length}
                </span>
              )}

              <span className="text-xs text-stone-300 font-medium px-3 py-1 rounded-full bg-black/60 backdrop-blur-md hidden xl:inline border border-white/5 max-w-[200px] truncate">
                {photo.date} • {photo.location.name}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 pointer-events-auto">
              {/* Open Studio Button (Editing, BG removal, AI enhancements, Resize, AI generation) */}
              <button
                onClick={() => onOpenStudio && onOpenStudio(photo)}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all shrink-0"
                title="Open Image Studio (Edit, BG removal, Resize, AI enhance, AI gen)"
              >
                <Wand2 className="w-3.5 h-3.5 text-stone-950" />
                <span className="hidden sm:inline">AI Studio</span>
              </button>

              {photo.faces.length > 0 && (
                <button
                  onClick={() => setShowFaces(!showFaces)}
                  className={`p-2 rounded-full backdrop-blur-md border border-white/10 transition-colors shrink-0 ${
                    showFaces ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-black/60 text-white hover:bg-black/80'
                  }`}
                  title="Toggle Face Recognition Overlays"
                >
                  <Users className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => onToggleFavorite(photo.id)}
                className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md border border-white/10 transition-colors shrink-0"
                title="Add to Favorites"
              >
                <Heart className={`w-4 h-4 ${photo.isFavorite ? 'text-rose-500 fill-rose-500' : ''}`} />
              </button>

              <button
                onClick={handleShareClick}
                className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md border border-white/10 transition-colors relative shrink-0"
                title="Share photo link"
              >
                <Share2 className="w-4 h-4" />
                {copiedShare && (
                  <span className="absolute -bottom-7 right-0 text-[10px] bg-amber-500 text-stone-950 px-2 py-0.5 rounded font-bold shadow-md whitespace-nowrap">
                    Link Copied!
                  </span>
                )}
              </button>

              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className={`p-2 rounded-full backdrop-blur-md border border-white/10 transition-colors shrink-0 ${
                  showSidebar ? 'bg-amber-400 text-stone-950 font-bold' : 'bg-black/60 text-white hover:bg-black/80'
                }`}
                title={showSidebar ? 'Hide Details & Scripture Panel' : 'Show Details & Scripture Panel'}
              >
                <Info className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-full bg-black/60 text-rose-400 hover:bg-rose-500 hover:text-white backdrop-blur-md border border-white/10 transition-colors shrink-0"
                title="Delete photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Previous Photo Button (Left arrow) */}
          {allPhotos.length > 1 && (
            <button
              onClick={handlePrevPhoto}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-amber-500 hover:text-stone-950 text-white backdrop-blur-md border border-white/10 transition-all shadow-xl active:scale-90 hidden sm:flex items-center justify-center"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Photo Button (Right arrow) */}
          {allPhotos.length > 1 && (
            <button
              onClick={handleNextPhoto}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-amber-500 hover:text-stone-950 text-white backdrop-blur-md border border-white/10 transition-all shadow-xl active:scale-90 hidden sm:flex items-center justify-center"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Photo Canvas */}
          <div className="relative max-h-[70vh] md:max-h-[78vh] max-w-full flex items-center justify-center">
            <img
              src={photo.url}
              alt={photo.title}
              className="max-h-[68vh] md:max-h-[76vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl transition-transform duration-300"
            />

            {/* AI Face Recognition Bounding Boxes */}
            {showFaces && photo.faces.map((face) => {
              if (!face.box) return null;
              return (
                <div
                  key={face.id}
                  style={{
                    left: `${face.box.x}%`,
                    top: `${face.box.y}%`,
                    width: `${face.box.w}%`,
                    height: `${face.box.h}%`,
                  }}
                  className="absolute border-2 border-amber-400/90 rounded-xl shadow-sm shadow-amber-400/50 pointer-events-none animate-fade-in"
                >
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-900/90 text-amber-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1 shadow-md">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    <span>{face.name}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Thumbnails Carousel Filmstrip for Instant Swiping / Tap */}
          {allPhotos.length > 1 && (
            <div className="w-full max-w-2xl px-4 py-2 mt-2 flex items-center justify-center gap-1.5 overflow-x-auto scrollbar-none z-20">
              {allPhotos.map((p, idx) => {
                const isActive = p.id === photo.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectPhoto && onSelectPhoto(p)}
                    className={`shrink-0 w-11 h-11 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      isActive
                        ? 'border-amber-400 scale-110 shadow-md shadow-amber-500/30'
                        : 'border-stone-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={p.thumbnailUrl || p.url}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar / Drawer: Full Descriptive Text Areas & Spiritual Blessings */}
        {showSidebar && (
          <aside
            className="w-full md:w-96 lg:w-[26rem] bg-stone-900/95 border-t md:border-t-0 md:border-l border-stone-800 p-4 sm:p-5 overflow-y-auto max-h-[50vh] md:max-h-full transition-all text-stone-200 shrink-0 z-20 flex flex-col"
          >
            {/* Clean Sidebar Top Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-800 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-200/90">
                  Memory Insights & Scripture
                </span>
              </div>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 text-xs transition-colors"
                title="Hide details panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5 flex-1">
              {/* Spiritual Scripture Verse Blessing Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-stone-800 to-stone-850 border border-amber-500/30 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <RaysOfLightIcon size={16} />
                  <span>Scripture Blessing</span>
                </span>
                <button
                  onClick={() => setShowScripturePicker(!showScripturePicker)}
                  className="text-[10px] text-amber-300 hover:text-white underline cursor-pointer"
                >
                  {showScripturePicker ? 'Close Picker' : 'Change Verse'}
                </button>
              </div>

              {photo.spiritualVerse ? (
                <div>
                  <p className="font-serif italic text-stone-100 text-xs leading-relaxed">
                    &ldquo;{photo.spiritualVerse.text}&rdquo;
                  </p>
                  <p className="font-serif font-semibold text-amber-300 text-right text-[11px] mt-1">
                    — {photo.spiritualVerse.reference}
                  </p>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-xs text-stone-400 italic mb-2">No scripture verse attached yet.</p>
                  <button
                    onClick={() => setShowScripturePicker(true)}
                    className="px-3 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-stone-950 rounded-lg text-xs font-semibold transition-colors"
                  >
                    + Pair Sacred Scripture
                  </button>
                </div>
              )}

              {/* Quick Scripture Picker Popover */}
              {showScripturePicker && (
                <div className="mt-3 pt-2.5 border-t border-amber-500/20 space-y-1.5 max-h-48 overflow-y-auto animate-fade-in pr-1">
                  <span className="text-[10px] text-stone-400 block font-semibold">Select a Bible Verse:</span>
                  {BIBLE_VERSES.map((verse, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectScripture(verse)}
                      className="w-full text-left p-2 rounded-lg bg-stone-900/80 hover:bg-amber-500/20 border border-stone-800 text-[11px] text-stone-200 transition-colors group"
                    >
                      <span className="font-bold text-amber-400 group-hover:text-amber-300 block">
                        {verse.reference}
                      </span>
                      <span className="line-clamp-2 italic text-stone-300">&ldquo;{verse.text}&rdquo;</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* FULL DESCRIPTIVE TEXT AREA & JOURNALING */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Memory Story & Journal</span>
                </span>
                {!isEditingStory ? (
                  <button
                    onClick={() => setIsEditingStory(true)}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Story</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSaveStory}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                  >
                    <Check className="w-3 h-3" />
                    <span>Save</span>
                  </button>
                )}
              </div>

              {storySavedNotice && (
                <p className="text-[11px] text-emerald-400 font-semibold animate-fade-in">
                  Story & Title saved to MemoryVault!
                </p>
              )}

              {isEditingStory ? (
                <div className="space-y-2 animate-fade-in">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="Memory title..."
                    className="w-full px-3 py-1.5 bg-stone-800 text-stone-100 rounded-lg border border-amber-500/40 text-xs font-bold focus:outline-none"
                  />
                  <textarea
                    rows={6}
                    value={editedStory}
                    onChange={(e) => setEditedStory(e.target.value)}
                    placeholder="Write the full memory story, journal reflections, personal thoughts, and spiritual meaning..."
                    className="w-full px-3 py-2 bg-stone-800 text-stone-100 rounded-xl border border-stone-700 text-xs leading-relaxed focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setIsEditingStory(false)}
                      className="px-3 py-1 rounded-lg text-xs text-stone-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveStory}
                      className="px-3.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs"
                    >
                      Save Memory
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-stone-800/60 border border-stone-800 text-xs leading-relaxed space-y-2">
                  <h3 className="font-serif font-bold text-sm text-white">{photo.title}</h3>
                  {photo.story || photo.description ? (
                    <p className="text-stone-300 whitespace-pre-wrap">{photo.story || photo.description}</p>
                  ) : (
                    <p className="text-stone-500 italic">
                      No descriptive story added yet. Click &ldquo;Edit Story&rdquo; to chronicle this memory.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* AI Image Studio Action Banner */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-stone-800 to-stone-800 border border-amber-500/30 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-sm">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">AI Image Studio</p>
                  <p className="text-[10px] text-amber-200/80">Background removal, divine rays, resize</p>
                </div>
              </div>
              <button
                onClick={() => onOpenStudio && onOpenStudio(photo)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95"
              >
                Launch Studio
              </button>
            </div>

            {/* Recognized People */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  Recognized People
                </span>
                <span className="text-[10px] text-stone-500">AI Face Vision</span>
              </div>

              {photo.faces.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {photo.faces.map((f) => (
                    <span
                      key={f.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-400/10 text-amber-300 border border-amber-400/30"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {f.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-500 italic">No faces tagged in this capture.</p>
              )}
            </div>

            {/* Custom Search Tags */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1.5 mb-2">
                <Tag className="w-3.5 h-3.5 text-sky-400" />
                Custom Search Tags
              </span>

              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {photo.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-stone-800 text-stone-300 border border-stone-700"
                  >
                    #{t}
                    <button
                      onClick={() => onRemoveTag(photo.id, t)}
                      className="text-stone-400 hover:text-rose-400 ml-0.5"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add tag form */}
              <form onSubmit={handleAddTagSubmit} className="flex gap-1.5">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="Add custom tag (e.g. goldenhour)..."
                  className="flex-1 px-3 py-1.5 bg-stone-800 text-stone-200 placeholder-stone-500 text-xs rounded-lg border border-stone-700 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* EXIF Metadata */}
            <div className="space-y-2 border-t border-stone-800 pt-3 text-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                EXIF Metadata
              </span>

              <div className="grid grid-cols-2 gap-2 text-stone-300">
                <div className="p-2 rounded bg-stone-800/60">
                  <span className="text-[10px] text-stone-400 block">Camera</span>
                  <span className="font-medium truncate">{photo.metadata.camera || 'Google Camera'}</span>
                </div>
                <div className="p-2 rounded bg-stone-800/60">
                  <span className="text-[10px] text-stone-400 block">Lens</span>
                  <span className="font-medium truncate">{photo.metadata.lens || 'Standard'}</span>
                </div>
                <div className="p-2 rounded bg-stone-800/60">
                  <span className="text-[10px] text-stone-400 block">Aperture & Shutter</span>
                  <span className="font-medium">{photo.metadata.aperture} • {photo.metadata.shutterSpeed}</span>
                </div>
                <div className="p-2 rounded bg-stone-800/60">
                  <span className="text-[10px] text-stone-400 block">Resolution</span>
                  <span className="font-medium">{photo.metadata.resolution}</span>
                </div>
                <div className="p-2 rounded bg-stone-800/60 col-span-2">
                  <span className="text-[10px] text-stone-400 block">Location</span>
                  <span className="font-medium truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                    {photo.location.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Assign to Album */}
            <div className="border-t border-stone-800 pt-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block mb-2">
                Assign to Themed Album
              </span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onAssignToAlbum(photo.id, e.target.value);
                  }
                }}
                defaultValue=""
                className="w-full px-3 py-2 bg-stone-800 text-stone-200 text-xs rounded-lg border border-stone-700 focus:outline-none focus:border-amber-400"
              >
                <option value="" disabled>Choose album...</option>
                {albums.map((alb) => (
                  <option key={alb.id} value={alb.id}>
                    {alb.title} ({alb.theme})
                  </option>
                ))}
              </select>
            </div>

          </div>
        </aside>
      )}

      </div>

      {/* Confirmation Dialog for Destructive Delete */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm p-5 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl text-stone-100">
            <h4 className="text-base font-bold text-white mb-2">
              Delete photo from MemoryVault?
            </h4>
            <p className="text-xs text-stone-300 mb-4 leading-relaxed">
              Are you sure you want to delete &ldquo;{photo.title}&rdquo;? This will remove the photo from your albums and cloud vault.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-stone-300 hover:bg-stone-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
