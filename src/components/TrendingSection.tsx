import React from 'react';
import { Flame, Play, Star, Plus, Check, Info } from 'lucide-react';
import { Movie } from '../types';

interface TrendingSectionProps {
  movies: Movie[];
  onPlayMovie: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  watchlist: string[];
  onToggleWatchlist: (movieId: string) => void;
  onOpenPublishStudio?: () => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  movies,
  onPlayMovie,
  onOpenDetails,
  watchlist,
  onToggleWatchlist,
  onOpenPublishStudio,
}) => {
  const trendingMovies = movies.filter((m) => m.isTrending || m.isCustomUserPublished);
  const displayMovies = trendingMovies.length > 0 ? trendingMovies : movies;

  return (
    <section id="trending" className="py-12 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center">
              <Flame className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                Trending Now
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Most watched movies and web series on your platform
              </p>
            </div>
          </div>
          {onOpenPublishStudio && (
            <button
              onClick={onOpenPublishStudio}
              className="px-3.5 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-bold transition-colors"
            >
              + Publish Title
            </button>
          )}
        </div>

        {displayMovies.length === 0 ? (
          <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl text-center space-y-3">
            <p className="text-sm font-bold text-slate-300">No Trending Titles Yet</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              You have cleared all default movies. Publish your own custom movies or web series to display them here!
            </p>
            {onOpenPublishStudio && (
              <button
                onClick={onOpenPublishStudio}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors"
              >
                + Publish Your First Title
              </button>
            )}
          </div>
        ) : (
          /* Trending Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayMovies.map((movie, idx) => {
            const inWatchlist = watchlist.includes(movie.id);

            return (
              <div
                key={movie.id}
                className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-red-500/50 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-950/30 flex flex-col"
              >
                {/* Poster Container */}
                <div className="relative aspect-[16/10] sm:aspect-[2/3] overflow-hidden bg-slate-950">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {movie.rating}
                    </span>
                    <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow">
                      {movie.quality}
                    </span>
                  </div>

                  {/* Rank Number Badge */}
                  <div className="absolute bottom-2 left-3 text-5xl font-black text-white/20 select-none group-hover:text-red-500/40 transition-colors">
                    #{idx + 1}
                  </div>

                  {/* Quick Play Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
                    <button
                      onClick={() => onPlayMovie(movie)}
                      className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300"
                      title="Play Trailer"
                      id={`trending-play-${movie.id}`}
                    >
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </button>
                    
                    <button
                      onClick={() => onToggleWatchlist(movie.id)}
                      className={`w-10 h-10 rounded-full border text-white flex items-center justify-center transition-all ${
                        inWatchlist
                          ? 'bg-emerald-600 border-emerald-500'
                          : 'bg-slate-800/90 border-slate-700 hover:bg-slate-700'
                      }`}
                      title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      id={`trending-watchlist-${movie.id}`}
                    >
                      {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => onOpenDetails(movie)}
                      className="w-10 h-10 rounded-full bg-slate-800/90 border border-slate-700 text-white flex items-center justify-center hover:bg-slate-700 transition-all"
                      title="Details"
                      id={`trending-info-${movie.id}`}
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                      <span className="text-base">{movie.badgeEmoji || '🎥'}</span>
                      <span className="text-red-400 font-bold">{movie.genre}</span>
                      <span>•</span>
                      <span>{movie.year}</span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                      {movie.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {movie.synopsis}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-semibold">{movie.matchPercentage}% Match</span>
                    <span className="text-slate-400">{movie.duration}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
};
