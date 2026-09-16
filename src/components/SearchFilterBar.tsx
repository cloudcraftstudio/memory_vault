import React from 'react';
import { Search, X, Tag, User, Calendar, Camera, Heart, CheckCircle2 } from 'lucide-react';
import { PersonCluster } from '../types';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  selectedPerson: string | null;
  onSelectPerson: (person: string | null) => void;
  selectedYear: string | null;
  onSelectYear: (year: string | null) => void;
  favoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  allTags: string[];
  people: PersonCluster[];
  years: string[];
  totalResults: number;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedTag,
  onSelectTag,
  selectedPerson,
  onSelectPerson,
  selectedYear,
  onSelectYear,
  favoritesOnly,
  onToggleFavoritesOnly,
  allTags,
  people,
  years,
  totalResults,
}) => {
  const hasActiveFilters = searchQuery || selectedTag || selectedPerson || selectedYear || favoritesOnly;

  const clearAll = () => {
    onSearchChange('');
    onSelectTag(null);
    onSelectPerson(null);
    onSelectYear(null);
    if (favoritesOnly) onToggleFavoritesOnly();
  };

  return (
    <div className="bg-stone-900 border-b border-stone-800 p-3 space-y-2.5 animate-fade-in">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search memories, locations, EXIF camera, or tags..."
          className="w-full pl-9.5 pr-8 py-2 bg-stone-800 text-stone-100 placeholder-stone-400 text-xs rounded-xl border border-stone-700/80 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Row: Tags, People, Years, Favorites */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
        {/* Favorites button */}
        <button
          onClick={onToggleFavoritesOnly}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full shrink-0 transition-colors ${
            favoritesOnly
              ? 'bg-rose-500 text-white font-medium shadow-xs'
              : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
          }`}
        >
          <Heart className={`w-3 h-3 ${favoritesOnly ? 'fill-current' : ''}`} />
          <span>Favorites</span>
        </button>

        {/* Year Dropdown or pills */}
        {years.map((yr) => (
          <button
            key={yr}
            onClick={() => onSelectYear(selectedYear === yr ? null : yr)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full shrink-0 transition-colors ${
              selectedYear === yr
                ? 'bg-amber-500 text-stone-950 font-semibold'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>{yr}</span>
          </button>
        ))}

        {/* People filters */}
        {people.slice(0, 4).map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectPerson(selectedPerson === p.name ? null : p.name)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full shrink-0 transition-colors ${
              selectedPerson === p.name
                ? 'bg-sky-500 text-white font-medium'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <User className="w-3 h-3" />
            <span>{p.name.split(' ')[0]}</span>
          </button>
        ))}

        {/* Tag filters */}
        {allTags.slice(0, 6).map((t) => (
          <button
            key={t}
            onClick={() => onSelectTag(selectedTag === t ? null : t)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full shrink-0 transition-colors ${
              selectedTag === t
                ? 'bg-amber-400 text-stone-950 font-semibold'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <Tag className="w-2.5 h-2.5" />
            <span>#{t}</span>
          </button>
        ))}

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 shrink-0 text-[10px]"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
          <span>Found {totalResults} matching memory items</span>
        </div>
      )}
    </div>
  );
};
