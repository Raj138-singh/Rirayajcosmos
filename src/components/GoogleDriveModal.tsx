import React, { useState, useEffect } from 'react';
import {
  X,
  HardDrive,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  FileText,
  Video,
  Search,
  ExternalLink,
  Check,
  AlertCircle,
  Star,
  Film,
  Lock,
  LogOut,
  FolderPlus
} from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, logoutGoogle, initAuth, getAccessToken } from '../lib/firebaseAuth';
import {
  listDriveFiles,
  backupWatchlistToDrive,
  restoreWatchlistFromDrive,
  saveMovieNoteToDrive,
  deleteDriveFile,
  DriveFile
} from '../lib/driveService';
import { Movie } from '../types';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: string[];
  allMovies: Movie[];
  onUpdateWatchlist: (newWatchlist: string[]) => void;
  onPlayDriveVideo?: (videoUrl: string, title: string) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  watchlist,
  allMovies,
  onUpdateWatchlist,
  onPlayDriveVideo,
}) => {
  const [activeTab, setActiveTab] = useState<'backup' | 'videos' | 'notes'>('backup');
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(true);

  // Drive state
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [videoFiles, setVideoFiles] = useState<DriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Notes state
  const [selectedMovieForNote, setSelectedMovieForNote] = useState<string>(allMovies[0]?.id || '');
  const [noteRating, setNoteRating] = useState<number>(9);
  const [noteText, setNoteText] = useState<string>('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Sync state
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    actionLabel: string;
    onConfirm: () => void;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = initAuth(
      (u, token) => {
        setUser(u);
        setAccessToken(token);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, [isOpen]);

  // Fetch Drive files when token is available or tab changes
  useEffect(() => {
    if (accessToken && isOpen) {
      loadFiles();
    }
  }, [accessToken, isOpen, activeTab]);

  const loadFiles = async () => {
    if (!accessToken) return;
    setIsLoadingFiles(true);
    setStatusMessage(null);
    try {
      if (activeTab === 'videos') {
        const vids = await listDriveFiles(accessToken, searchQuery, 'video');
        setVideoFiles(vids);
      } else {
        const files = await listDriveFiles(accessToken, searchQuery);
        setDriveFiles(files);
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to load Google Drive files' });
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsAuthLoading(true);
    setStatusMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        setNeedsAuth(false);
        setStatusMessage({ type: 'success', text: `Connected as ${res.user.displayName || res.user.email}` });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Google Sign-In failed.' });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logoutGoogle();
    setUser(null);
    setAccessToken(null);
    setNeedsAuth(true);
    setDriveFiles([]);
    setVideoFiles([]);
    setStatusMessage({ type: 'info', text: 'Disconnected from Google Drive' });
  };

  const handleBackup = async () => {
    if (!accessToken) return;
    setIsBackingUp(true);
    setStatusMessage(null);
    try {
      const titles = watchlist
        .map((id) => allMovies.find((m) => m.id === id)?.title)
        .filter(Boolean) as string[];

      await backupWatchlistToDrive(accessToken, watchlist, titles);
      setStatusMessage({
        type: 'success',
        text: `Watchlist with ${watchlist.length} titles backed up to Google Drive folder 'Rirayajcosmos Movies'`,
      });
      loadFiles();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Backup failed.' });
    } finally {
      setIsBackingUp(false);
    }
  };

  const triggerRestore = () => {
    if (!accessToken) return;
    setConfirmModal({
      title: 'Restore Watchlist from Google Drive',
      message: 'This will replace your current browser watchlist with the data stored in Google Drive. Are you sure you want to proceed?',
      actionLabel: 'Yes, Restore Watchlist',
      onConfirm: async () => {
        setConfirmModal(null);
        setIsRestoring(true);
        setStatusMessage(null);
        try {
          const res = await restoreWatchlistFromDrive(accessToken);
          if (res && res.watchlistIds.length > 0) {
            onUpdateWatchlist(res.watchlistIds);
            setStatusMessage({
              type: 'success',
              text: `Restored ${res.watchlistIds.length} items from Google Drive (Backup date: ${new Date(res.updatedAt).toLocaleString()})`,
            });
          } else {
            setStatusMessage({ type: 'info', text: 'No Watchlist backup found in Google Drive.' });
          }
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: err.message || 'Restore failed.' });
        } finally {
          setIsRestoring(false);
        }
      },
    });
  };

  const triggerDeleteFile = (fileId: string, fileName: string) => {
    if (!accessToken) return;
    setConfirmModal({
      title: 'Delete Google Drive File',
      message: `Are you sure you want to permanently delete '${fileName}' from your Google Drive? This action cannot be undone.`,
      actionLabel: 'Delete File',
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await deleteDriveFile(accessToken, fileId);
          setStatusMessage({ type: 'success', text: `Deleted '${fileName}' from Google Drive.` });
          loadFiles();
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: err.message || 'Failed to delete file.' });
        }
      },
    });
  };

  const handleSaveNote = async () => {
    if (!accessToken) return;
    const targetMovie = allMovies.find((m) => m.id === selectedMovieForNote);
    if (!targetMovie) return;
    if (!noteText.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your review text before saving.' });
      return;
    }

    setIsSavingNote(true);
    setStatusMessage(null);
    try {
      const file = await saveMovieNoteToDrive(accessToken, targetMovie.title, noteRating, noteText);
      setStatusMessage({
        type: 'success',
        text: `Saved review for '${targetMovie.title}' to Google Drive ('Note_${targetMovie.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt')`,
      });
      setNoteText('');
      loadFiles();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save note.' });
    } finally {
      setIsSavingNote(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Google Drive Integration</span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Cloud Sync
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Backup watchlists, browse Drive media streams, and save movie logs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Auth Banner */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between text-xs">
          {user ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <span className="text-slate-300 font-medium">{user.displayName || user.email}</span>
                  <span className="ml-2 text-[10px] text-green-400 font-semibold">• Drive Connected</span>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="text-slate-400 hover:text-red-400 flex items-center gap-1 text-[11px] font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 text-amber-400">
                <Lock className="w-3.5 h-3.5" />
                <span>Sign in with Google to sync your data with Google Drive</span>
              </div>
              
              {/* Official Google Sign-In Button */}
              <button
                onClick={handleSignIn}
                disabled={isAuthLoading}
                className="gsi-material-button text-xs py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-xl border border-slate-300 shadow-sm flex items-center gap-2 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isAuthLoading ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Status Alert Banner */}
        {statusMessage && (
          <div
            className={`px-6 py-2.5 text-xs flex items-center justify-between ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/70 border-b border-emerald-800/60 text-emerald-300'
                : statusMessage.type === 'error'
                ? 'bg-red-950/70 border-b border-red-800/60 text-red-300'
                : 'bg-blue-950/70 border-b border-blue-800/60 text-blue-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="opacity-70 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-slate-900/30">
          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'backup'
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Watchlist Backup & Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'videos'
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Drive Video Streams</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Save Movie Notes to Drive</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!user ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <HardDrive className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h4 className="text-base font-bold text-white mb-1">Google Drive Access Required</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Connect your Google account to backup your personal watchlist, stream videos saved in Drive, and export movie review notes seamlessly.
                </p>
                <button
                  onClick={handleSignIn}
                  disabled={isAuthLoading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 mx-auto"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 48 48">
                    <path fill="#ffffff" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  </svg>
                  <span>Connect Google Drive</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: BACKUP & SYNC */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  {/* Action Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-red-400 font-bold text-xs mb-1">
                          <Upload className="w-4 h-4" />
                          <span>Backup to Cloud</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Save your currently selected watchlist ({watchlist.length} items) directly to Google Drive as <span className="font-mono text-slate-300">rirayajcosmos_watchlist.json</span>.
                        </p>
                      </div>

                      <button
                        onClick={handleBackup}
                        disabled={isBackingUp}
                        className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isBackingUp ? 'animate-spin' : ''}`} />
                        <span>{isBackingUp ? 'Backing up...' : 'Backup Watchlist Now'}</span>
                      </button>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs mb-1">
                          <Download className="w-4 h-4" />
                          <span>Restore from Cloud</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Restore saved watchlist items from your Google Drive folder back into your current session.
                        </p>
                      </div>

                      <button
                        onClick={triggerRestore}
                        disabled={isRestoring}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isRestoring ? 'Restoring...' : 'Restore from Google Drive'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Existing Drive files list */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <FolderPlus className="w-4 h-4 text-slate-400" />
                        <span>Drive Files in 'Rirayajcosmos Movies' Folder</span>
                      </h4>
                      <button
                        onClick={loadFiles}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Refresh</span>
                      </button>
                    </div>

                    {isLoadingFiles ? (
                      <div className="py-8 text-center text-xs text-slate-500 animate-pulse">
                        Loading files from Google Drive...
                      </div>
                    ) : driveFiles.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800/60">
                        No app files found in Google Drive yet. Click 'Backup Watchlist Now' to create your first cloud backup file.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {driveFiles.map((f) => (
                          <div
                            key={f.id}
                            className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                              <div className="truncate">
                                <p className="text-xs font-semibold text-white truncate">{f.name}</p>
                                <p className="text-[10px] text-slate-500 font-mono">
                                  Modified: {f.modifiedTime ? new Date(f.modifiedTime).toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {f.webViewLink && (
                                <a
                                  href={f.webViewLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                                  title="View on Google Drive"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                onClick={() => triggerDeleteFile(f.id, f.name)}
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                                title="Delete file"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: DRIVE VIDEO STREAMS */}
              {activeTab === 'videos' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search video files in Google Drive..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && loadFiles()}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <button
                      onClick={loadFiles}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white font-semibold rounded-xl transition-colors"
                    >
                      Search
                    </button>
                  </div>

                  {isLoadingFiles ? (
                    <div className="py-12 text-center text-xs text-slate-500 animate-pulse">
                      Searching video streams in Google Drive...
                    </div>
                  ) : videoFiles.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/40 rounded-2xl border border-slate-800/60 space-y-2">
                      <Video className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="font-semibold text-slate-300">No video files found in Google Drive</p>
                      <p className="text-[11px] text-slate-500">
                        Upload MP4, MKV, or WEBM video files to your Google Drive account, then search or refresh here to stream them.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {videoFiles.map((v) => (
                        <div
                          key={v.id}
                          className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-colors space-y-3"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                              <Film className="w-4 h-4" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-white truncate">{v.name}</p>
                              <p className="text-[10px] text-slate-500">
                                {v.size ? `${(parseInt(v.size) / (1024 * 1024)).toFixed(1)} MB` : 'Stream Ready'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                            {v.webViewLink && (
                              <a
                                href={v.webViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-center font-semibold text-[11px] transition-colors"
                              >
                                Open in Drive
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MOVIE NOTES & REVIEWS */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Export Custom Movie Note to Drive
                    </h4>

                    {/* Select Movie */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Select Movie
                      </label>
                      <select
                        value={selectedMovieForNote}
                        onChange={(e) => setSelectedMovieForNote(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                      >
                        {allMovies.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.title} ({m.year})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Personal Rating (1-10)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={noteRating}
                          onChange={(e) => setNoteRating(parseInt(e.target.value))}
                          className="flex-1 accent-red-600"
                        />
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1 w-12">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {noteRating}/10
                        </span>
                      </div>
                    </div>

                    {/* Note text */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Review / Private Notes
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Write your review, thoughts, or favorite quotes from this movie..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 resize-none"
                      />
                    </div>

                    <button
                      onClick={handleSaveNote}
                      disabled={isSavingNote}
                      className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{isSavingNote ? 'Saving to Drive...' : 'Save Note to Google Drive'}</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Custom Confirmation Modal Overlay */}
        {confirmModal && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">{confirmModal.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{confirmModal.message}</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmModal.onConfirm}
                  className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors"
                >
                  {confirmModal.actionLabel}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
