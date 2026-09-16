import React, { useState } from 'react';
import { Calendar, Heart, ShieldCheck, CheckSquare, Square, Layers, BookOpen, Sparkles, MapPin } from 'lucide-react';
import { Photo, Album, SyncStatus } from '../types';

interface TimelineViewProps {
  photos: Photo[];
  albums: Album[];
  syncStatus: SyncStatus;
  onSelectPhoto: (photo: Photo) => void;
  onToggleFavorite: (id: string) => void;
  onCreateAlbumWithPhotos: (photoIds: string[]) => void;
  onCreateBookWithPhotos: (photoIds: string[]) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  photos,
  albums,
  syncStatus,
  onSelectPhoto,
  onToggleFavorite,
  onCreateAlbumWithPhotos,
  onCreateBookWithPhotos,
}) => {
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [density, setDensity] = useState<'grid' | 'cards'>('grid');

  // Group photos by Month Year
  const groupedPhotos = React.useMemo(() => {
    const groups: { [key: string]: Photo[] } = {};
    photos.forEach((ph) => {
      const d = new Date(ph.timestamp);
      const monthYear = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(ph);
    });
    return groups;
  }, [photos]);

  const toggleSelectPhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPhotoIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleCreateAlbum = () => {
    if (selectedPhotoIds.length > 0) {
      onCreateAlbumWithPhotos(selectedPhotoIds);
      setSelectedPhotoIds([]);
      setIsSelectMode(false);
    }
  };

  const handleCreateBook = () => {
    if (selectedPhotoIds.length > 0) {
      onCreateBookWithPhotos(selectedPhotoIds);
      setSelectedPhotoIds([]);
      setIsSelectMode(false);
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* Top Banner: Storage & Sync Status */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-850 border border-stone-800 text-stone-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">Google Photos Synced</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-stone-400">
              {photos.length} memories • Cloud Vault AES-256 active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setIsSelectMode(!isSelectMode);
              if (isSelectMode) setSelectedPhotoIds([]);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isSelectMode
                ? 'bg-amber-400 text-stone-950 font-bold'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            {isSelectMode ? `Done (${selectedPhotoIds.length})` : 'Select'}
          </button>
        </div>
      </div>

      {/* Floating Selection Bar */}
      {isSelectMode && selectedPhotoIds.length > 0 && (
        <div className="sticky top-24 z-20 p-3 bg-amber-500 text-stone-950 rounded-2xl shadow-xl flex items-center justify-between animate-fade-in">
          <span className="text-xs font-bold">
            {selectedPhotoIds.length} {selectedPhotoIds.length === 1 ? 'photo' : 'photos'} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateAlbum}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-950 text-amber-400 text-xs font-semibold hover:bg-stone-900 shadow-xs"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Create Album</span>
            </button>
            <button
              onClick={handleCreateBook}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Print Book</span>
            </button>
          </div>
        </div>
      )}

      {/* Photos Timeline Groups */}
      {Object.keys(groupedPhotos).length === 0 ? (
        <div className="p-12 text-center text-stone-500 space-y-2">
          <p className="text-sm">No photos found matching your criteria.</p>
        </div>
      ) : (
        (Object.entries(groupedPhotos) as [string, Photo[]][]).map(([monthYear, groupPhotos]) => (
          <div key={monthYear} className="space-y-2.5">
            {/* Month Header */}
            <div className="sticky top-12 z-10 bg-stone-950/90 backdrop-blur-md py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <h2 className="font-serif text-sm font-bold text-stone-200 tracking-tight">
                  {monthYear}
                </h2>
              </div>
              <span className="text-[11px] text-stone-500 font-medium">
                {groupPhotos.length} {groupPhotos.length === 1 ? 'capture' : 'captures'}
              </span>
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {groupPhotos.map((photo) => {
                const isSelected = selectedPhotoIds.includes(photo.id);

                return (
                  <div
                    key={photo.id}
                    onClick={() => {
                      if (isSelectMode) {
                        toggleSelectPhoto(photo.id, { stopPropagation: () => {} } as any);
                      } else {
                        onSelectPhoto(photo);
                      }
                    }}
                    className="group relative aspect-square bg-stone-900 rounded-lg overflow-hidden cursor-pointer shadow-xs border border-stone-800/40 hover:border-amber-400/50 transition-all active:scale-[0.98]"
                  >
                    <img
                      src={photo.thumbnailUrl}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                      <p className="text-[10px] text-white font-medium truncate">{photo.title}</p>
                      <p className="text-[9px] text-stone-300 flex items-center gap-0.5 truncate">
                        <MapPin className="w-2.5 h-2.5 text-rose-400" />
                        {photo.location.name}
                      </p>
                    </div>

                    {/* Top corner badges */}
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-1 z-10">
                      {photo.isFavorite && (
                        <div className="w-5 h-5 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-rose-400">
                          <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                        </div>
                      )}

                      {photo.faces.length > 0 && (
                        <div className="w-5 h-5 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-amber-300" title={`${photo.faces.length} faces recognized`}>
                          <Sparkles className="w-2.5 h-2.5" />
                        </div>
                      )}

                      {isSelectMode && (
                        <div
                          onClick={(e) => toggleSelectPhoto(photo.id, e)}
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-amber-400 text-stone-950'
                              : 'bg-black/60 text-white border border-white/40'
                          }`}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-3.5 h-3.5" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-transparent" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
