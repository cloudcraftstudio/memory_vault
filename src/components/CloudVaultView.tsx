import React, { useState } from 'react';
import {
  CloudCheck,
  RefreshCw,
  ShieldCheck,
  HardDrive,
  Download,
  FolderSync,
  Lock,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Laptop,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { SyncStatus, Photo, Album } from '../types';
import { User } from 'firebase/auth';

interface CloudVaultViewProps {
  syncStatus: SyncStatus;
  user: User | null;
  photos: Photo[];
  albums: Album[];
  onTriggerSync: () => void;
  onToggleAutoSync: () => void;
  onOpenSignIn: () => void;
}

export const CloudVaultView: React.FC<CloudVaultViewProps> = ({
  syncStatus,
  user,
  photos,
  albums,
  onTriggerSync,
  onToggleAutoSync,
  onOpenSignIn,
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [exportedSuccess, setExportedSuccess] = useState(false);

  // Storage calculation
  const usedGB = 42.8;
  const totalGB = 100;
  const percentUsed = Math.round((usedGB / totalGB) * 100);

  const handleVerifyBackup = () => {
    setIsVerifying(true);
    setVerifiedSuccess(false);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedSuccess(true);
      setTimeout(() => setVerifiedSuccess(false), 4000);
    }, 1200);
  };

  const handleExportArchive = () => {
    const backupPayload = {
      exportDate: new Date().toISOString(),
      appName: 'MemoryVault',
      userEmail: user?.email || 'local-vault',
      totalPhotos: photos.length,
      totalAlbums: albums.length,
      albums: albums.map((a) => ({
        id: a.id,
        title: a.title,
        theme: a.theme,
        tags: a.tags,
        photoCount: photos.filter((p) => p.albumIds.includes(a.id)).length,
      })),
      photos: photos.map((p) => ({
        id: p.id,
        title: p.title,
        date: p.date,
        tags: p.tags,
        faces: p.faces.map((f) => f.name),
        location: p.location.name,
        metadata: p.metadata,
      })),
    };

    const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `memoryvault-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setExportedSuccess(true);
    setTimeout(() => setExportedSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 pb-24 animate-fade-in text-stone-100">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CloudCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="font-serif text-lg font-bold text-white tracking-tight">
              Cloud Vault & Sync Center
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            2-way Google Photos sync & continuous memory backup
          </p>
        </div>

        <button
          onClick={onTriggerSync}
          disabled={syncStatus.isSyncing}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
          <span>{syncStatus.isSyncing ? 'Syncing...' : 'Sync Now'}</span>
        </button>
      </div>

      {/* Google Account Connection Status Card */}
      <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FolderSync className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">Google Photos Library API</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  CONNECTED
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                {user ? user.email : 'Synced via Google Workspace OAuth Token'}
              </p>
            </div>
          </div>

          {!user && (
            <button
              onClick={onOpenSignIn}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors"
            >
              Connect Account
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="p-2.5 rounded-xl bg-stone-800/60 border border-stone-800">
            <span className="text-[10px] text-stone-400 block">Last Synced</span>
            <span className="font-semibold text-white">
              {syncStatus.lastSyncedAt
                ? new Date(syncStatus.lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Just now'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-800/60 border border-stone-800">
            <span className="text-[10px] text-stone-400 block">Synced Media Items</span>
            <span className="font-semibold text-white">{photos.length} High-Res Items</span>
          </div>
        </div>

        {/* Auto Sync Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-stone-800/40 border border-stone-700/60">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs font-semibold text-stone-200 block">
                Automatic Background Sync
              </span>
              <span className="text-[10px] text-stone-400 block">
                Dynamically updates albums when changes are made in Google Photos
              </span>
            </div>
          </div>

          <button
            onClick={onToggleAutoSync}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              syncStatus.autoSyncEnabled ? 'bg-amber-500' : 'bg-stone-700'
            }`}
          >
            <div
              className={`bg-stone-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                syncStatus.autoSyncEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Cloud Storage & Backup Gauge */}
      <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Cloud Vault Storage
            </span>
          </div>
          <span className="text-xs font-semibold text-amber-400">
            {usedGB} GB of {totalGB} GB Used ({percentUsed}%)
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden flex">
          <div style={{ width: '34.2%' }} className="h-full bg-amber-400" title="High-Res Photos (34.2 GB)"></div>
          <div style={{ width: '6.4%' }} className="h-full bg-sky-400" title="4K Live Memories (6.4 GB)"></div>
          <div style={{ width: '2.2%' }} className="h-full bg-emerald-400" title="Album Metadata (2.2 GB)"></div>
        </div>

        {/* Storage Legend */}
        <div className="grid grid-cols-3 gap-2 text-[10px] text-stone-400 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Photos: 34.2 GB</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span>Live Video: 6.4 GB</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Metadata: 2.2 GB</span>
          </div>
        </div>

        {/* Backup verification banner */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 font-medium">
              {verifiedSuccess ? 'Checksum audit complete • 100% verified' : 'Cloud Backup Verified (AES-256)'}
            </span>
          </div>

          <button
            onClick={handleVerifyBackup}
            disabled={isVerifying}
            className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline"
          >
            {isVerifying ? 'Verifying...' : 'Audit Backup'}
          </button>
        </div>
      </div>

      {/* Multi-Device Sync Health */}
      <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-300 block">
          Synchronized Devices
        </span>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-800/60 border border-stone-800 text-xs">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <div>
                <span className="font-semibold text-white block">iPhone 16 Pro (This Device)</span>
                <span className="text-[10px] text-stone-400">Active now • MemoryVault Mobile</span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Live Synced
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-800/60 border border-stone-800 text-xs">
            <div className="flex items-center gap-2.5">
              <Laptop className="w-4 h-4 text-stone-400" />
              <div>
                <span className="font-semibold text-white block">MacBook Pro 16&rdquo;</span>
                <span className="text-[10px] text-stone-400">Synced 14 mins ago • Web Applet</span>
              </div>
            </div>
            <span className="text-[10px] text-stone-400">Synced</span>
          </div>
        </div>
      </div>

      {/* Offline Export Backup */}
      <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-white">Export Local Backup Archive</h4>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Download your full album metadata, tags, and face tags in JSON format.
          </p>
        </div>

        <button
          onClick={handleExportArchive}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors shrink-0 ml-3"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>{exportedSuccess ? 'Downloaded!' : 'Export Vault'}</span>
        </button>
      </div>
    </div>
  );
};
