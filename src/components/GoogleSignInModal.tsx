import React from 'react';
import { X, ShieldCheck, RefreshCw, Sparkles, FolderSync } from 'lucide-react';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
  isLoading,
  error,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl border border-stone-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-stone-900 tracking-tight">
              Connect Google Photos
            </h3>
            <p className="text-xs text-stone-500">
              Live library sync & automated organization
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6 text-sm text-stone-600">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-100">
            <FolderSync className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
            <p className="text-xs leading-relaxed text-stone-700">
              Dynamically reflects changes from your Google Photos app and organizes your library into themed albums.
            </p>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-xs leading-relaxed text-stone-700">
              Cloud-based backup keeps your memories safe, private, and synced across all your devices.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center gap-3">
          {/* Official Google Sign In Button styling */}
          <button
            onClick={onSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-white border border-stone-300 hover:border-stone-400 hover:bg-stone-50 shadow-xs font-medium text-stone-700 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin text-stone-600" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
            )}
            <span className="text-sm font-medium">
              {isLoading ? 'Connecting to Google...' : 'Continue with Google Photos'}
            </span>
          </button>

          <p className="text-[11px] text-stone-400 text-center">
            Access with permission from your Google Account. You can disconnect anytime.
          </p>
        </div>
      </div>
    </div>
  );
};
