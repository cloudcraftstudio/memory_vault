import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Share2,
  Users,
  MessageSquare,
  BookOpen,
  Palette,
  Tag,
  Plus,
  X,
  Check,
  Sparkles,
  MapPin,
  Heart,
  Send,
  Link,
  Shield,
} from 'lucide-react';
import { Album, AlbumTheme, Photo } from '../types';

interface AlbumDetailViewProps {
  album: Album;
  photos: Photo[];
  onBack: () => void;
  onSelectPhoto: (photo: Photo) => void;
  onUpdateAlbumTheme: (albumId: string, theme: AlbumTheme) => void;
  onAddAlbumTag: (albumId: string, tag: string) => void;
  onAddCollaborator: (albumId: string, email: string, name: string) => void;
  onAddComment: (albumId: string, text: string) => void;
  onOpenBookStudio: (album: Album) => void;
}

export const AlbumDetailView: React.FC<AlbumDetailViewProps> = ({
  album,
  photos,
  onBack,
  onSelectPhoto,
  onUpdateAlbumTheme,
  onAddAlbumTag,
  onAddCollaborator,
  onAddComment,
  onOpenBookStudio,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [sharePermission, setSharePermission] = useState<'view' | 'edit' | 'comment'>('edit');
  const [copiedLink, setCopiedLink] = useState(false);

  // Photos belonging to this album
  const albumPhotos = photos.filter((p) => p.albumIds.includes(album.id));

  const themes: { id: AlbumTheme; label: string; desc: string }[] = [
    { id: 'editorial', label: 'Editorial Magazine', desc: 'Asymmetric layout with bold hero masthead' },
    { id: 'polaroid', label: 'Polaroid Scrapbook', desc: 'Framed prints with handwritten notes & pins' },
    { id: 'masonry', label: 'Masonry Stagger', desc: 'Dynamic flowing columns' },
    { id: 'filmstrip', label: '35mm Filmstrip', desc: 'Analog cine sprocket borders & frame tags' },
    { id: 'vintage', label: 'Vintage Heritage', desc: 'Warm nostalgic tones with serif framing' },
    { id: 'grid', label: 'Gallery Grid', desc: 'Clean, minimalist high-contrast presentation' },
  ];

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newTagInput.trim().toLowerCase().replace(/^#/, '');
    if (clean && !album.tags.includes(clean)) {
      onAddAlbumTag(album.id, clean);
      setNewTagInput('');
    }
  };

  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(album.id, commentInput.trim());
    setCommentInput('');
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    onAddCollaborator(album.id, inviteEmail.trim(), inviteName.trim() || inviteEmail.split('@')[0]);
    setInviteEmail('');
    setInviteName('');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(album.shareLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-5 pb-24 animate-fade-in text-stone-100">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:bg-stone-800 text-xs font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Albums</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Theme switcher trigger */}
          <button
            onClick={() => setShowThemeModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-400 text-stone-300 hover:text-amber-300 text-xs transition-colors"
            title="Switch Album Viewing Layout Theme"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className="capitalize">{album.theme}</span>
          </button>

          {/* Share & Collab trigger */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-sky-400 text-stone-300 hover:text-sky-300 text-xs transition-colors"
            title="Share with family & friends"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Share</span>
          </button>

          {/* Photo book studio trigger */}
          <button
            onClick={() => onOpenBookStudio(album)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs shadow-sm transition-all active:scale-95"
            title="Generate physical photo book"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Print Book</span>
          </button>
        </div>
      </div>

      {/* Album Title Header Banner */}
      <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 relative overflow-hidden">
        <div
          className="absolute -right-12 -top-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: album.customAccentColor }}
        ></div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              style={{ backgroundColor: album.customAccentColor }}
              className="w-3 h-3 rounded-full"
            ></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
              {album.theme} theme • {albumPhotos.length} photos
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>{album.startDate} {album.endDate && album.endDate !== album.startDate ? `– ${album.endDate}` : ''}</span>
          </div>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
          {album.title}
        </h1>

        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
          {album.description}
        </p>

        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {album.tags.map((t) => (
            <span
              key={t}
              className="px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 text-[11px] border border-stone-700/60"
            >
              #{t}
            </span>
          ))}

          {/* Add tag form */}
          <form onSubmit={handleAddTag} className="flex items-center gap-1">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="+ tag"
              className="w-16 px-2 py-0.5 bg-stone-800/80 border border-stone-700 rounded-full text-[10px] text-stone-200 placeholder-stone-500 focus:w-24 focus:outline-none focus:border-amber-400 transition-all"
            />
          </form>
        </div>

        {/* Collaborators row preview */}
        {album.collaborators.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-400 text-[11px]">Collaborating:</span>
              <div className="flex items-center -space-x-1.5">
                {album.collaborators.map((c) => (
                  <img
                    key={c.id}
                    src={c.avatar}
                    alt={c.name}
                    title={`${c.name} (${c.role})`}
                    className="w-6 h-6 rounded-full border-2 border-stone-900 object-cover"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowShareModal(true)}
              className="text-[11px] text-sky-400 hover:text-sky-300 font-medium"
            >
              Manage ({album.collaborators.length})
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          DYNAMIC THEMED LAYOUTS
          ========================================================================= */}

      {/* 1. EDITORIAL MAGAZINE THEME */}
      {album.theme === 'editorial' && (
        <div className="space-y-4">
          {albumPhotos.length > 0 && (
            // Big Hero Masthead
            <div
              onClick={() => onSelectPhoto(albumPhotos[0])}
              className="group relative aspect-16/10 rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-stone-800"
            >
              <img
                src={albumPhotos[0].url}
                alt={albumPhotos[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1">
                  Feature Capture
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                  {albumPhotos[0].title}
                </h3>
                <p className="text-xs text-stone-300 mt-1 max-w-lg">
                  {albumPhotos[0].description}
                </p>
              </div>
            </div>
          )}

          {/* Asymmetric secondary grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {albumPhotos.slice(1).map((photo, i) => (
              <div
                key={photo.id}
                onClick={() => onSelectPhoto(photo)}
                className={`group relative rounded-xl overflow-hidden cursor-pointer bg-stone-900 border border-stone-800 shadow-md ${
                  i % 3 === 0 ? 'sm:col-span-2 aspect-21/9' : 'aspect-4/3'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent p-3.5 flex flex-col justify-end opacity-90 group-hover:opacity-100">
                  <p className="text-xs font-bold text-white font-serif">{photo.title}</p>
                  <p className="text-[10px] text-stone-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-2.5 h-2.5 text-rose-400" />
                    {photo.location.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. POLAROID SCRAPBOOK THEME */}
      {album.theme === 'polaroid' && (
        <div className="p-4 rounded-3xl bg-stone-900/60 border border-stone-800/80 shadow-inner">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {albumPhotos.map((photo, index) => {
              const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-0'];
              const rotClass = rotations[index % rotations.length];

              return (
                <div
                  key={photo.id}
                  onClick={() => onSelectPhoto(photo)}
                  className={`group bg-white p-2.5 pb-4 rounded-xs shadow-lg transform ${rotClass} hover:rotate-0 hover:scale-105 hover:z-10 transition-all duration-300 cursor-pointer border border-stone-200`}
                >
                  {/* Tape top simulation */}
                  <div className="w-10 h-3 bg-amber-200/60 mx-auto -mt-4 mb-1.5 shadow-xs rotate-1"></div>

                  <div className="aspect-square w-full overflow-hidden bg-stone-100">
                    <img
                      src={photo.thumbnailUrl}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-2.5 px-1">
                    <p className="font-serif italic text-xs font-semibold text-stone-900 truncate">
                      {photo.title}
                    </p>
                    <p className="text-[10px] text-stone-500 mt-0.5 flex items-center justify-between">
                      <span>{photo.date}</span>
                      {photo.faces.length > 0 && (
                        <span className="text-amber-600 font-semibold">{photo.faces[0].name.split(' ')[0]}</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. MASONRY STAGGER THEME */}
      {album.theme === 'masonry' && (
        <div className="columns-2 sm:columns-3 gap-3 space-y-3">
          {albumPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => onSelectPhoto(photo)}
              className="break-inside-avoid group relative rounded-xl overflow-hidden bg-stone-900 border border-stone-800 shadow-md cursor-pointer hover:border-amber-400 transition-all"
            >
              <img
                src={photo.url}
                alt={photo.title}
                loading="lazy"
                className="w-full object-cover transition-transform duration-300 group-hover:scale-102"
              />
              <div className="p-2.5 bg-stone-900/90 text-stone-200">
                <p className="text-xs font-semibold text-white truncate">{photo.title}</p>
                <div className="flex items-center justify-between mt-1 text-[10px] text-stone-400">
                  <span>{photo.date}</span>
                  <span>{photo.metadata.camera}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. 35MM FILMSTRIP THEME */}
      {album.theme === 'filmstrip' && (
        <div className="space-y-4">
          <div className="p-3 bg-black rounded-2xl border-2 border-stone-800 shadow-2xl">
            {/* Top sprocket strip */}
            <div className="flex items-center justify-between px-2 py-1 mb-2 border-b border-stone-800">
              <span className="text-[9px] font-mono tracking-widest text-amber-500 uppercase">
                KODAK PORTRA 400 • 35MM
              </span>
              <div className="flex gap-2">
                {[...Array(8)].map((_, i) => (
                  <span key={i} className="w-2.5 h-1.5 bg-stone-700 rounded-2xs"></span>
                ))}
              </div>
            </div>

            {/* Photos Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {albumPhotos.map((photo, i) => (
                <div
                  key={photo.id}
                  onClick={() => onSelectPhoto(photo)}
                  className="group relative bg-stone-950 p-2 border border-stone-800 rounded-lg cursor-pointer hover:border-amber-400 transition-colors"
                >
                  <div className="aspect-3/2 overflow-hidden rounded">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-full object-cover filter contrast-105"
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[9px] font-mono text-stone-400">
                    <span className="text-amber-400 font-bold">#{String(i + 1).padStart(2, '0')}</span>
                    <span className="truncate ml-1">{photo.title}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom sprocket strip */}
            <div className="flex items-center justify-between px-2 py-1 mt-2 border-t border-stone-800">
              <span className="text-[9px] font-mono text-stone-500">ISO 400 • FILM FRAME LOG</span>
              <div className="flex gap-2">
                {[...Array(8)].map((_, i) => (
                  <span key={i} className="w-2.5 h-1.5 bg-stone-700 rounded-2xs"></span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. VINTAGE HERITAGE THEME */}
      {album.theme === 'vintage' && (
        <div className="p-5 rounded-3xl bg-amber-950/20 border-2 border-amber-900/40 shadow-xl space-y-4">
          <div className="text-center pb-3 border-b border-amber-900/30">
            <span className="font-serif italic text-xs text-amber-400 uppercase tracking-widest">
              Archival Heritage Collection
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {albumPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => onSelectPhoto(photo)}
                className="group relative p-2 bg-stone-900/90 rounded-xl border border-amber-900/40 cursor-pointer shadow-md hover:border-amber-400 transition-all"
              >
                <div className="aspect-4/3 overflow-hidden rounded-lg bg-stone-950">
                  <img
                    src={photo.thumbnailUrl}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover filter sepia-[0.25] group-hover:sepia-0 transition-all duration-300"
                  />
                </div>
                <div className="mt-2 text-center">
                  <p className="font-serif text-xs font-bold text-amber-200 truncate">
                    {photo.title}
                  </p>
                  <p className="text-[10px] text-amber-400/80 mt-0.5">{photo.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. CLEAN GALLERY GRID THEME */}
      {album.theme === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {albumPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => onSelectPhoto(photo)}
              className="group relative aspect-square bg-stone-900 rounded-xl overflow-hidden cursor-pointer shadow-xs border border-stone-800 hover:border-amber-400 transition-all"
            >
              <img
                src={photo.thumbnailUrl}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                <p className="text-xs font-semibold text-white truncate">{photo.title}</p>
                <p className="text-[10px] text-stone-300">{photo.metadata.camera}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {albumPhotos.length === 0 && (
        <div className="p-12 text-center bg-stone-900/50 rounded-2xl border border-stone-800">
          <p className="text-sm text-stone-400">This album does not have any photos yet.</p>
          <p className="text-xs text-stone-500 mt-1">Open individual photos in the Photos timeline to assign them here.</p>
        </div>
      )}

      {/* Collaboration & Comments Stream */}
      <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif text-sm font-bold text-white">
              Family & Friend Notes ({album.comments.length})
            </h3>
          </div>
          <span className="text-[10px] text-stone-400">Live Collaboration</span>
        </div>

        {/* Comments list */}
        <div className="space-y-2.5 max-h-56 overflow-y-auto">
          {album.comments.length === 0 ? (
            <p className="text-xs text-stone-500 italic py-2">
              No notes yet. Leave a memory or greeting for family & friends!
            </p>
          ) : (
            album.comments.map((cm) => (
              <div key={cm.id} className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-800/60 border border-stone-800 text-xs">
                <img
                  src={cm.avatar}
                  alt={cm.author}
                  className="w-6 h-6 rounded-full object-cover mt-0.5 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{cm.author}</span>
                    <span className="text-[10px] text-stone-500">
                      {new Date(cm.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-stone-300 mt-0.5 leading-relaxed">{cm.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment input form */}
        <form onSubmit={handleAddCommentSubmit} className="flex gap-2 pt-1">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Share a memory or thought about this album..."
            className="flex-1 px-3 py-2 bg-stone-800 text-stone-200 placeholder-stone-500 text-xs rounded-xl border border-stone-700 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* =========================================================================
          MODALS
          ========================================================================= */}

      {/* Theme Switcher Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md p-5 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl text-stone-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-400" />
                Change Viewing Theme Layout
              </h3>
              <button onClick={() => setShowThemeModal(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-stone-400 mb-4">
              Dynamically transforms this album into custom viewing layouts
            </p>

            <div className="space-y-2">
              {themes.map((th) => (
                <div
                  key={th.id}
                  onClick={() => {
                    onUpdateAlbumTheme(album.id, th.id);
                    setShowThemeModal(false);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    album.theme === th.id
                      ? 'bg-amber-500/10 border-amber-400 text-amber-300'
                      : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:border-stone-600'
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold block">{th.label}</span>
                    <span className="text-[10px] text-stone-400">{th.desc}</span>
                  </div>
                  {album.theme === th.id && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Social Sharing & Collaboration Sheet */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md p-5 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl text-stone-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-sky-400" />
                Share & Collaborate
              </h3>
              <button onClick={() => setShowShareModal(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Shareable Link Box */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Shareable Album Link
              </label>
              <div className="flex items-center gap-2 p-2 bg-stone-800 rounded-xl border border-stone-700">
                <Link className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="text-xs text-stone-300 truncate flex-1 font-mono">
                  {album.shareLink}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold transition-colors shrink-0"
                >
                  {copiedLink ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Permission level */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Link Access Permissions
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['view', 'edit', 'comment'] as const).map((perm) => (
                  <button
                    key={perm}
                    type="button"
                    onClick={() => setSharePermission(perm)}
                    className={`py-1.5 px-2 rounded-lg border text-center capitalize transition-colors ${
                      sharePermission === perm
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-semibold'
                        : 'bg-stone-800 border-stone-700 text-stone-400'
                    }`}
                  >
                    Can {perm}
                  </button>
                ))}
              </div>
            </div>

            {/* Invite Collaborators */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                Invite Friends & Family
              </label>
              <form onSubmit={handleInviteSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="Name (e.g., Grandma Rose)"
                    className="w-1/3 px-3 py-1.5 bg-stone-800 border border-stone-700 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-sky-400"
                  />
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Email address"
                    className="flex-1 px-3 py-1.5 bg-stone-800 border border-stone-700 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-sky-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-stone-950 font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Send Invitation
                </button>
              </form>
            </div>

            {/* Current collaborators list */}
            <div>
              <span className="text-[11px] font-semibold text-stone-400 block mb-1.5">
                Current Collaborators
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {album.collaborators.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-2 rounded-lg bg-stone-800/70 text-xs">
                    <div className="flex items-center gap-2">
                      <img src={c.avatar} alt={c.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-white font-medium">{c.name}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 capitalize">{c.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
