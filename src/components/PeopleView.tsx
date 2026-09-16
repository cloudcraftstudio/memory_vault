import React, { useState } from 'react';
import { Users, Sparkles, ScanFace, Check, ArrowLeft, Heart, Image as ImageIcon, Plus, Edit2, Layers } from 'lucide-react';
import { PersonCluster, Photo, Album } from '../types';

interface PeopleViewProps {
  people: PersonCluster[];
  photos: Photo[];
  onSelectPhoto: (photo: Photo) => void;
  onRenamePerson: (personId: string, newName: string, newRelation: string) => void;
  onCreateAlbumForPerson: (personName: string, photoIds: string[]) => void;
}

export const PeopleView: React.FC<PeopleViewProps> = ({
  people,
  photos,
  onSelectPhoto,
  onRenamePerson,
  onCreateAlbumForPerson,
}) => {
  const [selectedPerson, setSelectedPerson] = useState<PersonCluster | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editRelation, setEditRelation] = useState('');

  // Start automated face recognition scan simulation
  const handleTriggerScan = () => {
    setIsScanning(true);
    setScanProgress(15);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsScanning(false), 500);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleOpenRename = (p: PersonCluster) => {
    setEditName(p.name);
    setEditRelation(p.relation);
    setShowRenameModal(true);
  };

  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPerson && editName.trim()) {
      onRenamePerson(selectedPerson.id, editName.trim(), editRelation.trim() || 'Family');
      setSelectedPerson({
        ...selectedPerson,
        name: editName.trim(),
        relation: editRelation.trim() || 'Family',
      });
      setShowRenameModal(false);
    }
  };

  // Photos tagged with the currently selected person
  const personPhotos = selectedPerson
    ? photos.filter((ph) => ph.faces.some((f) => f.name.toLowerCase() === selectedPerson.name.toLowerCase()))
    : [];

  return (
    <div className="space-y-4 pb-20 animate-fade-in text-stone-100">
      {/* If a person is selected, show their specific gallery */}
      {selectedPerson ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedPerson(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white text-xs font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All People & Pets</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenRename(selectedPerson)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 text-xs transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Info</span>
              </button>

              <button
                onClick={() => onCreateAlbumForPerson(selectedPerson.name, personPhotos.map((p) => p.id))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs transition-all"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Create Album</span>
              </button>
            </div>
          </div>

          {/* Profile Card Header */}
          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center gap-4">
            <div className="relative">
              <img
                src={selectedPerson.avatarUrl}
                alt={selectedPerson.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-400/50 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-stone-950 text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold text-white tracking-tight">
                  {selectedPerson.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-stone-800 text-amber-300 text-[10px] font-semibold border border-stone-700">
                  {selectedPerson.relation}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Recognized in {personPhotos.length} photos across your Google Photos library
              </p>
            </div>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {personPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => onSelectPhoto(photo)}
                className="group relative aspect-square rounded-xl overflow-hidden bg-stone-900 cursor-pointer border border-stone-800 hover:border-amber-400 transition-all shadow-xs"
              >
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                  <p className="text-[10px] text-white font-medium truncate">{photo.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Main People Clusters Overview
        <div className="space-y-4">
          {/* Top Banner */}
          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <h2 className="font-serif text-lg font-bold text-white tracking-tight">
                  Automated Face Recognition
                </h2>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                AI automatically groups recurring family, friends, and pets from your Google Photos.
              </p>
            </div>

            <button
              onClick={handleTriggerScan}
              disabled={isScanning}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold transition-all shrink-0 cursor-pointer disabled:opacity-60"
            >
              <ScanFace className={`w-4 h-4 text-amber-400 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? `Scanning Library (${scanProgress}%)` : 'Scan for New Faces'}</span>
            </button>
          </div>

          {/* Scanning Progress Bar */}
          {isScanning && (
            <div className="p-3 bg-stone-900/90 rounded-xl border border-amber-400/30 space-y-1.5 animate-pulse">
              <div className="flex justify-between text-[11px] text-amber-300 font-medium">
                <span>Analyzing facial landmarks in background...</span>
                <span>{scanProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* People Circles Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {people.map((person) => {
              const count = photos.filter((ph) =>
                ph.faces.some((f) => f.name.toLowerCase() === person.name.toLowerCase())
              ).length || person.photoCount;

              return (
                <div
                  key={person.id}
                  onClick={() => setSelectedPerson(person)}
                  className="group bg-stone-900 border border-stone-800 hover:border-amber-400/60 p-3.5 rounded-2xl cursor-pointer transition-all active:scale-[0.98] shadow-md flex flex-col items-center text-center space-y-2.5"
                >
                  <div className="relative">
                    <img
                      src={person.avatarUrl}
                      alt={person.name}
                      className="w-20 h-20 rounded-full object-cover ring-2 ring-stone-700 group-hover:ring-amber-400 transition-all shadow-md"
                    />
                    <span className="absolute bottom-0 right-0 px-1.5 py-0.2 rounded-full bg-stone-950 text-amber-300 text-[10px] font-bold border border-stone-800">
                      {count}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {person.name}
                    </h3>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {person.relation} • {count} photos
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rename/Edit Person Modal */}
      {showRenameModal && selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm p-5 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl text-stone-100">
            <h3 className="font-serif text-base font-bold text-white mb-1">
              Edit Person Details
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Update name or relationship for automated face recognition
            </p>

            <form onSubmit={handleSaveRename} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">Relationship</label>
                <input
                  type="text"
                  value={editRelation}
                  onChange={(e) => setEditRelation(e.target.value)}
                  placeholder="e.g., Family, Friend, Partner, Pet"
                  className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRenameModal(false)}
                  className="px-4 py-2 text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
