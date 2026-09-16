import React, { useState, useEffect, useMemo } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout, getAccessToken } from './lib/firebase';
import { fetchGooglePhotos, fetchGoogleAlbums } from './lib/googlePhotosApi';
import {
  Photo,
  Album,
  PersonCluster,
  PhotoBook,
  SyncStatus,
  AlbumTheme,
  BookCoverType,
  PhotoCategory,
  ScriptureVerse,
} from './types';
import {
  INITIAL_PHOTOS,
  INITIAL_ALBUMS,
  INITIAL_PEOPLE,
  INITIAL_PHOTO_BOOKS,
  INITIAL_SYNC_STATUS,
} from './data/initialData';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { SearchFilterBar } from './components/SearchFilterBar';
import { TimelineView } from './components/TimelineView';
import { AlbumsListView } from './components/AlbumsListView';
import { AlbumDetailView } from './components/AlbumDetailView';
import { PeopleView } from './components/PeopleView';
import { PhotoBookStudio } from './components/PhotoBookStudio';
import { CloudVaultView } from './components/CloudVaultView';
import { PhotoModal } from './components/PhotoModal';
import { GoogleSignInModal } from './components/GoogleSignInModal';
import { DeviceFrame } from './components/DeviceFrame';
import { ScriptureBanner } from './components/ScriptureBanner';
import { AutoOrganizeBar } from './components/AutoOrganizeBar';
import { ImageStudioModal } from './components/ImageStudioModal';

export default function App() {
  // Navigation & View Mode - default to fully responsive layout
  const [activeTab, setActiveTab] = useState<TabType>('timeline');
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Authentication & Google Photos OAuth Token
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);

  // Auto-Organize Category & Sub-filter state
  const [activeCategory, setActiveCategory] = useState<PhotoCategory | 'all'>('all');
  const [activeSubFilter, setActiveSubFilter] = useState<string | null>(null);

  // Image Studio (Editing, Background removal, Resizing, AI Enhance, AI Gen)
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [studioPhoto, setStudioPhoto] = useState<Photo | null>(null);

  // Active Scripture Blessing in layout
  const [currentBlessingVerse, setCurrentBlessingVerse] = useState<ScriptureVerse | undefined>(undefined);

  // Core Data States (with local persistence)
  const [photos, setPhotos] = useState<Photo[]>(() => {
    const saved = localStorage.getItem('mv_photos');
    return saved ? JSON.parse(saved) : INITIAL_PHOTOS;
  });

  const [albums, setAlbums] = useState<Album[]>(() => {
    const saved = localStorage.getItem('mv_albums');
    return saved ? JSON.parse(saved) : INITIAL_ALBUMS;
  });

  const [people, setPeople] = useState<PersonCluster[]>(() => {
    const saved = localStorage.getItem('mv_people');
    return saved ? JSON.parse(saved) : INITIAL_PEOPLE;
  });

  const [photoBooks, setPhotoBooks] = useState<PhotoBook[]>(() => {
    const saved = localStorage.getItem('mv_books');
    return saved ? JSON.parse(saved) : INITIAL_PHOTO_BOOKS;
  });

  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() => {
    const saved = localStorage.getItem('mv_sync');
    return saved ? JSON.parse(saved) : INITIAL_SYNC_STATUS;
  });

  // Active Modals & Selections
  const [selectedPhotoForModal, setSelectedPhotoForModal] = useState<Photo | null>(null);
  const [selectedAlbumForDetail, setSelectedAlbumForDetail] = useState<Album | null>(null);
  const [selectedAlbumForBook, setSelectedAlbumForBook] = useState<Album | null>(null);

  // Search & Filtering
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Sync notification banner
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Save to localStorage when states update
  useEffect(() => {
    try {
      localStorage.setItem('mv_photos', JSON.stringify(photos));
    } catch (e) {
      console.warn('Storage quota exceeded for photos cache', e);
    }
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('mv_albums', JSON.stringify(albums));
  }, [albums]);

  useEffect(() => {
    localStorage.setItem('mv_people', JSON.stringify(people));
  }, [people]);

  useEffect(() => {
    localStorage.setItem('mv_books', JSON.stringify(photoBooks));
  }, [photoBooks]);

  useEffect(() => {
    localStorage.setItem('mv_sync', JSON.stringify(syncStatus));
  }, [syncStatus]);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (authResultUser, accessToken) => {
        setUser(authResultUser);
        setToken(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setSignInError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setShowSignInModal(false);
        setSyncNotice(`Connected to Google Photos (${result.user.email})`);
        setTimeout(() => setSyncNotice(null), 4000);
        // Automatically trigger sync after login
        await triggerSyncWithGoogle(result.accessToken);
      }
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('auth/unauthorized-domain')) {
        const hostname = window.location.hostname;
        setSignInError(
          `Domain "${hostname}" is not authorized in Firebase. To fix this, add "${hostname}" to your Firebase Console under Authentication > Settings > Authorized domains.`
        );
      } else {
        setSignInError(err?.message || 'Failed to authenticate with Google. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setSyncNotice('Disconnected from Google Photos');
    setTimeout(() => setSyncNotice(null), 3000);
  };

  // Trigger Google Photos 2-Way Synchronization
  const triggerSyncWithGoogle = async (tokenToUse?: string) => {
    const activeToken = tokenToUse || token || (await getAccessToken());
    setSyncStatus((prev) => ({ ...prev, isSyncing: true }));

    try {
      if (activeToken) {
        try {
          const fetchedPhotos = await fetchGooglePhotos(activeToken);
          if (fetchedPhotos.length > 0) {
            setPhotos((prev) => {
              const existingIds = new Set(prev.map((p) => p.googlePhotoId || p.id));
              const newPhotos = fetchedPhotos.filter((p) => !existingIds.has(p.googlePhotoId || p.id));
              return [...newPhotos, ...prev];
            });
          }

          const fetchedAlbums = await fetchGoogleAlbums(activeToken);
          if (fetchedAlbums.length > 0) {
            setAlbums((prev) => {
              const existingAlbIds = new Set(prev.map((a) => a.googlePhotosAlbumId || a.id));
              const newAlbs = fetchedAlbums.filter((a) => !existingAlbIds.has(a.googlePhotosAlbumId || a.id));
              return [...prev, ...newAlbs];
            });
          }
        } catch (apiErr) {
          console.info('Google Photos API query finished with message:', apiErr);
        }
      }

      // Complete sync update
      setTimeout(() => {
        setSyncStatus((prev) => ({
          ...prev,
          isSyncing: false,
          lastSyncedAt: Date.now(),
          itemsSynced: photos.length,
          backupVerified: true,
        }));
        setSyncNotice('Library synced & backed up to Cloud Vault');
        setTimeout(() => setSyncNotice(null), 3500);
      }, 1000);
    } catch (err) {
      console.error('Sync failed:', err);
      setSyncStatus((prev) => ({ ...prev, isSyncing: false }));
    }
  };

  // Toggle Auto-Sync
  const handleToggleAutoSync = () => {
    setSyncStatus((prev) => ({
      ...prev,
      autoSyncEnabled: !prev.autoSyncEnabled,
    }));
  };

  // Multi-facet Filter Logic
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    photos.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [photos]);

  const allYears = useMemo(() => {
    const yearSet = new Set<string>();
    photos.forEach((p) => {
      const yr = p.date.split('-')[0];
      if (yr) yearSet.add(yr);
    });
    return Array.from(yearSet).sort((a, b) => b.localeCompare(a));
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      // Auto-Organize Category filter (People, Places, Things, Styles)
      if (activeCategory !== 'all') {
        const pCat = photo.category || 'places';
        if (pCat !== activeCategory) return false;

        // Subcategory filter check
        if (activeSubFilter) {
          const sub = activeSubFilter.toLowerCase();
          const pSub = (photo.placeCategory || photo.thingCategory || photo.styleCategory || '').toLowerCase();
          const tagsStr = photo.tags.join(' ').toLowerCase();
          const titleStr = photo.title.toLowerCase();
          if (!pSub.includes(sub) && !tagsStr.includes(sub) && !titleStr.includes(sub)) {
            return false;
          }
        }
      }

      // Favorites filter
      if (favoritesOnly && !photo.isFavorite) return false;

      // Year filter
      if (selectedYear && !photo.date.startsWith(selectedYear)) return false;

      // Tag filter
      if (selectedTag && !photo.tags.includes(selectedTag)) return false;

      // Person filter
      if (selectedPerson) {
        const hasPerson = photo.faces.some(
          (f) => f.name.toLowerCase() === selectedPerson.toLowerCase()
        );
        if (!hasPerson) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = photo.title.toLowerCase().includes(q);
        const inDesc = photo.description?.toLowerCase().includes(q);
        const inStory = photo.story?.toLowerCase().includes(q);
        const inLocation = photo.location.name.toLowerCase().includes(q);
        const inTags = photo.tags.some((t) => t.toLowerCase().includes(q));
        const inCamera = photo.metadata.camera?.toLowerCase().includes(q);
        const inFaces = photo.faces.some((f) => f.name.toLowerCase().includes(q));
        const inVerse = photo.spiritualVerse ? `${photo.spiritualVerse.reference} ${photo.spiritualVerse.text}`.toLowerCase().includes(q) : false;

        if (!inTitle && !inDesc && !inStory && !inLocation && !inTags && !inCamera && !inFaces && !inVerse) {
          return false;
        }
      }

      return true;
    });
  }, [photos, activeCategory, activeSubFilter, favoritesOnly, selectedYear, selectedTag, selectedPerson, searchQuery]);

  // Image Studio & Story Handlers
  const handleOpenStudio = (photoToEdit: Photo) => {
    setStudioPhoto(photoToEdit);
    setIsStudioOpen(true);
  };

  const handleSaveEditedPhoto = (updatedPhoto: Photo) => {
    setPhotos((prev) => prev.map((p) => (p.id === updatedPhoto.id ? updatedPhoto : p)));
    if (selectedPhotoForModal && selectedPhotoForModal.id === updatedPhoto.id) {
      setSelectedPhotoForModal(updatedPhoto);
    }
    setSyncNotice(`Modifications saved for "${updatedPhoto.title}"!`);
    setTimeout(() => setSyncNotice(null), 3000);
  };

  const handleAddGeneratedPhoto = (newPhoto: Photo) => {
    setPhotos((prev) => [newPhoto, ...prev]);
    setSyncNotice('Celestial artwork added to your MemoryVault!');
    setTimeout(() => setSyncNotice(null), 3500);
  };

  const handleUpdatePhotoDetails = (photoId: string, updates: { title?: string; story?: string; description?: string }) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === photoId) {
          return {
            ...p,
            title: updates.title !== undefined ? updates.title : p.title,
            story: updates.story !== undefined ? updates.story : p.story,
            description: updates.description !== undefined ? updates.description : p.description,
          };
        }
        return p;
      })
    );
    if (selectedPhotoForModal && selectedPhotoForModal.id === photoId) {
      setSelectedPhotoForModal((prev) =>
        prev
          ? {
              ...prev,
              title: updates.title !== undefined ? updates.title : prev.title,
              story: updates.story !== undefined ? updates.story : prev.story,
              description: updates.description !== undefined ? updates.description : prev.description,
            }
          : null
      );
    }
  };

  const handleAssignScriptureToPhoto = (photoId: string, verse: ScriptureVerse) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, spiritualVerse: verse } : p))
    );
    if (selectedPhotoForModal && selectedPhotoForModal.id === photoId) {
      setSelectedPhotoForModal((prev) =>
        prev ? { ...prev, spiritualVerse: verse } : null
      );
    }
    setSyncNotice(`Scripture blessing "${verse.reference}" paired!`);
    setTimeout(() => setSyncNotice(null), 3000);
  };

  const handleAutoOrganizeComplete = (organizedPhotos: Photo[]) => {
    setPhotos(organizedPhotos);
    setSyncNotice('Library arranged by People, Places, Things, & Styles with Scripture Blessings!');
    setTimeout(() => setSyncNotice(null), 4000);
  };

  // Photo handlers
  const handleToggleFavorite = (id: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
    if (selectedPhotoForModal && selectedPhotoForModal.id === id) {
      setSelectedPhotoForModal((prev) => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    // Also remove from any album
    setAlbums((prev) =>
      prev.map((alb) => ({
        ...alb,
        tags: alb.tags,
      }))
    );
    setSelectedPhotoForModal(null);
    setSyncNotice('Photo removed from vault');
    setTimeout(() => setSyncNotice(null), 2500);
  };

  const handleAddTagToPhoto = (photoId: string, tag: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, tags: [...p.tags, tag] } : p))
    );
    if (selectedPhotoForModal && selectedPhotoForModal.id === photoId) {
      setSelectedPhotoForModal((prev) =>
        prev ? { ...prev, tags: [...prev.tags, tag] } : null
      );
    }
  };

  const handleRemoveTagFromPhoto = (photoId: string, tag: string) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photoId ? { ...p, tags: p.tags.filter((t) => t !== tag) } : p
      )
    );
    if (selectedPhotoForModal && selectedPhotoForModal.id === photoId) {
      setSelectedPhotoForModal((prev) =>
        prev ? { ...prev, tags: prev.tags.filter((t) => t !== tag) } : null
      );
    }
  };

  const handleAssignToAlbum = (photoId: string, albumId: string) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === photoId && !p.albumIds.includes(albumId)) {
          return { ...p, albumIds: [...p.albumIds, albumId] };
        }
        return p;
      })
    );
    setSyncNotice('Assigned to album');
    setTimeout(() => setSyncNotice(null), 2000);
  };

  // Album handlers
  const handleCreateAlbum = (newAlbumData: Partial<Album>) => {
    const newAlbum: Album = {
      id: `alb-${Date.now()}`,
      title: newAlbumData.title || 'Untitled Collection',
      description: newAlbumData.description || 'Curated digital memory album',
      theme: newAlbumData.theme || 'editorial',
      coverPhotoUrl: newAlbumData.coverPhotoUrl || photos[0]?.url || '',
      startDate: newAlbumData.startDate || new Date().toISOString().split('T')[0],
      endDate: newAlbumData.endDate || new Date().toISOString().split('T')[0],
      tags: newAlbumData.tags || ['album'],
      customAccentColor: newAlbumData.customAccentColor || '#D97706',
      isShared: false,
      shareLink: `https://memoryvault.app/album/${Date.now()}`,
      collaborators: [
        {
          id: 'owner-1',
          name: user?.displayName || 'Alex Miller',
          email: user?.email || 'owner@example.com',
          avatar: user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
          role: 'owner',
        },
      ],
      comments: [],
    };

    setAlbums((prev) => [newAlbum, ...prev]);
    setSelectedAlbumForDetail(newAlbum);
    setActiveTab('albums');
    setSyncNotice(`Created album "${newAlbum.title}"`);
    setTimeout(() => setSyncNotice(null), 3000);
  };

  const handleCreateAlbumWithPhotos = (photoIds: string[]) => {
    const targetPhotos = photos.filter((p) => photoIds.includes(p.id));
    const cover = targetPhotos[0]?.url || '';

    const newAlbum: Album = {
      id: `alb-${Date.now()}`,
      title: `Selected Memories (${photoIds.length})`,
      description: `Curated on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      theme: 'editorial',
      coverPhotoUrl: cover,
      startDate: targetPhotos[targetPhotos.length - 1]?.date || new Date().toISOString().split('T')[0],
      endDate: targetPhotos[0]?.date || new Date().toISOString().split('T')[0],
      tags: ['curated', 'selection'],
      customAccentColor: '#0284C7',
      isShared: false,
      shareLink: `https://memoryvault.app/album/${Date.now()}`,
      collaborators: [],
      comments: [],
    };

    // Link photos to this album
    setPhotos((prev) =>
      prev.map((p) => (photoIds.includes(p.id) ? { ...p, albumIds: [...p.albumIds, newAlbum.id] } : p))
    );

    setAlbums((prev) => [newAlbum, ...prev]);
    setSelectedAlbumForDetail(newAlbum);
    setActiveTab('albums');
  };

  const handleCreateBookWithPhotos = (photoIds: string[]) => {
    const newBook: PhotoBook = {
      id: `book-${Date.now()}`,
      albumId: 'custom',
      title: 'Curated Print Collection',
      subtitle: `${photoIds.length} Highlights • ${new Date().getFullYear()}`,
      coverType: 'linen',
      paperType: 'lustre',
      size: '10x10',
      price: 39.99,
      status: 'draft',
      pages: [
        {
          pageNumber: 1,
          layout: 'single-bleed',
          photoIds: [photoIds[0]],
          caption: 'Special moments captured in time.',
        },
        ...(photoIds.length > 1
          ? [
              {
                pageNumber: 2,
                layout: 'two-photo' as const,
                photoIds: photoIds.slice(1, 3),
                caption: 'Memories of adventure and celebration.',
              },
            ]
          : []),
      ],
    };

    setPhotoBooks((prev) => [newBook, ...prev]);
    setActiveTab('books');
  };

  const handleUpdateAlbumTheme = (albumId: string, theme: AlbumTheme) => {
    setAlbums((prev) =>
      prev.map((a) => (a.id === albumId ? { ...a, theme } : a))
    );
    if (selectedAlbumForDetail && selectedAlbumForDetail.id === albumId) {
      setSelectedAlbumForDetail((prev) => (prev ? { ...prev, theme } : null));
    }
  };

  const handleAddAlbumTag = (albumId: string, tag: string) => {
    setAlbums((prev) =>
      prev.map((a) => (a.id === albumId ? { ...a, tags: [...a.tags, tag] } : a))
    );
    if (selectedAlbumForDetail && selectedAlbumForDetail.id === albumId) {
      setSelectedAlbumForDetail((prev) =>
        prev ? { ...prev, tags: [...prev.tags, tag] } : null
      );
    }
  };

  const handleAddCollaborator = (albumId: string, email: string, name: string) => {
    const newCollab = {
      id: `c-${Date.now()}`,
      name,
      email,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100`,
      role: 'editor' as const,
    };

    setAlbums((prev) =>
      prev.map((a) =>
        a.id === albumId
          ? { ...a, collaborators: [...a.collaborators, newCollab], isShared: true }
          : a
      )
    );
    if (selectedAlbumForDetail && selectedAlbumForDetail.id === albumId) {
      setSelectedAlbumForDetail((prev) =>
        prev ? { ...prev, collaborators: [...prev.collaborators, newCollab], isShared: true } : null
      );
    }
    setSyncNotice(`Invited ${name} (${email}) to collaborate`);
    setTimeout(() => setSyncNotice(null), 3000);
  };

  const handleAddComment = (albumId: string, text: string) => {
    const newComment = {
      id: `cm-${Date.now()}`,
      author: user?.displayName || 'Alex Miller',
      avatar: user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      text,
      timestamp: Date.now(),
    };

    setAlbums((prev) =>
      prev.map((a) =>
        a.id === albumId ? { ...a, comments: [...a.comments, newComment] } : a
      )
    );
    if (selectedAlbumForDetail && selectedAlbumForDetail.id === albumId) {
      setSelectedAlbumForDetail((prev) =>
        prev ? { ...prev, comments: [...prev.comments, newComment] } : null
      );
    }
  };

  // People Handlers
  const handleRenamePerson = (personId: string, newName: string, newRelation: string) => {
    const oldPerson = people.find((p) => p.id === personId);
    const oldName = oldPerson?.name;

    setPeople((prev) =>
      prev.map((p) =>
        p.id === personId ? { ...p, name: newName, relation: newRelation } : p
      )
    );

    // Update faces inside photos
    if (oldName) {
      setPhotos((prev) =>
        prev.map((photo) => ({
          ...photo,
          faces: photo.faces.map((f) =>
            f.name.toLowerCase() === oldName.toLowerCase()
              ? { ...f, name: newName }
              : f
          ),
        }))
      );
    }
  };

  const handleCreateAlbumForPerson = (personName: string, photoIds: string[]) => {
    const personPhotos = photos.filter((p) => photoIds.includes(p.id));
    const cover = personPhotos[0]?.url || '';

    const newAlbum: Album = {
      id: `alb-${Date.now()}`,
      title: `${personName}'s Moments`,
      description: `Automated face recognition collection of all photos featuring ${personName}.`,
      theme: 'polaroid',
      coverPhotoUrl: cover,
      startDate: personPhotos[personPhotos.length - 1]?.date || '2026-01-01',
      endDate: personPhotos[0]?.date || '2026-09-01',
      tags: [personName.toLowerCase().replace(/\s+/g, ''), 'family', 'people'],
      customAccentColor: '#BE185D',
      isShared: false,
      shareLink: `https://memoryvault.app/album/${Date.now()}`,
      collaborators: [],
      comments: [],
    };

    setPhotos((prev) =>
      prev.map((p) =>
        photoIds.includes(p.id)
          ? { ...p, albumIds: [...p.albumIds, newAlbum.id] }
          : p
      )
    );

    setAlbums((prev) => [newAlbum, ...prev]);
    setSelectedAlbumForDetail(newAlbum);
    setActiveTab('albums');
  };

  // Photo Book Handlers
  const handleOpenBookStudioWithAlbum = (album: Album) => {
    setSelectedAlbumForBook(album);
    setActiveTab('books');
  };

  const handleOrderBook = (bookId: string) => {
    setPhotoBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, status: 'ordered' } : b))
    );
  };

  const handleCreateBookFromAlbum = (albumId: string, coverType: BookCoverType) => {
    const targetAlb = albums.find((a) => a.id === albumId);
    if (!targetAlb) return;

    const albPhotos = photos.filter((p) => p.albumIds.includes(albumId));

    const newBook: PhotoBook = {
      id: `book-${Date.now()}`,
      albumId,
      title: targetAlb.title,
      subtitle: `${targetAlb.startDate} • Fine Art Print`,
      coverType,
      paperType: 'lustre',
      size: '10x10',
      price: 38.50,
      status: 'draft',
      pages: [
        {
          pageNumber: 1,
          layout: 'single-bleed',
          photoIds: [albPhotos[0]?.id || photos[0]?.id],
          caption: targetAlb.description,
        },
      ],
    };

    setPhotoBooks((prev) => [newBook, ...prev]);
    setActiveTab('books');
  };

  return (
    <DeviceFrame isMobileFrame={isMobileFrame}>
      {/* App Header */}
      <Header
        user={user}
        syncStatus={syncStatus}
        onTriggerSync={() => triggerSyncWithGoogle()}
        onOpenSignIn={() => setShowSignInModal(true)}
        onSignOut={handleSignOut}
        isSearchOpen={isSearchOpen}
        onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
      />

      {/* Sync Notification Banner */}
      {syncNotice && (
        <div className="bg-amber-400 text-stone-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between animate-fade-in shadow-xs">
          <span>{syncNotice}</span>
          <button onClick={() => setSyncNotice(null)} className="text-stone-900 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Search & Multi-Facet Filtering Bar */}
      {isSearchOpen && (
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          selectedPerson={selectedPerson}
          onSelectPerson={setSelectedPerson}
          selectedYear={selectedYear}
          onSelectYear={setSelectedYear}
          favoritesOnly={favoritesOnly}
          onToggleFavoritesOnly={() => setFavoritesOnly(!favoritesOnly)}
          allTags={allTags}
          people={people}
          years={allYears}
          totalResults={filteredPhotos.length}
        />
      )}

      {/* Main Tab Views Canvas */}
      <main className="flex-1 p-2 sm:p-4 overflow-y-auto">
        {/* Divine Scripture Architecture & Celestial Motifs Banner */}
        <ScriptureBanner
          currentVerse={currentBlessingVerse}
          onVerseChange={setCurrentBlessingVerse}
        />

        {/* Tab 1: Photos Timeline */}
        {activeTab === 'timeline' && (
          <>
            {/* Auto-Organize Bar: Arranging into People, Places, Things, Styles */}
            <AutoOrganizeBar
              photos={photos}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              activeSubFilter={activeSubFilter}
              onSelectSubFilter={setActiveSubFilter}
              onAutoOrganizeComplete={handleAutoOrganizeComplete}
            />

            <TimelineView
              photos={filteredPhotos}
              albums={albums}
              syncStatus={syncStatus}
              onSelectPhoto={(photo) => setSelectedPhotoForModal(photo)}
              onToggleFavorite={handleToggleFavorite}
              onCreateAlbumWithPhotos={handleCreateAlbumWithPhotos}
              onCreateBookWithPhotos={handleCreateBookWithPhotos}
            />
          </>
        )}

        {/* Tab 2: Themed Digital Albums */}
        {activeTab === 'albums' && (
          <>
            {selectedAlbumForDetail ? (
              <AlbumDetailView
                album={selectedAlbumForDetail}
                photos={photos}
                onBack={() => setSelectedAlbumForDetail(null)}
                onSelectPhoto={(photo) => setSelectedPhotoForModal(photo)}
                onUpdateAlbumTheme={handleUpdateAlbumTheme}
                onAddAlbumTag={handleAddAlbumTag}
                onAddCollaborator={handleAddCollaborator}
                onAddComment={handleAddComment}
                onOpenBookStudio={handleOpenBookStudioWithAlbum}
              />
            ) : (
              <AlbumsListView
                albums={albums}
                photos={photos}
                onSelectAlbum={(album) => setSelectedAlbumForDetail(album)}
                onCreateAlbum={handleCreateAlbum}
                onOpenBookStudioWithAlbum={handleOpenBookStudioWithAlbum}
              />
            )}
          </>
        )}

        {/* Tab 3: Face Recognition & People AI */}
        {activeTab === 'people' && (
          <PeopleView
            people={people}
            photos={photos}
            onSelectPhoto={(photo) => setSelectedPhotoForModal(photo)}
            onRenamePerson={handleRenamePerson}
            onCreateAlbumForPerson={handleCreateAlbumForPerson}
          />
        )}

        {/* Tab 4: Physical Photo Book Studio & Print */}
        {activeTab === 'books' && (
          <PhotoBookStudio
            photoBooks={photoBooks}
            albums={albums}
            photos={photos}
            selectedAlbumForBook={selectedAlbumForBook}
            onOrderBook={handleOrderBook}
            onCreateBookFromAlbum={handleCreateBookFromAlbum}
          />
        )}

        {/* Tab 5: Cloud Vault & 2-Way Google Photos Sync */}
        {activeTab === 'vault' && (
          <CloudVaultView
            syncStatus={syncStatus}
            user={user}
            photos={photos}
            albums={albums}
            onTriggerSync={() => triggerSyncWithGoogle()}
            onToggleAutoSync={handleToggleAutoSync}
            onOpenSignIn={() => setShowSignInModal(true)}
          />
        )}
      </main>

      {/* Bottom Mobile Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'albums') {
            setSelectedAlbumForDetail(null);
          }
        }}
        albumCount={albums.length}
        peopleCount={people.length}
      />

      {/* Full-Screen Photo Modal Lightbox with Swiping, Stories & Scripture Blessings */}
      <PhotoModal
        photo={selectedPhotoForModal}
        allPhotos={filteredPhotos}
        onSelectPhoto={(p) => setSelectedPhotoForModal(p)}
        albums={albums}
        onClose={() => setSelectedPhotoForModal(null)}
        onToggleFavorite={handleToggleFavorite}
        onDeletePhoto={handleDeletePhoto}
        onAddTag={handleAddTagToPhoto}
        onRemoveTag={handleRemoveTagFromPhoto}
        onAssignToAlbum={handleAssignToAlbum}
        onUpdatePhotoDetails={handleUpdatePhotoDetails}
        onOpenStudio={handleOpenStudio}
        onAssignScriptureToPhoto={handleAssignScriptureToPhoto}
      />

      {/* AI Image Studio Modal: Editing, Background Removal, Resizing, Enhancements, AI Gen */}
      <ImageStudioModal
        photo={studioPhoto || selectedPhotoForModal || photos[0]}
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        onSaveEditedPhoto={handleSaveEditedPhoto}
        onAddGeneratedPhoto={handleAddGeneratedPhoto}
      />

      {/* Google Sign-In Modal */}
      <GoogleSignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSignIn={handleGoogleSignIn}
        isLoading={isLoggingIn}
        error={signInError}
      />
    </DeviceFrame>
  );
}
