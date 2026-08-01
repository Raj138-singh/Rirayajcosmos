import React from 'react';
import { X, Play, Star, Plus, Check, Download, ShieldCheck, Share2, Film } from 'lucide-react';
import { Movie } from '../types';

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  onPlayTrailer: (movie: Movie) => void;
  watchlist: string[];
  onToggleWatchlist: (movieId: string) => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  onClose,
  onPlayTrailer,
  watchlist,
  onToggleWatchlist,
}) => {
  if (!movie) return null;

  const inWatchlist = watchlist.includes(movie.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Top Backdrop Image */}
        <div className="relative aspect-video sm:aspect-[21/9] bg-slate-950 overflow-hidden">
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/80 text-white flex items-center justify-center hover:bg-slate-800 transition-colors border border-slate-700"
            id="movie-details-close-btn"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title Overlay */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-red-600/30 border border-red-500/40 text-red-400 text-xs font-bold uppercase mb-1">
                {movie.badgeEmoji || '🎬'} {movie.genre}
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                {movie.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                onClose();
                onPlayTrailer(movie);
              }}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-transform hover:scale-105"
              id="details-play-trailer-btn"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Trailer Now</span>
            </button>

            <button
              onClick={() => onToggleWatchlist(movie.id)}
              className={`px-5 py-3.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-colors ${
                inWatchlist
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700'
              }`}
              id="details-watchlist-btn"
            >
              {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
            </button>

            <button
              onClick={() => alert(`Movie "${movie.title}" link copied to clipboard!`)}
              className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Share Movie"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Micro Specs */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400" /> {movie.rating} IMDb
            </span>
            <span>•</span>
            <span className="text-emerald-400">{movie.matchPercentage || 98}% Match</span>
            <span>•</span>
            <span>{movie.duration}</span>
            <span>•</span>
            <span>{movie.year}</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {movie.quality}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {movie.ageRating}
            </span>
          </div>

          {/* Synopsis */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Synopsis
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {movie.synopsis}
            </p>
          </div>

          {/* Cast & Director */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block mb-1">Director:</span>
              <span className="text-white font-medium">{movie.director}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block mb-1">Starring Cast:</span>
              <span className="text-white font-medium">{movie.cast.join(', ')}</span>
            </div>
          </div>

          {/* Offline Download Features Notice */}
          <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-white block">Download Available</span>
                <span className="text-slate-400">Standard & Premium plan users can download in 1080p HD for offline viewing.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
