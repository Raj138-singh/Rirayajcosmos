import React, { useState } from 'react';
import { Star, Play, Award, ArrowUpDown, Film, Plus, Check } from 'lucide-react';
import { Movie } from '../types';

interface TopRatedSectionProps {
  movies: Movie[];
  onPlayMovie: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  watchlist: string[];
  onToggleWatchlist: (movieId: string) => void;
}

export const TopRatedSection: React.FC<TopRatedSectionProps> = ({
  movies,
  onPlayMovie,
  onOpenDetails,
  watchlist,
  onToggleWatchlist,
}) => {
  const [sortBy, setSortBy] = useState<'rating' | 'title' | 'year'>('rating');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const topRatedMovies = [...movies]
    .filter((m) => m.rating >= 8.0 || m.isTopRated || m.isCustomUserPublished)
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return b.year - a.year;
    });

  const displayMovies = topRatedMovies.length > 0 ? topRatedMovies : movies;

  return (
    <section id="top-rated" className="py-16 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
                ⭐ Top Rated Movies
              </h2>
              <p className="text-sm text-slate-400">
                Critically acclaimed masterworks highest rated by CineVerse global audiences
              </p>
            </div>
          </div>

          {/* Controls: Sort & View Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-white focus:outline-none cursor-pointer"
              >
                <option value="rating" className="bg-slate-900">Highest Rating</option>
                <option value="title" className="bg-slate-900">Alphabetical</option>
                <option value="year" className="bg-slate-900">Release Year</option>
              </select>
            </div>

            <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  viewMode === 'table' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                id="top-rated-view-table"
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  viewMode === 'cards' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                id="top-rated-view-cards"
              >
                Grid View
              </button>
            </div>
          </div>
        </div>

        {/* Table View as specified in user prompt */}
        {viewMode === 'table' ? (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/90 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6">Movie</th>
                    <th className="py-4 px-6">Genre</th>
                    <th className="py-4 px-6 text-center">Rating</th>
                    <th className="py-4 px-6 text-center">Quality</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {displayMovies.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                        No titles available. Publish your first title in the Creator Studio!
                      </td>
                    </tr>
                  ) : (
                    displayMovies.map((movie) => {
                    const inWatchlist = watchlist.includes(movie.id);

                    return (
                      <tr
                        key={movie.id}
                        className="hover:bg-slate-800/50 transition-colors group"
                      >
                        {/* Movie Name & Poster */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <img
                              src={movie.posterUrl}
                              alt={movie.title}
                              className="w-12 h-16 object-cover rounded-lg shadow group-hover:scale-105 transition-transform"
                            />
                            <div>
                              <div className="font-bold text-white text-base group-hover:text-red-400 transition-colors">
                                {movie.title}
                              </div>
                              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                                <span>{movie.duration}</span>
                                <span>•</span>
                                <span>{movie.year}</span>
                                <span>•</span>
                                <span className="text-slate-300">{movie.director}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Genre */}
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                            {movie.genre}
                          </span>
                        </td>

                        {/* Rating */}
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-extrabold text-sm">
                            ⭐ {movie.rating}
                          </span>
                        </td>

                        {/* Quality */}
                        <td className="py-4 px-6 text-center">
                          <span className="px-2.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/80 text-xs font-bold">
                            {movie.quality}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onPlayMovie(movie)}
                              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-red-600/20 transition-all hover:scale-105"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                              <span>Trailer</span>
                            </button>

                            <button
                              onClick={() => onToggleWatchlist(movie.id)}
                              className={`p-2 rounded-xl border transition-colors ${
                                inWatchlist
                                  ? 'bg-emerald-600 border-emerald-500 text-white'
                                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                              }`}
                              title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                            >
                              {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Cards Grid Alternative View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayMovies.map((movie) => {
              const inWatchlist = watchlist.includes(movie.id);

              return (
                <div
                  key={movie.id}
                  className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all duration-300 p-4 flex flex-col justify-between space-y-4"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950">
                    <img
                      src={movie.backdropUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-xs font-extrabold px-2 py-0.5 rounded">
                      ⭐ {movie.rating}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase">{movie.genre}</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{movie.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{movie.synopsis}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <button
                      onClick={() => onPlayMovie(movie)}
                      className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5 fill-red-400" /> Watch Trailer
                    </button>
                    <button
                      onClick={() => onOpenDetails(movie)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Details
                    </button>
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
