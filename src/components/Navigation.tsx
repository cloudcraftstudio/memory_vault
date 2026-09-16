import React from 'react';
import { Image, Layers, Users, BookOpen, CloudCheck } from 'lucide-react';

export type TabType = 'timeline' | 'albums' | 'people' | 'books' | 'vault';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  albumCount: number;
  peopleCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  albumCount,
  peopleCount,
}) => {
  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'timeline', label: 'Photos', icon: Image },
    { id: 'albums', label: 'Albums', icon: Layers, badge: albumCount },
    { id: 'people', label: 'People AI', icon: Users, badge: peopleCount },
    { id: 'books', label: 'Photo Books', icon: BookOpen },
    { id: 'vault', label: 'Cloud Vault', icon: CloudCheck },
  ];

  return (
    <nav className="sticky bottom-0 z-30 bg-stone-900/95 backdrop-blur-lg border-t border-stone-800/80 px-2 py-1 select-none">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? 'text-amber-400 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-amber-400' : 'text-stone-400'}`} />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 px-1 py-0.2 min-w-4 text-[9px] font-bold bg-amber-500 text-stone-950 rounded-full text-center leading-tight">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
      {/* Mobile home indicator line */}
      <div className="w-32 h-1 bg-stone-700/60 rounded-full mx-auto mt-1 mb-0.5"></div>
    </nav>
  );
};
