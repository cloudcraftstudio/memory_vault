import React, { useState } from 'react';
import { Layers, Plus, Sparkles, Calendar, Users, Share2, Tag, BookOpen, Palette, Check } from 'lucide-react';
import { Album, AlbumTheme, Photo } from '../types';

interface AlbumsListViewProps {
  albums: Album[];
  photos: Photo[];
  onSelectAlbum: (album: Album) => void;
  onCreateAlbum: (newAlbum: Partial<Album>) => void;
  onOpenBookStudioWithAlbum: (album: Album) => void;
}

export const AlbumsListView: React.FC<AlbumsListViewProps> = ({
  albums,
  photos,
  onSelectAlbum,
  onCreateAlbum,
  onOpenBookStudioWithAlbum,
}) => {
  const [selectedThemeFilter, setSelectedThemeFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Album Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTheme, setNewTheme] = useState<AlbumTheme>('editorial');
  const [newTags, setNewTags] = useState('');
  const [newAccentColor, setNewAccentColor] = useState('#D97706');

  const themes: { id: AlbumTheme; label: string; desc: string }[] = [
    { id: 'editorial', label: 'Editorial Magazine', desc: 'Bold typographic layouts with asymmetric visual rhythm' },
    { id: 'polaroid', label: 'Polaroid Scrapbook', desc: 'Framed prints with handwritten captions and pinboard style' },
    { id: 'masonry', label: 'Masonry Stagger', desc: 'Fluid multi-column photo grid adapting to aspect ratios' },
    { id: 'filmstrip', label: '35mm Filmstrip', desc: 'Analog cine frames with vintage border aesthetics' },
    { id: 'vintage', label: 'Vintage Heritage', desc: 'Sepia warm tones, classic serifs, and nostalgic mood' },
    { id: 'grid', label: 'Gallery Grid', desc: 'Sharp, minimalist, high-contrast gallery presentation' },
  ];

  const filteredAlbums = selectedThemeFilter === 'all'
    ? albums
    : albums.filter((a) => a.theme === selectedThemeFilter);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const parsedTags = newTags
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
      .filter(Boolean);

    // Pick first photo as default cover
    const defaultCover = photos[0]?.url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800';

    onCreateAlbum({
      title: newTitle.trim(),
      description: newDescription.trim() || 'A curated memory collection',
      theme: newTheme,
      coverPhotoUrl: defaultCover,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      tags: parsedTags.length > 0 ? parsedTags : ['curated', 'memories'],
      customAccentColor: newAccentColor,
      isShared: false,
      shareLink: `https://memoryvault.app/album/${Date.now()}`,
      collaborators: [],
      comments: [],
    });

    setNewTitle('');
    setNewDescription('');
    setNewTags('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* Top Header & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-bold text-white tracking-tight">
            Themed Digital Albums
          </h2>
          <p className="text-xs text-stone-400">
            Personalized viewing layouts & custom themes
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Album</span>
        </button>
      </div>

      {/* Theme Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
        <button
          onClick={() => setSelectedThemeFilter('all')}
          className={`px-3 py-1 rounded-full shrink-0 transition-colors ${
            selectedThemeFilter === 'all'
              ? 'bg-amber-400 text-stone-950 font-bold'
              : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
          }`}
        >
          All Themes ({albums.length})
        </button>
        {themes.map((th) => (
          <button
            key={th.id}
            onClick={() => setSelectedThemeFilter(th.id)}
            className={`px-2.5 py-1 rounded-full shrink-0 transition-colors ${
              selectedThemeFilter === th.id
                ? 'bg-amber-400 text-stone-950 font-bold'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            {th.label}
          </button>
        ))}
      </div>

      {/* Albums Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredAlbums.map((album) => {
          const albumPhotos = photos.filter((p) => p.albumIds.includes(album.id));
          const coverUrl = album.coverPhotoUrl || albumPhotos[0]?.url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800';

          return (
            <div
              key={album.id}
              onClick={() => onSelectAlbum(album)}
              className="group bg-stone-900 border border-stone-800 hover:border-amber-400/50 rounded-2xl overflow-hidden cursor-pointer shadow-md transition-all active:scale-[0.99] flex flex-col"
            >
              {/* Cover Photo */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-950">
                <img
                  src={coverUrl}
                  alt={album.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Theme badge overlay */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span
                    style={{ backgroundColor: album.customAccentColor }}
                    className="w-2.5 h-2.5 rounded-full"
                  ></span>
                  <span className="px-2 py-0.5 rounded-full bg-stone-900/90 text-stone-200 text-[10px] font-semibold backdrop-blur-md border border-white/10 uppercase tracking-wider">
                    {album.theme}
                  </span>
                </div>

                {/* Date span */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-medium drop-shadow-md">
                  <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    {album.startDate}
                  </span>

                  <span className="bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {albumPhotos.length} photos
                  </span>
                </div>
              </div>

              {/* Body Details */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-serif text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {album.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    {album.description}
                  </p>
                </div>

                {/* Footer: Tags, Collaborators, Book Print CTA */}
                <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1 overflow-hidden">
                    {album.tags.slice(0, 2).map((tg) => (
                      <span
                        key={tg}
                        className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 text-[10px]"
                      >
                        #{tg}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {album.collaborators.length > 0 && (
                      <div className="flex items-center -space-x-1.5 mr-1" title={`${album.collaborators.length} collaborators`}>
                        {album.collaborators.slice(0, 3).map((collab) => (
                          <img
                            key={collab.id}
                            src={collab.avatar}
                            alt={collab.name}
                            className="w-5 h-5 rounded-full border border-stone-900 object-cover"
                          />
                        ))}
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenBookStudioWithAlbum(album);
                      }}
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-amber-400 hover:text-stone-950 text-stone-300 transition-colors"
                      title="Print as physical photo book"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create New Album Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md p-5 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl text-stone-100">
            <h3 className="font-serif text-base font-bold text-white mb-1">
              Create Themed Digital Album
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Select custom theme options and custom tags for personalized viewing
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-300 mb-1">Album Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Summer Roadtrip 2026"
                  className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Notes, locations, or dates..."
                  className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Theme Selector */}
              <div>
                <label className="block font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  Viewing Theme Layout
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {themes.map((th) => (
                    <div
                      key={th.id}
                      onClick={() => setNewTheme(th.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        newTheme === th.id
                          ? 'bg-amber-500/10 border-amber-400 text-amber-300'
                          : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:border-stone-600'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>{th.label}</span>
                        {newTheme === th.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">{th.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Tags */}
              <div>
                <label className="block font-semibold text-stone-300 mb-1 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-sky-400" />
                  Custom Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g., travel, california, sunset, family"
                  className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Color Accent */}
              <div>
                <label className="block font-semibold text-stone-300 mb-1.5">Accent Color</label>
                <div className="flex items-center gap-2">
                  {['#D97706', '#0284C7', '#0F766E', '#BE185D', '#7C3AED', '#E11D48'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewAccentColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        newAccentColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-80 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all shadow-sm"
                >
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
