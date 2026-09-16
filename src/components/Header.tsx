import React from 'react';
import { Sparkles, Search, RefreshCw, Smartphone, Monitor, ShieldCheck, User as UserIcon, LogOut } from 'lucide-react';
import { SyncStatus } from '../types';
import { User } from 'firebase/auth';
import { AngelCherubIcon } from './CelestialMotifs';

interface HeaderProps {
  user: User | null;
  syncStatus: SyncStatus;
  onTriggerSync: () => void;
  onOpenSignIn: () => void;
  onSignOut: () => void;
  isSearchOpen: boolean;
  onToggleSearch: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  syncStatus,
  onTriggerSync,
  onOpenSignIn,
  onSignOut,
  isSearchOpen,
  onToggleSearch,
  isMobileFrame,
  onToggleMobileFrame,
}) => {
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 bg-stone-900/95 text-stone-100 border-b border-stone-800 backdrop-blur-md">
      {/* Main App Bar */}
      <div className="px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 flex items-center justify-center text-stone-950 shadow-md shadow-amber-500/20 shrink-0">
            <AngelCherubIcon size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-serif text-base sm:text-lg font-bold tracking-tight text-white leading-none truncate">
                MemoryVault
              </h1>
              <span className="px-1.5 py-0.2 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 rounded border border-amber-400/30 shrink-0">
                PRO
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-stone-400 flex items-center gap-1 mt-0.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 inline-block animate-pulse"></span>
              <span className="truncate">Google Photos Synced</span>
            </p>
          </div>
        </div>

        {/* Action Controls - Always fully visible, never pushed offscreen */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Sync Trigger button */}
          <button
            onClick={onTriggerSync}
            disabled={syncStatus.isSyncing}
            className={`p-1.5 sm:p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors shrink-0 ${
              syncStatus.isSyncing ? 'text-amber-400 animate-spin' : ''
            }`}
            title={syncStatus.isSyncing ? 'Syncing with Google Photos...' : 'Sync Library with Google Photos'}
            aria-label="Sync with Google Photos"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Search Toggle */}
          <button
            onClick={onToggleSearch}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors shrink-0 ${
              isSearchOpen ? 'bg-stone-800 text-amber-300' : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
            title="Search photos, tags, metadata, or faces"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* View Mode Toggle (Mobile Frame vs Full Screen) */}
          <button
            onClick={onToggleMobileFrame}
            className="p-1.5 sm:p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors hidden sm:flex shrink-0"
            title={isMobileFrame ? 'Switch to wide responsive view' : 'Switch to mobile frame'}
            aria-label="Toggle mobile frame"
          >
            {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* User Profile / Google Sign-In - NEVER hidden or clipped */}
          <div className="relative shrink-0">
            {user ? (
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-2 ring-amber-400/40 overflow-hidden focus:outline-none focus:ring-2 focus:ring-amber-400 shrink-0 block"
                aria-label="User profile menu"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-700 flex items-center justify-center text-xs font-semibold text-stone-200">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </button>
            ) : (
              <button
                id="header-connect-button"
                onClick={onOpenSignIn}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-xs transition-all active:scale-95 shrink-0"
              >
                <UserIcon className="w-3.5 h-3.5 text-stone-950" />
                <span>Connect</span>
              </button>
            )}

            {/* Profile Dropdown */}
            {showProfileMenu && user && (
              <div className="absolute right-0 mt-2 w-56 p-2 bg-stone-900 border border-stone-800 rounded-xl shadow-xl z-50 animate-fade-in text-xs">
                <div className="px-3 py-2 border-b border-stone-800 mb-1">
                  <p className="font-semibold text-stone-200 truncate">{user.displayName || 'Google User'}</p>
                  <p className="text-stone-400 truncate text-[11px]">{user.email}</p>
                </div>
                <div className="px-3 py-1.5 text-emerald-400 flex items-center gap-2 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Google Photos Connected
                </div>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onSignOut();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-stone-800 flex items-center gap-2 transition-colors mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
