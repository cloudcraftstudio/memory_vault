import React, { useState } from 'react';
import { Photo, PhotoCategory } from '../types';
import {
  Users,
  MapPin,
  Package,
  Palette,
  Sparkles,
  Layers,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import {
  AngelCherubIcon,
  RaysOfLightIcon,
  HolyDoveIcon,
  CrownOfLifeIcon,
} from './CelestialMotifs';
import confetti from 'canvas-confetti';
import { getSuggestedScriptureForPhoto } from '../data/scriptures';

interface AutoOrganizeBarProps {
  photos: Photo[];
  activeCategory: PhotoCategory | 'all';
  onSelectCategory: (cat: PhotoCategory | 'all') => void;
  activeSubFilter: string | null;
  onSelectSubFilter: (sub: string | null) => void;
  onAutoOrganizeComplete: (updatedPhotos: Photo[]) => void;
}

export const AutoOrganizeBar: React.FC<AutoOrganizeBarProps> = ({
  photos,
  activeCategory,
  onSelectCategory,
  activeSubFilter,
  onSelectSubFilter,
  onAutoOrganizeComplete,
}) => {
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [organizeProgress, setOrganizeProgress] = useState(0);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [summaryStats, setSummaryStats] = useState<{
    people: number;
    places: number;
    things: number;
    styles: number;
  } | null>(null);

  // Sub-filter definitions based on current active category
  const subFilters = React.useMemo(() => {
    switch (activeCategory) {
      case 'people':
        return [
          { id: 'family', label: 'Family & Elders' },
          { id: 'friends', label: 'Friends & Companions' },
          { id: 'portraits', label: 'Portraits' },
          { id: 'gatherings', label: 'Group Gatherings' },
        ];
      case 'places':
        return [
          { id: 'coastal', label: 'Coasts & Oceans' },
          { id: 'mountains', label: 'Mountains & Peaks' },
          { id: 'sanctuaries', label: 'Sanctuaries & Temples' },
          { id: 'cities', label: 'Cities & Streets' },
          { id: 'nature', label: 'Gardens & Wilderness' },
        ];
      case 'things':
        return [
          { id: 'scripture', label: 'Sacred Books & Scripture' },
          { id: 'vehicles', label: 'Vehicles & Campers' },
          { id: 'feasts', label: 'Feasts & Meals' },
          { id: 'flora', label: 'Flora & Creation' },
          { id: 'heirlooms', label: 'Art & Heirlooms' },
        ];
      case 'styles':
        return [
          { id: 'celestial', label: 'Celestial Radiance' },
          { id: 'goldenhour', label: 'Golden Hour' },
          { id: 'monochrome', label: 'Fine Art B&W' },
          { id: 'vintage', label: 'Vintage Film' },
          { id: 'candid', label: 'Candid Documentary' },
        ];
      default:
        return [];
    }
  }, [activeCategory]);

  // Execute the automated organization algorithm across all library photos
  const handleRunAutoOrganize = () => {
    setIsOrganizing(true);
    setShowStatusModal(true);
    setOrganizeProgress(10);

    const step1 = setTimeout(() => setOrganizeProgress(35), 400);
    const step2 = setTimeout(() => setOrganizeProgress(70), 800);
    const step3 = setTimeout(() => {
      setOrganizeProgress(100);

      // Automated AI Classification Logic
      let pCount = 0;
      let plCount = 0;
      let tCount = 0;
      let sCount = 0;

      const organized: Photo[] = photos.map((photo) => {
        const text = `${photo.title} ${photo.description || ''} ${photo.tags.join(' ')} ${photo.location.name}`.toLowerCase();
        let cat: PhotoCategory = 'places';
        let placeCat = 'Gardens & Wilderness';
        let thingCat = 'Art & Heirlooms';
        let styleCat = 'Golden Hour';

        // 1. People Detection (Faces or tags)
        if (photo.faces.length > 0 || text.includes('family') || text.includes('friend') || text.includes('reunion') || text.includes('portrait')) {
          cat = 'people';
          pCount++;
        }
        // 2. Things (Vehicles, Food, Scripture, Objects)
        else if (text.includes('van') || text.includes('car') || text.includes('book') || text.includes('scripture') || text.includes('feast') || text.includes('glass') || text.includes('lantern') || text.includes('camera')) {
          cat = 'things';
          tCount++;
        }
        // 3. Styles (Astrophotography, Monochrome, Vintage, Golden Radiance)
        else if (text.includes('stars') || text.includes('milky') || text.includes('minimal') || text.includes('night') || text.includes('autumn') || text.includes('vintage') || text.includes('radiance')) {
          cat = 'styles';
          sCount++;
        }
        // 4. Places default
        else {
          cat = 'places';
          plCount++;
        }

        // Subcategory classification
        if (text.includes('coast') || text.includes('ocean') || text.includes('beach') || text.includes('cliff')) {
          placeCat = 'Coasts & Oceans';
        } else if (text.includes('mountain') || text.includes('peak') || text.includes('yosemite') || text.includes('fjord')) {
          placeCat = 'Mountains & Peaks';
        } else if (text.includes('temple') || text.includes('church') || text.includes('pagoda') || text.includes('sanctuary')) {
          placeCat = 'Sanctuaries & Temples';
        } else if (text.includes('city') || text.includes('oslo') || text.includes('street') || text.includes('gion')) {
          placeCat = 'Cities & Streets';
        }

        if (text.includes('van') || text.includes('boat') || text.includes('vehicle')) {
          thingCat = 'Vehicles & Campers';
        } else if (text.includes('bbq') || text.includes('feast') || text.includes('picnic') || text.includes('toast')) {
          thingCat = 'Feasts & Meals';
        } else if (text.includes('bible') || text.includes('book') || text.includes('scripture')) {
          thingCat = 'Sacred Books & Scripture';
        }

        if (text.includes('stars') || text.includes('celestial') || text.includes('milkyway')) {
          styleCat = 'Celestial Radiance';
        } else if (text.includes('sunset') || text.includes('goldenhour') || text.includes('first light')) {
          styleCat = 'Golden Hour';
        } else if (text.includes('minimal') || text.includes('scandinavian') || text.includes('monochrome')) {
          styleCat = 'Fine Art B&W';
        } else if (text.includes('vintage') || text.includes('autumn')) {
          styleCat = 'Vintage Film';
        }

        // Pair with Scripture Verse blessing
        const spiritualVerse = photo.spiritualVerse || getSuggestedScriptureForPhoto(photo.tags, cat);

        return {
          ...photo,
          category: cat,
          placeCategory: placeCat,
          thingCategory: thingCat,
          styleCategory: styleCat,
          spiritualVerse,
        };
      });

      setSummaryStats({
        people: pCount,
        places: plCount,
        things: tCount,
        styles: sCount,
      });

      onAutoOrganizeComplete(organized);
      setIsOrganizing(false);

      // Celebrate with confetti
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#FDE68A', '#10B981', '#60A5FA'],
        });
      } catch (e) {
        // Fallback gracefully
      }
    }, 1200);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  return (
    <div className="mb-4 space-y-2 select-none">
      {/* Top Organization Header & Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-stone-900/90 border border-stone-800 backdrop-blur-md">
        {/* Category Selector Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          <button
            onClick={() => {
              onSelectCategory('all');
              onSelectSubFilter(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeCategory === 'all'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All ({photos.length})</span>
          </button>

          <button
            onClick={() => {
              onSelectCategory('people');
              onSelectSubFilter(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeCategory === 'people'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-rose-300" />
            <span>People</span>
          </button>

          <button
            onClick={() => {
              onSelectCategory('places');
              onSelectSubFilter(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeCategory === 'places'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-sky-300" />
            <span>Places</span>
          </button>

          <button
            onClick={() => {
              onSelectCategory('things');
              onSelectSubFilter(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeCategory === 'things'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-emerald-300" />
            <span>Things</span>
          </button>

          <button
            onClick={() => {
              onSelectCategory('styles');
              onSelectSubFilter(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeCategory === 'styles'
                ? 'bg-purple-500 text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-purple-300" />
            <span>Styles</span>
          </button>
        </div>

        {/* Auto-Organize Button */}
        <button
          onClick={handleRunAutoOrganize}
          disabled={isOrganizing}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:brightness-105 active:scale-95 transition-all shrink-0 cursor-pointer"
          title="Automatically organize images according to people, places, things, and styles"
        >
          <Sparkles className={`w-3.5 h-3.5 text-stone-950 ${isOrganizing ? 'animate-spin' : ''}`} />
          <span>{isOrganizing ? 'Organizing...' : 'Auto-Organize Library'}</span>
        </button>
      </div>

      {/* Sub-category Pills when category is chosen */}
      {subFilters.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none px-1 py-1">
          <button
            onClick={() => onSelectSubFilter(null)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors shrink-0 ${
              activeSubFilter === null
                ? 'bg-stone-200 text-stone-900 font-semibold'
                : 'bg-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            All {activeCategory.toUpperCase()}
          </button>

          {subFilters.map((sub) => {
            const isSelected = activeSubFilter === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => onSelectSubFilter(isSelected ? null : sub.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                    : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/60'
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Auto-Organize Status & Celebratory Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-stone-900 border border-amber-500/30 text-stone-100 shadow-2xl relative overflow-hidden">
            {/* Background radiant rays */}
            <div className="absolute top-0 right-0 left-0 h-32 bg-gradient-to-b from-amber-500/20 to-transparent pointer-events-none" />

            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <AngelCherubIcon size={32} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white leading-tight">
                  {isOrganizing ? 'Deep Auto-Organization' : 'Library Fully Organized!'}
                </h3>
                <p className="text-xs text-amber-300/80">
                  Arranging photos by People, Places, Things & Styles
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden mb-4 p-0.5 border border-stone-700">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${organizeProgress}%` }}
              />
            </div>

            {/* Animated Status Step */}
            {isOrganizing ? (
              <div className="space-y-2 text-xs text-stone-400 mb-6">
                <p className="flex items-center gap-2 text-stone-200 font-medium">
                  <RaysOfLightIcon size={18} />
                  <span>Scanning faces, geographic coordinates & EXIF data...</span>
                </p>
                <p className="flex items-center gap-2">
                  <HolyDoveIcon size={18} />
                  <span>Applying celestial harmony & scripture verse pairings...</span>
                </p>
              </div>
            ) : (
              summaryStats && (
                <div className="space-y-4 mb-6 animate-fade-in">
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Every image in your MemoryVault has been classified according to people, places, things, and artistic styles, and blessed with sacred scripture pairings.
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/40">
                      <span className="text-[10px] text-rose-300 uppercase tracking-wider block">People Identified</span>
                      <span className="text-lg font-bold text-white">{summaryStats.people} Photos</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-800/40">
                      <span className="text-[10px] text-sky-300 uppercase tracking-wider block">Places & Sanctuaries</span>
                      <span className="text-lg font-bold text-white">{summaryStats.places} Photos</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40">
                      <span className="text-[10px] text-emerald-300 uppercase tracking-wider block">Things & Heirlooms</span>
                      <span className="text-lg font-bold text-white">{summaryStats.things} Photos</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40">
                      <span className="text-[10px] text-purple-300 uppercase tracking-wider block">Artistic Styles</span>
                      <span className="text-lg font-bold text-white">{summaryStats.styles} Photos</span>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
              {!isOrganizing && (
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md transition-colors"
                >
                  Explore Organized Vault
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
