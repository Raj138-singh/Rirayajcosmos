import React from 'react';
import { X, Play, Trash2, Bookmark, Film, HardDrive } from 'lucide-react';
import { Movie } from '../types';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistIds: string[];
  allMovies: Movie[];
  onPlayMovie: (movie: Movie) => void;
  onRemoveFromWatchlist: (movieId: string) => void;
  onOpenDrive?: () => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistIds,
  allMovies,
  onPlayMovie,
  onRemoveFromWatchlist,
  onOpenDrive,
}) => {
  if (!isOpen) return null;

  const savedMovies = allMovies.filter((m) => watchlistIds.includes(m.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Bookmark className="w-5 h-5 text-red-500 fill-red-500" />
              <span>Your Saved Watchlist ({savedMovies.length})</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              id="watchlist-drawer-close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {savedMovies.length > 0 ? (
              savedMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3 hover:border-slate-700 transition-colors"
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-14 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{movie.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {movie.genre} • ⭐ {movie.rating}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          onClose();
                          onPlayMovie(movie);
                        }}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-white" /> Watch
                      </button>

                      <button
                        onClick={() => onRemoveFromWatchlist(movie.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
                <Film className="w-12 h-12 text-slate-700" />
                <h4 className="text-base font-bold text-slate-300">Your Watchlist is Empty</h4>
                <p className="text-xs text-slate-500">
                  Click the "+" button on any movie card or detail view to save titles for later.
                </p>
              </div>
            )}
          </div>

          {/* Drawer Footer with Google Drive Sync */}
          {onOpenDrive && (
            <div className="p-4 bg-slate-950 border-t border-slate-800">
              <button
                onClick={() => {
                  onClose();
                  onOpenDrive();
                }}
                className="w-full py-2.5 px-4 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <HardDrive className="w-4 h-4 text-blue-400" />
                <span>Sync / Backup Watchlist with Google Drive</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
